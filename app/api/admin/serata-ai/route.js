import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/app/lib/supabaseServer'

const STATI = ['nuovo', 'confermato', 'presente', 'assente', 'annullato']

function verificaToken(request) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return Boolean(token) && token === process.env.ADMIN_SESSION_TOKEN
}

// GET — tutte le iscrizioni alle serate, le più recenti prima.
export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('serata_iscrizioni')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ iscrizioni: data || [] })
}

// PATCH — aggiorna stato e/o note. Body: { id, stato?, note_operatore? }
export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, stato, note_operatore } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const update = {}
  if (stato !== undefined) {
    if (!STATI.includes(stato)) return NextResponse.json({ error: 'Stato non valido' }, { status: 400 })
    update.stato = stato
  }
  if (note_operatore !== undefined) update.note_operatore = note_operatore
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('serata_iscrizioni').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
