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
  const [candidati, aziende] = await Promise.all([
    supabase.from('ifts_candidati').select('*').order('created_at', { ascending: false }),
    supabase.from('ifts_aziende').select('*').order('created_at', { ascending: false }),
  ])
  return NextResponse.json({ candidati: candidati.data || [], aziende: aziende.data || [] })
}

export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, tipo, stato } = await request.json()
  if (!id || !tipo || !stato) return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })

  const supabase = getSupabase()
  const table = tipo === 'candidato' ? 'ifts_candidati' : 'ifts_aziende'
  const { error } = await supabase.from(table).update({ stato }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
