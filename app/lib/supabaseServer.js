import { createClient } from '@supabase/supabase-js'

// Client Supabase lato server con service role: bypassa RLS.
// Da usare SOLO nelle route handler (mai esposto al browser).
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Tiene solo le chiavi ammesse e normalizza le stringhe vuote a null
// (utile per le colonne DATE: '' non è una data valida).
export function pick(source, allowed) {
  const out = {}
  for (const key of allowed) {
    if (!(key in source)) continue
    let value = source[key]
    if (typeof value === 'string') {
      value = value.trim()
      if (value === '') value = null
    }
    out[key] = value
  }
  return out
}

export const CAMPI_AZIENDA = [
  'ragione_sociale', 'piva_cf', 'codice_ateco', 'sede_operativa', 'numero_addetti',
  'referente_nome', 'referente_cognome', 'referente_email', 'referente_telefono',
  'legale_rappresentante_nome', 'legale_rappresentante_cognome', 'legale_rappresentante_cf',
]

export const CAMPI_PARTECIPANTE = [
  'nome', 'cognome', 'codice_fiscale', 'data_nascita', 'luogo_nascita', 'sesso',
  'cittadinanza', 'titolo_studio', 'condizione_occupazionale', 'condizione_vulnerabilita',
  'indirizzo', 'comune', 'provincia', 'cap', 'tipologia_rapporto', 'numero_cob',
  'data_assunzione', 'orario_lavoro', 'partita_iva', 'email', 'telefono', 'privacy_firmata',
]
