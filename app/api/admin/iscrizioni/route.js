import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('iscrizioni')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PATCH(request) {
  const supabase = getSupabase()
  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return Response.json({ error: 'id mancante' }, { status: 400 })
  const { error } = await supabase.from('iscrizioni').update(fields).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
