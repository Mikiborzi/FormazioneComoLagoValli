import { NextResponse } from 'next/server'
import { getSupabaseAdmin, normalizzaPiva } from '@/app/lib/supabaseServer'

// POST /api/voucher/riprendi
// Body: { piva_cf, referente_email }
// Riapre una pratica esistente verificando P.IVA + email referente.
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
    return NextResponse.json({ error: 'P.IVA ed email referente sono obbligatori' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data: azienda, error } = await supabase
    .from('voucher_aziende')
    .select('*')
    .eq('piva_cf', piva)
    .ilike('referente_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('riprendi/azienda', error)
    return NextResponse.json({ error: 'Errore nella lettura della pratica' }, { status: 500 })
  }
  if (!azienda) {
    return NextResponse.json({ error: 'Nessuna pratica trovata con questi dati' }, { status: 404 })
  }

  const { data: partecipanti, error: errPart } = await supabase
    .from('voucher_partecipanti')
    .select('*')
    .eq('azienda_id', azienda.id)
    .order('created_at', { ascending: true })

  if (errPart) {
    console.error('riprendi/partecipanti', errPart)
    return NextResponse.json({ error: 'Errore nella lettura dei partecipanti' }, { status: 500 })
  }

  return NextResponse.json({ azienda, partecipanti: partecipanti || [] })
}
