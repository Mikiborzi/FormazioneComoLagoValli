import { NextResponse } from 'next/server'
import { getSupabaseAdmin, normalizzaPiva } from '@/app/lib/supabaseServer'
import { AVVISO, FASI, FAQ } from '@/app/data/guidaVoucher'

// POST /api/voucher/guida
// Body: { piva_cf, referente_email }
//
// Restituisce la guida operativa al voucher solo a chi dimostra di avere una
// pratica registrata. I contenuti vivono qui, lato server: se fossero importati
// dalla pagina client finirebbero nel bundle JS e sarebbero leggibili da
// chiunque, rendendo la sezione riservata solo in apparenza.
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 })
  }

  const piva = normalizzaPiva(body?.piva_cf)
  const email = String(body?.referente_email || '').trim().toLowerCase()

  if (!piva || !email) {
    return NextResponse.json(
      { error: 'P.IVA ed email referente sono obbligatori' },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  const { data: azienda, error } = await supabase
    .from('voucher_aziende')
    .select('id, ragione_sociale')
    .eq('piva_cf', piva)
    .ilike('referente_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('guida/azienda', error)
    return NextResponse.json({ error: 'Errore nella lettura della pratica' }, { status: 500 })
  }
  if (!azienda) {
    return NextResponse.json({ error: 'Nessuna pratica trovata con questi dati' }, { status: 404 })
  }

  // Serve solo il numero di partecipanti: nessun dato personale esce da qui.
  const { count, error: errPart } = await supabase
    .from('voucher_partecipanti')
    .select('id', { count: 'exact', head: true })
    .eq('azienda_id', azienda.id)

  if (errPart) {
    console.error('guida/partecipanti', errPart)
  }

  return NextResponse.json({
    ragione_sociale: azienda.ragione_sociale,
    numero_partecipanti: count ?? 0,
    avviso: AVVISO,
    fasi: FASI,
    faq: FAQ,
  })
}
