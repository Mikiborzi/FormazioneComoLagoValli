import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.toLowerCase().trim()
  if (!email || !email.includes('@')) return NextResponse.json(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data } = await supabase
    .from('contatti')
    .select('nome,cognome,telefono,ragione_sociale,partita_iva,codice_fiscale,indirizzo,cap,citta,provincia,nazione,azienda')
    .eq('email', email)
    .maybeSingle()

  return NextResponse.json(data)
}
