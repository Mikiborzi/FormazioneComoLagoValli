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

// PATCH — assegna (o rimuove, con edizione_id: null) un partecipante a un'edizione.
// Body: { id, edizione_id }
// Restituisce un avviso soft (non blocco) se l'edizione supera i posti_max: la
// capienza di 10 è la norma ma un admin potrebbe scegliere di sforare di un posto.
export async function PATCH(request) {
  if (!verificaToken(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  const { id, edizione_id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id mancante' }, { status: 400 })

  const supabase = getSupabase()

  const { error } = await supabase
    .from('voucher_partecipanti')
    .update({ edizione_id: edizione_id || null, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!edizione_id) return NextResponse.json({ ok: true })

  const [edizioneRes, countRes] = await Promise.all([
    supabase.from('edizioni_corso').select('posti_max').eq('id', edizione_id).single(),
    supabase.from('voucher_partecipanti').select('id', { count: 'exact', head: true }).eq('edizione_id', edizione_id),
  ])

  const postiMax = edizioneRes.data?.posti_max ?? 10
  const occupati = countRes.count || 0
  const avviso = occupati > postiMax
    ? `Attenzione: questa edizione ha ora ${occupati} iscritti su ${postiMax} posti previsti.`
    : null

  return NextResponse.json({ ok: true, posti_occupati: occupati, posti_max: postiMax, avviso })
}
