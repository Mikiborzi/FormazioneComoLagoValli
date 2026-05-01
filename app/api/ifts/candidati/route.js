import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  const body = await request.json()
  const { nome, cognome, email, telefono, data_nascita, titolo_studio, anno_titolo, indirizzo_interesse, ha_azienda, nome_azienda, note } = body

  if (!nome || !cognome || !email) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('ifts_candidati').insert([{
    nome, cognome, email, telefono, data_nascita: data_nascita || null,
    titolo_studio, anno_titolo: anno_titolo ? parseInt(anno_titolo) : null,
    indirizzo_interesse, ha_azienda: !!ha_azienda,
    nome_azienda: ha_azienda ? nome_azienda : null, note
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
