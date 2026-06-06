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

export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const supabase = getSupabase()
  const [iscrizioni, contatti] = await Promise.all([
    supabase.from('iscrizioni_impresa').select('*').order('created_at', { ascending: false }),
    supabase.from('contatti_impresa').select('*').order('created_at', { ascending: false }),
  ])
  return NextResponse.json({ iscrizioni: iscrizioni.data || [], contatti: contatti.data || [] })
}

export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, tipo, stato, note_operatore } = await request.json()
  if (!id || !tipo) return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })

  const supabase = getSupabase()
  const table = tipo === 'iscrizione' ? 'iscrizioni_impresa' : 'contatti_impresa'
  const update = {}
  if (stato) update.stato = stato
  if (note_operatore !== undefined) update.note_operatore = note_operatore

  const { error } = await supabase.from(table).update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
