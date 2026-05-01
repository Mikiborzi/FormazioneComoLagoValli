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
  const {
    ragione_sociale, piva, settore,
    referente_nome, referente_cognome, referente_email, referente_telefono, referente_ruolo,
    tipo_interesse, n_giovani_previsti, indirizzi_interesse, note
  } = body

  if (!ragione_sociale || !referente_nome || !referente_cognome || !referente_email) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('ifts_aziende').insert([{
    ragione_sociale, piva, settore,
    referente_nome, referente_cognome, referente_email, referente_telefono, referente_ruolo,
    tipo_interesse, n_giovani_previsti: n_giovani_previsti ? parseInt(n_giovani_previsti) : null,
    indirizzi_interesse: indirizzi_interesse || [], note
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
