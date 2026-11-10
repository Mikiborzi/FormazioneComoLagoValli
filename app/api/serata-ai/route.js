import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/app/lib/supabaseServer'
import { SERATA_AI, INTERESSI_SERATA, iscrizioniSerataAperte } from '@/app/lib/serataAi'

// Lo stato dei posti cambia a ogni iscrizione: mai servirlo da cache.
export const dynamic = 'force-dynamic'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CHIAVI_INTERESSI = new Set(INTERESSI_SERATA.map((i) => i.key))

function testo(value, max = 200) {
  const s = String(value ?? '').trim()
  return s === '' ? null : s.slice(0, max)
}

// Posti ancora liberi: capienza meno la somma di num_persone delle
// iscrizioni dell'evento non annullate.
async function postiResidui(supabase) {
  const { data, error } = await supabase
    .from('serata_iscrizioni')
    .select('num_persone')
    .eq('evento', SERATA_AI.slug)
    .neq('stato', 'annullato')
  if (error) throw error
  const occupati = data.reduce((somma, r) => somma + (r.num_persone || 0), 0)
  return Math.max(0, SERATA_AI.postiMassimi - occupati)
}

function messaggioPostiResidui(n) {
  return n === 1
    ? 'Resta solo 1 posto disponibile: riduci il numero di persone.'
    : `Restano solo ${n} posti disponibili: riduci il numero di persone.`
}

// GET — stato del modulo, letto dalla pagina all'apertura:
// { aperte, motivo: null | 'scadenza' | 'esauriti', postiResidui }.
export async function GET() {
  if (!iscrizioniSerataAperte()) {
    return NextResponse.json({ aperte: false, motivo: 'scadenza', postiResidui: 0 })
  }
  try {
    const residui = await postiResidui(getSupabaseAdmin())
    return NextResponse.json({
      aperte: residui > 0,
      motivo: residui > 0 ? null : 'esauriti',
      postiResidui: residui,
    })
  } catch (error) {
    console.error('serata-ai GET', error)
    return NextResponse.json({ error: 'Stato non disponibile' }, { status: 500 })
  }
}

// POST — iscrizione pubblica alla serata di presentazione.
// Scrive con service role: la tabella ha RLS senza policy, l'anon non vi accede.
export async function POST(request) {
  // Chiusura di sicurezza a data e ora della serata.
  if (!iscrizioniSerataAperte()) {
    return NextResponse.json({ error: 'Le iscrizioni alla serata sono chiuse.' }, { status: 410 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }

  // Campo trappola per i bot: invisibile alle persone, se compilato fingiamo successo.
  if (testo(body.sito_web)) return NextResponse.json({ ok: true })

  const riga = {
    evento: SERATA_AI.slug,
    nome: testo(body.nome, 80),
    cognome: testo(body.cognome, 80),
    email: testo(body.email, 160)?.toLowerCase() ?? null,
    telefono: testo(body.telefono, 40),
    azienda: testo(body.azienda, 160),
    ruolo: testo(body.ruolo, 120),
    messaggio: testo(body.messaggio, 1500),
    num_persone: Math.min(10, Math.max(1, parseInt(body.num_persone, 10) || 1)),
    interessi:
      (Array.isArray(body.interessi) ? body.interessi : [])
        .filter((k) => CHIAVI_INTERESSI.has(k))
        .join(',') || null,
    consenso_privacy: body.consenso_privacy === true,
    consenso_marketing: body.consenso_marketing === true,
  }

  if (!riga.nome || !riga.cognome || !riga.email || !EMAIL_REGEX.test(riga.email)) {
    return NextResponse.json({ error: 'Nome, cognome ed email valida sono obbligatori.' }, { status: 400 })
  }
  if (!riga.consenso_privacy) {
    return NextResponse.json({ error: 'Il consenso al trattamento dei dati è obbligatorio.' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  try {
    // Chi è già iscritto riceve "già iscritto", anche a posti esauriti.
    const { data: esistente, error: erroreEsistente } = await supabase
      .from('serata_iscrizioni')
      .select('id')
      .eq('evento', SERATA_AI.slug)
      .eq('email', riga.email)
      .limit(1)
    if (erroreEsistente) throw erroreEsistente
    if (esistente.length > 0) return NextResponse.json({ ok: true, giaIscritto: true })

    // Controllo capienza prima dell'insert.
    const residui = await postiResidui(supabase)
    if (residui === 0) {
      return NextResponse.json(
        { error: 'Posti esauriti.', postiEsauriti: true, postiResidui: 0 },
        { status: 409 }
      )
    }
    if (residui < riga.num_persone) {
      return NextResponse.json(
        { error: messaggioPostiResidui(residui), postiResidui: residui },
        { status: 409 }
      )
    }
  } catch (error) {
    console.error('serata-ai POST controlli', error)
    return NextResponse.json({ error: 'Errore nel salvataggio. Riprova o chiamaci.' }, { status: 500 })
  }

  const { error } = await supabase.from('serata_iscrizioni').insert(riga)

  if (error) {
    // Violazione dell'indice unico (evento, email): già iscritto.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, giaIscritto: true })
    }
    console.error('serata-ai POST', error)
    return NextResponse.json({ error: 'Errore nel salvataggio. Riprova o chiamaci.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
