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

// La P.IVA/CF identifica la pratica ed è metà delle credenziali di ripresa:
// va confrontata sempre nella stessa forma canonica (niente spazi, maiuscolo,
// altrimenti un CF scritto in minuscolo non ritrova la propria pratica).
export function normalizzaPiva(value) {
  return String(value ?? '').replace(/\s/g, '').toUpperCase()
}

// Autorizza una mutazione su una pratica: serve il token emesso alla creazione
// o alla ripresa, non il solo id (che di per sé non prova nulla).
// Restituisce la riga azienda, oppure null se token assente o non corrispondente.
export async function verificaAccessoPratica(supabase, aziendaId, token) {
  const id = String(aziendaId || '').trim()
  const tok = String(token || '').trim()
  if (!id || !tok) return null

  const { data, error } = await supabase
    .from('voucher_aziende')
    .select('*')
    .eq('id', id)
    .eq('token_accesso', tok)
    .maybeSingle()

  if (error) {
    console.error('verificaAccessoPratica', error)
    return null
  }
  return data
}

export const CAMPI_AZIENDA = [
  'ragione_sociale', 'piva_cf', 'codice_ateco', 'sede_operativa', 'numero_addetti',
  'referente_nome', 'referente_cognome', 'referente_email', 'referente_telefono',
  'legale_rappresentante_nome', 'legale_rappresentante_cognome', 'legale_rappresentante_cf',
]

// In modifica la P.IVA/CF non è toccabile: è l'identità della pratica e la
// chiave di ripresa. Cambiarla permetterebbe di aggirare il vincolo di unicità
// e di far collidere due pratiche.
export const CAMPI_AZIENDA_MODIFICABILI = CAMPI_AZIENDA.filter((c) => c !== 'piva_cf')

export const CAMPI_PARTECIPANTE = [
  'nome', 'cognome', 'codice_fiscale', 'data_nascita', 'luogo_nascita', 'sesso',
  'cittadinanza', 'titolo_studio', 'condizione_occupazionale', 'condizione_vulnerabilita',
  'indirizzo', 'comune', 'provincia', 'cap', 'tipologia_rapporto', 'numero_cob',
  'data_assunzione', 'orario_lavoro', 'partita_iva', 'email', 'telefono', 'privacy_firmata',
]
