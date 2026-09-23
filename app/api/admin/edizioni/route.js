import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { trovaConflittiSede } from '@/app/lib/edizioni'

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

// GET — elenco edizioni, con corso annidato e conteggio iscritti/uditori.
export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const supabase = getSupabase()

  const [edizioniRes, partRes, uditoriRes] = await Promise.all([
    supabase
      .from('edizioni_corso')
      .select('*, corsi(id, nome, codice_catalogo, costo_partecipante)')
      .order('data_inizio', { ascending: true }),
    supabase.from('voucher_partecipanti').select('id, edizione_id').not('edizione_id', 'is', null),
    supabase.from('edizione_uditori').select('id, edizione_id'),
  ])

  if (edizioniRes.error) return NextResponse.json({ error: edizioniRes.error.message }, { status: 500 })
  if (partRes.error) return NextResponse.json({ error: partRes.error.message }, { status: 500 })
  if (uditoriRes.error) return NextResponse.json({ error: uditoriRes.error.message }, { status: 500 })

  const iscrittiPerEdizione = {}
  for (const p of partRes.data || []) {
    iscrittiPerEdizione[p.edizione_id] = (iscrittiPerEdizione[p.edizione_id] || 0) + 1
  }
  const uditoriPerEdizione = {}
  for (const u of uditoriRes.data || []) {
    uditoriPerEdizione[u.edizione_id] = (uditoriPerEdizione[u.edizione_id] || 0) + 1
  }

  const edizioni = (edizioniRes.data || []).map((e) => ({
    ...e,
    numero_iscritti: iscrittiPerEdizione[e.id] || 0,
    numero_uditori: uditoriPerEdizione[e.id] || 0,
  }))

  return NextResponse.json({ edizioni })
}

// POST — crea una nuova edizione. Segnala (senza bloccare) conflitti di sede/data
// con edizioni esistenti: la sede è testo libero, decide l'admin come procedere.
export async function POST(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const body = await request.json()
  if (!body?.corso_id) return NextResponse.json({ error: 'corso_id obbligatorio' }, { status: 400 })

  const supabase = getSupabase()

  const { data: esistenti, error: errEsistenti } = await supabase
    .from('edizioni_corso')
    .select('id, sede, calendario, stato')
  if (errEsistenti) return NextResponse.json({ error: errEsistenti.message }, { status: 500 })

  const conflitti = trovaConflittiSede(body, esistenti || [])

  const { data, error } = await supabase
    .from('edizioni_corso')
    .insert({
      corso_id: body.corso_id,
      nome: body.nome || null,
      data_inizio: body.data_inizio || null,
      data_fine: body.data_fine || null,
      sede: body.sede || null,
      calendario: body.calendario || null,
      posti_max: body.posti_max ?? 10,
      stato: body.stato || 'pianificata',
      note: body.note || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ edizione: data, conflitti })
}

// PATCH — aggiorna un'edizione esistente. Body: { id, ...campi }
// Stessa segnalazione di conflitto su sede/date; blocca (con avviso esplicito,
// non hard-fail impossibile da superare) il passaggio a "annullata" se esistono
// già fatture collegate — l'admin deve confermare con conferma_annullamento: true.
export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, conferma_annullamento, ...campi } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const supabase = getSupabase()

  if (campi.stato === 'annullata' && !conferma_annullamento) {
    const { count, error: errFatture } = await supabase
      .from('fatture_voucher')
      .select('id', { count: 'exact', head: true })
      .eq('edizione_id', id)
    if (errFatture) return NextResponse.json({ error: errFatture.message }, { status: 500 })
    if ((count || 0) > 0) {
      return NextResponse.json(
        { error: `Questa edizione ha già ${count} fattura/e collegata/e. Conferma esplicitamente per annullarla comunque.`, richiedeConferma: true },
        { status: 409 }
      )
    }
  }

  let conflitti = []
  if (campi.sede || campi.calendario) {
    const { data: esistenti, error: errEsistenti } = await supabase
      .from('edizioni_corso')
      .select('id, sede, calendario, stato')
    if (errEsistenti) return NextResponse.json({ error: errEsistenti.message }, { status: 500 })
    const { data: attuale } = await supabase.from('edizioni_corso').select('sede, calendario').eq('id', id).single()
    conflitti = trovaConflittiSede({ id, sede: campi.sede ?? attuale?.sede, calendario: campi.calendario ?? attuale?.calendario }, esistenti || [])
  }

  const consentiti = ['corso_id', 'nome', 'data_inizio', 'data_fine', 'sede', 'calendario', 'posti_max', 'stato', 'note']
  const update = {}
  for (const k of consentiti) if (k in campi) update[k] = campi[k]
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }
  update.updated_at = new Date().toISOString()

  const { error } = await supabase.from('edizioni_corso').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, conflitti })
}
