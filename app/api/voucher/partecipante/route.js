import { NextResponse } from 'next/server'
import { getSupabaseAdmin, pick, CAMPI_PARTECIPANTE } from '@/app/lib/supabaseServer'

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

  // Verifica che la pratica esista
  const { data: azienda } = await supabase
    .from('voucher_aziende').select('id').eq('id', aziendaId).maybeSingle()
  if (!azienda) return NextResponse.json({ error: 'Pratica azienda inesistente' }, { status: 404 })

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

// PATCH /api/voucher/partecipante — modifica un partecipante. Body: { id, ...campi }
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

// DELETE /api/voucher/partecipante?id=...
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = String(searchParams.get('id') || '').trim()
  if (!id) return NextResponse.json({ error: 'id partecipante mancante' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('voucher_partecipanti').delete().eq('id', id)

  if (error) {
    console.error('partecipante/DELETE', error)
    return NextResponse.json({ error: 'Errore nella rimozione del partecipante' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
