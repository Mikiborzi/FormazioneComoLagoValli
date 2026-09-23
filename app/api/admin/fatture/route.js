import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { edizioneAvviata } from '@/app/lib/edizioni'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function verificaToken(request) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === process.env.ADMIN_SESSION_TOKEN
}

// GET — fatture già registrate + suggerimenti calcolati per le coppie
// azienda/edizione (edizione avviata) che non hanno ancora nessuna fattura.
// L'importo suggerito è SEMPRE a prezzo pieno (costo corso × partecipanti):
// l'ente di formazione non applica sconti, è l'azienda a farsi rimborsare la
// propria quota dalla Regione con una domanda separata.
export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const supabase = getSupabase()

  const [edizioniRes, partRes, aziendeRes, fattureRes] = await Promise.all([
    supabase.from('edizioni_corso').select('*, corsi(id, nome, costo_partecipante)'),
    supabase.from('voucher_partecipanti').select('id, azienda_id, edizione_id').not('edizione_id', 'is', null),
    supabase.from('voucher_aziende').select('id, ragione_sociale, piva_cf, fascia_addetti'),
    supabase.from('fatture_voucher').select('*'),
  ])

  for (const res of [edizioniRes, partRes, aziendeRes, fattureRes]) {
    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 })
  }

  const aziendePerId = Object.fromEntries((aziendeRes.data || []).map((a) => [a.id, a]))
  const edizioniPerId = Object.fromEntries((edizioniRes.data || []).map((e) => [e.id, e]))
  const edizioniAvviate = (edizioniRes.data || []).filter(edizioneAvviata)

  // Conteggio partecipanti per coppia (edizione_id, azienda_id)
  const conteggi = {}
  for (const p of partRes.data || []) {
    if (!p.edizione_id || !p.azienda_id) continue
    const chiave = `${p.edizione_id}|${p.azienda_id}`
    conteggi[chiave] = (conteggi[chiave] || 0) + 1
  }

  const coppieConFattura = new Set(
    (fattureRes.data || []).map((f) => `${f.edizione_id}|${f.azienda_id}`)
  )

  const suggerimenti = []
  for (const edizione of edizioniAvviate) {
    const costo = edizione.corsi?.costo_partecipante
    for (const [chiave, numeroPartecipanti] of Object.entries(conteggi)) {
      const [edizioneId, aziendaId] = chiave.split('|')
      if (edizioneId !== edizione.id) continue
      if (coppieConFattura.has(chiave)) continue
      const azienda = aziendePerId[aziendaId]
      if (!azienda) continue
      suggerimenti.push({
        azienda_id: aziendaId,
        edizione_id: edizioneId,
        ragione_sociale: azienda.ragione_sociale,
        piva_cf: azienda.piva_cf,
        fascia_addetti: azienda.fascia_addetti,
        numero_partecipanti: numeroPartecipanti,
        importo_computato: costo != null ? Number(costo) * numeroPartecipanti : null,
        corso_nome: edizione.corsi?.nome,
        edizione_nome: edizione.nome,
      })
    }
  }

  const fatture = (fattureRes.data || []).map((f) => ({
    ...f,
    ragione_sociale: aziendePerId[f.azienda_id]?.ragione_sociale,
    piva_cf: aziendePerId[f.azienda_id]?.piva_cf,
    edizione_nome: edizioniPerId[f.edizione_id]?.nome,
    corso_nome: edizioniPerId[f.edizione_id]?.corsi?.nome,
  }))

  return NextResponse.json({ fatture, suggerimenti })
}

// POST — crea una riga fattura, congelando lo snapshot del calcolo al momento
// della creazione. Body: { azienda_id, edizione_id, importo?, numero_fattura?, data_emissione?, stato? }
export async function POST(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const body = await request.json()
  if (!body?.azienda_id || !body?.edizione_id) {
    return NextResponse.json({ error: 'azienda_id ed edizione_id sono obbligatori' }, { status: 400 })
  }

  const supabase = getSupabase()

  const [aziendaRes, edizioneRes, countRes] = await Promise.all([
    supabase.from('voucher_aziende').select('fascia_addetti').eq('id', body.azienda_id).single(),
    supabase.from('edizioni_corso').select('*, corsi(costo_partecipante)').eq('id', body.edizione_id).single(),
    supabase
      .from('voucher_partecipanti')
      .select('id', { count: 'exact', head: true })
      .eq('azienda_id', body.azienda_id)
      .eq('edizione_id', body.edizione_id),
  ])

  const costo = edizioneRes.data?.corsi?.costo_partecipante
  const numeroPartecipanti = countRes.count || 0
  const importoComputato = costo != null ? Number(costo) * numeroPartecipanti : null

  const { data, error } = await supabase
    .from('fatture_voucher')
    .insert({
      azienda_id: body.azienda_id,
      edizione_id: body.edizione_id,
      importo: body.importo ?? importoComputato,
      importo_computato: importoComputato,
      fascia_addetti_snapshot: aziendaRes.data?.fascia_addetti || null,
      numero_partecipanti_snapshot: numeroPartecipanti,
      numero_fattura: body.numero_fattura || null,
      data_emissione: body.data_emissione || null,
      stato: body.stato || 'da_emettere',
      note: body.note || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ fattura: data })
}

// PATCH — aggiorna numero_fattura/data_emissione/stato/importo/note. Body: { id, ...campi }
export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, ...campi } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const consentiti = ['importo', 'numero_fattura', 'data_emissione', 'stato', 'note']
  const update = {}
  for (const k of consentiti) if (k in campi) update[k] = campi[k]
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }
  update.updated_at = new Date().toISOString()

  const supabase = getSupabase()
  const { error } = await supabase.from('fatture_voucher').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
