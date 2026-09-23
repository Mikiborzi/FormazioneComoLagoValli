// Backfill una tantum: porta nel CRM unificato (contatti + interazioni) tutto
// lo storico già presente nelle tabelle sorgente di ciascun canale. Idempotente:
// si può rilanciare, non crea interazioni duplicate (stesso contatto+canale+oggetto).
//
// Esecuzione: node backfill-crm.js (dalla root del progetto, con .env.local caricato)

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function upsertContatto(email, fields) {
  if (!email) return null
  const clean = {}
  for (const [k, v] of Object.entries(fields)) {
    if (v !== null && v !== undefined && String(v).trim() !== '') clean[k] = v
  }
  const { data, error } = await supabase
    .from('contatti')
    .upsert({ email: email.trim().toLowerCase(), ...clean }, { onConflict: 'email', ignoreDuplicates: false })
    .select('id')
    .maybeSingle()
  if (error) {
    console.error('upsertContatto', email, error.message)
    return null
  }
  return data?.id ?? null
}

async function logInterazioneSeAssente(contatto_id, canale, tipo, oggetto, dati, stato, created_at) {
  if (!contatto_id) return false
  const { data: esistente } = await supabase
    .from('interazioni')
    .select('id')
    .eq('contatto_id', contatto_id)
    .eq('canale', canale)
    .eq('oggetto', oggetto)
    .maybeSingle()
  if (esistente) return false
  const { error } = await supabase.from('interazioni').insert({
    contatto_id, canale, tipo, oggetto: oggetto || null, dati, stato: stato || 'nuovo', created_at,
  })
  if (error) console.error('logInterazione', canale, error.message)
  return !error
}

async function main() {
  const riepilogo = {}

  const { data: iscrizioni } = await supabase.from('iscrizioni').select('*')
  riepilogo.iscrizioni = { sorgente: iscrizioni?.length || 0, nuove: 0 }
  for (const i of iscrizioni || []) {
    const id = await upsertContatto(i.email, { nome: i.nome, cognome: i.cognome, telefono: i.telefono })
    const nuova = await logInterazioneSeAssente(
      id, i.tipo === 'servizi_lavoro' ? 'servizi_lavoro' : 'gol', 'iscrizione',
      (i.corsi_interesse || []).join(', ') || null,
      { corsi_interesse: i.corsi_interesse, idoneo_gol: i.idoneo_gol }, i.stato, i.created_at
    )
    if (nuova) riepilogo.iscrizioni.nuove++
  }

  const { data: iftsCand } = await supabase.from('ifts_candidati').select('*')
  riepilogo.ifts_candidati = { sorgente: iftsCand?.length || 0, nuove: 0 }
  for (const c of iftsCand || []) {
    const id = await upsertContatto(c.email, { nome: c.nome, cognome: c.cognome, telefono: c.telefono })
    const nuova = await logInterazioneSeAssente(
      id, 'ifts_candidato', 'interesse', c.indirizzo_interesse || null,
      { titolo_studio: c.titolo_studio, ha_azienda: c.ha_azienda }, c.stato, c.created_at
    )
    if (nuova) riepilogo.ifts_candidati.nuove++
  }

  const { data: iftsAz } = await supabase.from('ifts_aziende').select('*')
  riepilogo.ifts_aziende = { sorgente: iftsAz?.length || 0, nuove: 0 }
  for (const a of iftsAz || []) {
    const id = await upsertContatto(a.referente_email, {
      nome: a.referente_nome, cognome: a.referente_cognome, telefono: a.referente_telefono,
      azienda: a.ragione_sociale, partita_iva: a.piva,
    })
    const nuova = await logInterazioneSeAssente(
      id, 'ifts_azienda', 'interesse', a.ragione_sociale,
      { tipo_interesse: a.tipo_interesse, settore: a.settore }, a.stato, a.created_at
    )
    if (nuova) riepilogo.ifts_aziende.nuove++
  }

  const { data: voucherAz } = await supabase.from('voucher_aziende').select('*')
  riepilogo.voucher_aziende = { sorgente: voucherAz?.length || 0, nuove: 0 }
  for (const v of voucherAz || []) {
    const id = await upsertContatto(v.referente_email, {
      nome: v.referente_nome, cognome: v.referente_cognome, telefono: v.referente_telefono,
      azienda: v.ragione_sociale, partita_iva: v.piva_cf,
    })
    const nuova = await logInterazioneSeAssente(
      id, 'voucher_attesa', 'iscrizione', v.ragione_sociale,
      { piva_cf: v.piva_cf, numero_addetti: v.numero_addetti }, v.stato, v.created_at
    )
    if (nuova) riepilogo.voucher_aziende.nuove++
  }

  const { data: contImpresa } = await supabase.from('contatti_impresa').select('*')
  riepilogo.contatti_impresa = { sorgente: contImpresa?.length || 0, nuove: 0 }
  for (const c of contImpresa || []) {
    const id = await upsertContatto(c.email, { nome: c.nome, cognome: c.cognome, telefono: c.telefono, azienda: c.azienda })
    const nuova = await logInterazioneSeAssente(
      id, 'impresa_contatto', 'contatto', 'Formazione Impresa', { messaggio: c.messaggio }, c.stato, c.created_at
    )
    if (nuova) riepilogo.contatti_impresa.nuove++
  }

  console.log(JSON.stringify(riepilogo, null, 2))
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
