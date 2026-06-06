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
  return auth.replace('Bearer ', '') === process.env.ADMIN_SESSION_TOKEN
}

export async function GET(request) {
  if (!verificaToken(request)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const supabase = getSupabase()
  const { data: contatti } = await supabase
    .from('contatti')
    .select('*, interazioni(id,canale,tipo,oggetto,stato,created_at,note_operatore,dati)')
    .order('created_at', { ascending: false })

  return NextResponse.json(contatti || [])
}

export async function PATCH(request) {
  if (!verificaToken(request)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const body = await request.json()
  const supabase = getSupabase()

  if (body.target === 'contatto') {
    const { id, note } = body
    const { error } = await supabase.from('contatti').update({ note }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else if (body.target === 'interazione') {
    const { id, stato, note_operatore } = body
    const update = {}
    if (stato !== undefined) update.stato = stato
    if (note_operatore !== undefined) update.note_operatore = note_operatore
    const { error } = await supabase.from('interazioni').update(update).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
