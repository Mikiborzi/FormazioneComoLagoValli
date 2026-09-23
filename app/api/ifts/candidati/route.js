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
  const { nome, cognome, email, telefono, data_nascita, titolo_studio, anno_titolo, indirizzo_interesse, ha_azienda, nome_azienda, note, consenso_gdpr, newsletter } = body

  if (!nome || !cognome || !email) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }
  if (!consenso_gdpr) {
    return NextResponse.json({ error: 'Il consenso al trattamento dei dati è obbligatorio' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('ifts_candidati').insert([{
    nome, cognome, email, telefono, data_nascita: data_nascita || null,
    titolo_studio, anno_titolo: anno_titolo ? parseInt(anno_titolo) : null,
    indirizzo_interesse, ha_azienda: !!ha_azienda,
    nome_azienda: ha_azienda ? nome_azienda : null, note
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (newsletter) {
    await supabase.from('newsletter').upsert({ email, nome: `${nome} ${cognome}`, attivo: true }, { onConflict: 'email' })
  }

  // Fa confluire il contatto nel CRM unificato (tab "CRM Contatti" in admin).
  // Non deve mai far fallire la candidatura già salvata sopra.
  try {
    const { data: contatto } = await supabase
      .from('contatti')
      .upsert({ email, nome, cognome, telefono }, { onConflict: 'email', ignoreDuplicates: false })
      .select('id')
      .maybeSingle()
    if (contatto?.id) {
      await supabase.from('interazioni').insert({
        contatto_id: contatto.id,
        canale: 'ifts_candidato',
        tipo: 'interesse',
        oggetto: indirizzo_interesse || null,
        dati: { titolo_studio, ha_azienda: !!ha_azienda },
      })
    }
  } catch (err) {
    console.error('Log CRM ifts/candidati:', err)
  }

  return NextResponse.json({ ok: true })
}
