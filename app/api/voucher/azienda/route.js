import { NextResponse } from 'next/server'
import {
  getSupabaseAdmin,
  pick,
  normalizzaPiva,
  verificaAccessoPratica,
  CAMPI_AZIENDA,
  CAMPI_AZIENDA_MODIFICABILI,
} from '@/app/lib/supabaseServer'

const OBBLIGATORI = [
  'ragione_sociale', 'piva_cf', 'sede_operativa', 'numero_addetti',
  'referente_nome', 'referente_cognome', 'referente_email', 'referente_telefono',
  'legale_rappresentante_nome', 'legale_rappresentante_cognome', 'legale_rappresentante_cf',
]

// POST /api/voucher/azienda — crea una nuova pratica azienda.
// Se la P.IVA è già registrata risponde 409 (l'azienda deve riprendere la pratica).
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 })
  }

  const dati = pick(body, CAMPI_AZIENDA)
  if (dati.piva_cf) dati.piva_cf = normalizzaPiva(dati.piva_cf)

  const mancanti = OBBLIGATORI.filter((c) => !dati[c])
  if (mancanti.length) {
    return NextResponse.json({ error: `Campi obbligatori mancanti: ${mancanti.join(', ')}` }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const giaRegistrata = NextResponse.json(
    { error: 'esiste_gia', message: 'Esiste già una pratica per questa P.IVA. Riprendila inserendo P.IVA ed email del referente.' },
    { status: 409 }
  )

  // Evita doppioni: se la P.IVA esiste già, invita a riprendere la pratica.
  // L'errore va propagato, non ignorato: trattarlo come "nessun risultato"
  // creerebbe una seconda pratica per la stessa azienda.
  const { data: esistente, error: errCheck } = await supabase
    .from('voucher_aziende')
    .select('id')
    .eq('piva_cf', dati.piva_cf)
    .maybeSingle()

  if (errCheck) {
    console.error('azienda/POST check', errCheck)
    return NextResponse.json({ error: 'Errore nella verifica della P.IVA' }, { status: 500 })
  }
  if (esistente) return giaRegistrata

  const { data, error } = await supabase
    .from('voucher_aziende')
    .insert([dati])
    .select()
    .single()

  if (error) {
    // Due richieste simultanee possono superare entrambe il controllo qui sopra:
    // l'indice unique è l'unica garanzia reale contro i doppioni.
    if (error.code === '23505') return giaRegistrata
    console.error('azienda/POST', error)
    return NextResponse.json({ error: 'Errore nel salvataggio dei dati azienda' }, { status: 500 })
  }

  return NextResponse.json({ azienda: data }, { status: 201 })
}

// PATCH /api/voucher/azienda — aggiorna i dati di una pratica esistente.
// Body: { id, token, ...campi }  ·  con { concludi: true } segna la pratica come conclusa.
export async function PATCH(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 })
  }

  const id = String(body?.id || '').trim()
  if (!id) return NextResponse.json({ error: 'id azienda mancante' }, { status: 400 })

  const supabase = getSupabaseAdmin()

  const pratica = await verificaAccessoPratica(supabase, id, body?.token)
  if (!pratica) {
    return NextResponse.json({ error: 'Accesso alla pratica non autorizzato' }, { status: 403 })
  }

  const dati = body?.concludi
    ? { conclusa_il: new Date().toISOString() }
    : pick(body, CAMPI_AZIENDA_MODIFICABILI)

  if (Object.keys(dati).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('voucher_aziende')
    .update(dati)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('azienda/PATCH', error)
    return NextResponse.json({ error: 'Errore nell\'aggiornamento dei dati azienda' }, { status: 500 })
  }

  return NextResponse.json({ azienda: data })
}
