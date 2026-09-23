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
    tipo_interesse, n_giovani_previsti, indirizzi_interesse, note, consenso_gdpr, newsletter
  } = body

  if (!ragione_sociale || !referente_nome || !referente_cognome || !referente_email) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }
  if (!consenso_gdpr) {
    return NextResponse.json({ error: 'Il consenso al trattamento dei dati è obbligatorio' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('ifts_aziende').insert([{
    ragione_sociale, piva, settore,
    referente_nome, referente_cognome, referente_email, referente_telefono, referente_ruolo,
    tipo_interesse, n_giovani_previsti: n_giovani_previsti ? parseInt(n_giovani_previsti) : null,
    indirizzi_interesse: indirizzi_interesse || [], note
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (newsletter) {
    await supabase.from('newsletter').upsert(
      { email: referente_email, nome: `${referente_nome} ${referente_cognome}`, attivo: true },
      { onConflict: 'email' }
    )
  }

  // Fa confluire il contatto nel CRM unificato (tab "CRM Contatti" in admin).
  // Non deve mai far fallire la richiesta già salvata sopra.
  try {
    const { data: contatto } = await supabase
      .from('contatti')
      .upsert(
        { email: referente_email, nome: referente_nome, cognome: referente_cognome, telefono: referente_telefono, azienda: ragione_sociale, partita_iva: piva || null },
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select('id')
      .maybeSingle()
    if (contatto?.id) {
      await supabase.from('interazioni').insert({
        contatto_id: contatto.id,
        canale: 'ifts_azienda',
        tipo: 'interesse',
        oggetto: ragione_sociale,
        dati: { tipo_interesse, n_giovani_previsti, settore },
      })
    }
  } catch (err) {
    console.error('Log CRM ifts/aziende:', err)
  }

  return NextResponse.json({ ok: true })
}
