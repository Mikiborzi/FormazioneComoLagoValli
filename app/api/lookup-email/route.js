import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/app/lib/supabaseServer'

// GET /api/lookup-email — precompila il form con l'anagrafica di chi è loggato.
//
// Non accetta un'email arbitraria: restituisce solo i dati dell'utente
// autenticato. Diversamente sarebbe un servizio di lookup PII aperto a
// internet — chiunque, inserendo un indirizzo altrui, otterrebbe nome,
// telefono, codice fiscale, P.IVA e indirizzo del titolare.
export async function GET() {
  const cookieStore = await cookies()

  // Client legato alla sessione del browser (cookie scritti da createBrowserClient).
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // sola lettura: la route non rinnova la sessione
      },
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user?.email) return NextResponse.json(null)

  // Lettura dell'anagrafica con service role, ma vincolata all'email della
  // sessione verificata: l'utente può vedere solo la propria scheda.
  const { data, error } = await getSupabaseAdmin()
    .from('contatti')
    .select('nome,cognome,telefono,ragione_sociale,partita_iva,codice_fiscale,indirizzo,cap,citta,provincia,nazione,azienda')
    .eq('email', user.email.toLowerCase())
    .maybeSingle()

  if (error) {
    console.error('lookup-email', error)
    return NextResponse.json(null)
  }
  if (!data) return NextResponse.json(null)

  // L'email torna al client così il form può precompilare solo quando il campo
  // contiene davvero l'indirizzo di chi è loggato (e non quello di un terzo).
  return NextResponse.json({ ...data, email: user.email })
}
