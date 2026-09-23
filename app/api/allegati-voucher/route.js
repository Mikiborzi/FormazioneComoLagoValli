import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Endpoint pubblico: restituisce solo le versioni attive, per la vista sulla pagina AI Academy
export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('allegati_voucher')
    .select('id, codice, titolo, descrizione, versione, data_verifica, file_url, file_nome')
    .eq('attivo', true)
    .order('codice', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
