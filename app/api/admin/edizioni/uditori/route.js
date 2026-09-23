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

// GET — elenco uditori, opzionalmente filtrato per edizione (?edizione_id=...)
export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const edizioneId = new URL(request.url).searchParams.get('edizione_id')
  const supabase = getSupabase()
  let query = supabase.from('edizione_uditori').select('*').order('created_at', { ascending: true })
  if (edizioneId) query = query.eq('edizione_id', edizioneId)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ uditori: data || [] })
}

// POST — aggiunge un uditore a un'edizione. Body: { edizione_id, nome, cognome, email?, telefono?, note? }
export async function POST(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const body = await request.json()
  if (!body?.edizione_id || !body?.nome || !body?.cognome) {
    return NextResponse.json({ error: 'edizione_id, nome e cognome sono obbligatori' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('edizione_uditori')
    .insert({
      edizione_id: body.edizione_id,
      nome: body.nome,
      cognome: body.cognome,
      email: body.email || null,
      telefono: body.telefono || null,
      note: body.note || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ uditore: data })
}

// DELETE — rimuove un uditore. Body: { id }
export async function DELETE(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const supabase = getSupabase()
  const { error } = await supabase.from('edizione_uditori').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
