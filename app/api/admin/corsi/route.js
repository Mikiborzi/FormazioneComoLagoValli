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

// GET — elenco corsi a catalogo.
export async function GET(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('corsi')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ corsi: data || [] })
}

// POST — crea un nuovo corso a catalogo. Body: { nome, codice_catalogo?, costo_partecipante?, ore_totali?, esente_iva? }
export async function POST(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const body = await request.json()
  if (!body?.nome) return NextResponse.json({ error: 'Il nome del corso è obbligatorio' }, { status: 400 })

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('corsi')
    .insert({
      nome: body.nome,
      codice_catalogo: body.codice_catalogo || null,
      costo_partecipante: body.costo_partecipante ?? null,
      ore_totali: body.ore_totali ?? null,
      esente_iva: body.esente_iva ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ corso: data })
}

// PATCH — aggiorna un corso esistente. Body: { id, ...campi }
export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, ...campi } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const consentiti = ['nome', 'codice_catalogo', 'costo_partecipante', 'ore_totali', 'esente_iva', 'attivo']
  const update = {}
  for (const k of consentiti) if (k in campi) update[k] = campi[k]
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }
  update.updated_at = new Date().toISOString()

  const supabase = getSupabase()
  const { error } = await supabase.from('corsi').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
