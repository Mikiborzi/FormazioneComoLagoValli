import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

// GET — restituisce le aziende voucher con i relativi partecipanti annidati.
export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const supabase = getSupabase()
  const [aziendeRes, partRes] = await Promise.all([
    supabase.from('voucher_aziende').select('*').order('created_at', { ascending: false }),
    supabase.from('voucher_partecipanti').select('*').order('created_at', { ascending: true }),
  ])

  if (aziendeRes.error) {
    return NextResponse.json({ error: aziendeRes.error.message }, { status: 500 })
  }

  const partPerAzienda = {}
  for (const p of partRes.data || []) {
    ;(partPerAzienda[p.azienda_id] ||= []).push(p)
  }
  const aziende = (aziendeRes.data || []).map((a) => ({
    ...a,
    partecipanti: partPerAzienda[a.id] || [],
  }))

  return NextResponse.json({ aziende })
}

// PATCH — aggiorna lo stato/note di un'azienda voucher. Body: { id, stato?, note_operatore? }
export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, stato, note_operatore } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const update = {}
  if (stato) update.stato = stato
  if (note_operatore !== undefined) update.note_operatore = note_operatore
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('voucher_aziende').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
