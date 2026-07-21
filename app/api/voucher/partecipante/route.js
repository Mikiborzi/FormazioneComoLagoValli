import { NextResponse } from 'next/server'
import {
  getSupabaseAdmin,
  pick,
  verificaAccessoPratica,
  CAMPI_PARTECIPANTE,
} from '@/app/lib/supabaseServer'

const NON_AUTORIZZATO = () =>
  NextResponse.json({ error: 'Accesso alla pratica non autorizzato' }, { status: 403 })

// Un partecipante si tocca solo dimostrando l'accesso alla pratica che lo
// contiene: risale dall'id del partecipante alla sua azienda e verifica il token.
async function autorizzaPartecipante(supabase, partecipanteId, token) {
  const { data: partecipante, error } = await supabase
    .from('voucher_partecipanti')
    .select('id, azienda_id')
    .eq('id', partecipanteId)
    .maybeSingle()

  if (error) {
    console.error('partecipante/autorizza', error)
    return null
  }
  if (!partecipante) return null

  const pratica = await verificaAccessoPratica(supabase, partecipante.azienda_id, token)
  return pratica ? partecipante : null
}

const OBBLIGATORI = [
  'nome', 'cognome', 'codice_fiscale', 'data_nascita', 'luogo_nascita', 'sesso',
  'cittadinanza', 'titolo_studio', 'indirizzo', 'comune', 'provincia', 'cap',
  'tipologia_rapporto', 'orario_lavoro', 'email', 'telefono',
]

// POST /api/voucher/partecipante — aggiunge un partecipante a una pratica.
// Body: { azienda_id, ...campi }
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 })
  }

  const aziendaId = String(body?.azienda_id || '').trim()
  if (!aziendaId) return NextResponse.json({ error: 'azienda_id mancante' }, { status: 400 })

  const dati = pick(body, CAMPI_PARTECIPANTE)
  const mancanti = OBBLIGATORI.filter((c) => !dati[c])
  if (mancanti.length) {
    return NextResponse.json({ error: `Campi obbligatori mancanti: ${mancanti.join(', ')}` }, { status: 400 })
  }
  if (!dati.privacy_firmata) {
    return NextResponse.json({ error: 'Serve la conferma dell\'informativa privacy' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Verifica che la pratica esista e che il chiamante ne abbia il token
  const azienda = await verificaAccessoPratica(supabase, aziendaId, body?.token)
  if (!azienda) return NON_AUTORIZZATO()

  const { data, error } = await supabase
    .from('voucher_partecipanti')
    .insert([{ ...dati, azienda_id: aziendaId }])
    .select()
    .single()

  if (error) {
    console.error('partecipante/POST', error)
    return NextResponse.json({ error: 'Errore nel salvataggio del partecipante' }, { status: 500 })
  }

  return NextResponse.json({ partecipante: data }, { status: 201 })
}

// PATCH /api/voucher/partecipante — modifica un partecipante. Body: { id, token, ...campi }
export async function PATCH(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 })
  }

  const id = String(body?.id || '').trim()
  if (!id) return NextResponse.json({ error: 'id partecipante mancante' }, { status: 400 })

  const dati = pick(body, CAMPI_PARTECIPANTE)
  if (Object.keys(dati).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  if (!(await autorizzaPartecipante(supabase, id, body?.token))) return NON_AUTORIZZATO()

  const { data, error } = await supabase
    .from('voucher_partecipanti')
    .update(dati)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('partecipante/PATCH', error)
    return NextResponse.json({ error: 'Errore nell\'aggiornamento del partecipante' }, { status: 500 })
  }

  return NextResponse.json({ partecipante: data })
}

// DELETE /api/voucher/partecipante?id=...&token=...
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = String(searchParams.get('id') || '').trim()
  if (!id) return NextResponse.json({ error: 'id partecipante mancante' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  if (!(await autorizzaPartecipante(supabase, id, searchParams.get('token')))) return NON_AUTORIZZATO()

  const { error } = await supabase.from('voucher_partecipanti').delete().eq('id', id)

  if (error) {
    console.error('partecipante/DELETE', error)
    return NextResponse.json({ error: 'Errore nella rimozione del partecipante' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
