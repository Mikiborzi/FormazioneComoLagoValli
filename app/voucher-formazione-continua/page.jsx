'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TIPOLOGIE_RAPPORTO = [
  'Dipendente tempo indeterminato',
  'Dipendente tempo determinato',
  'Dipendente part-time',
  'Socio-lavoratore cooperativa',
  'Titolare/socio di impresa',
  'Libero professionista / lavoratore autonomo',
  'Ditta individuale',
]

const TITOLI_STUDIO = [
  'Nessun titolo',
  'Licenza media',
  'Diploma',
  'Laurea',
  'Post-laurea',
]

const FASCE_ADDETTI = [
  '≤9 addetti',
  '10-50 addetti',
  '≥51 addetti',
]

export default function VoucherFormazioneContinua() {
  const [step, setStep] = useState(1) // 1=azienda, 2=partecipante, 3=successo
  const [aziendaId, setAziendaId] = useState(null)
  const [ragioneSociale, setRagioneSociale] = useState('')
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState(null)

  const [azienda, setAzienda] = useState({
    ragione_sociale: '',
    piva_cf: '',
    codice_ateco: '',
    sede_operativa: '',
    numero_addetti: '',
    referente_nome: '',
    referente_cognome: '',
    referente_email: '',
    referente_telefono: '',
    legale_rappresentante_nome: '',
    legale_rappresentante_cognome: '',
    legale_rappresentante_cf: '',
  })

  const [partecipante, setPartecipante] = useState({
    nome: '',
    cognome: '',
    codice_fiscale: '',
    data_nascita: '',
    luogo_nascita: '',
    sesso: '',
    cittadinanza: '',
    titolo_studio: '',
    condizione_occupazionale: 'occupato',
    condizione_vulnerabilita: '',
    indirizzo: '',
    comune: '',
    provincia: '',
    cap: '',
    tipologia_rapporto: '',
    numero_cob: '',
    data_assunzione: '',
    orario_lavoro: '',
    partita_iva: '',
    email: '',
    telefono: '',
    privacy_firmata: false,
  })

  const handleAzienda = (e) => {
    setAzienda({ ...azienda, [e.target.name]: e.target.value })
  }

  const handlePartecipante = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setPartecipante({ ...partecipante, [e.target.name]: val })
  }

  const submitAzienda = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrore(null)
    const { data, error } = await supabase
      .from('voucher_aziende')
      .insert([azienda])
      .select()
    if (error) {
      console.error(error)
      setErrore('Errore nel salvataggio dati azienda. Riprova.')
      setLoading(false)
      return
    }
    setAziendaId(data[0].id)
    setRagioneSociale(azienda.ragione_sociale)
    setStep(2)
    setLoading(false)
  }

  const submitPartecipante = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrore(null)
    const { error } = await supabase
      .from('voucher_partecipanti')
      .insert([{ ...partecipante, azienda_id: aziendaId }])
    if (error) {
      console.error(error)
      setErrore('Errore nel salvataggio dati partecipante. Riprova.')
      setLoading(false)
      return
    }
    setStep(3)
    setLoading(false)
  }

  const aggiungiAltro = () => {
    setPartecipante({
      nome: '', cognome: '', codice_fiscale: '', data_nascita: '',
      luogo_nascita: '', sesso: '', cittadinanza: '', titolo_studio: '',
      condizione_occupazionale: 'occupato', condizione_vulnerabilita: '',
      indirizzo: '', comune: '', provincia: '', cap: '',
      tipologia_rapporto: '', numero_cob: '', data_assunzione: '',
      orario_lavoro: '', partita_iva: '', email: '', telefono: '',
      privacy_firmata: false,
    })
    setStep(2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-wide mb-2">
            Regione Lombardia · PR FSE+ 2021-2027
          </p>
          <h1 className="text-3xl font-bold mb-2">
            Voucher Formazione Continua
          </h1>
          <p className="text-blue-200 text-lg">
            Preregistrazione aziende e partecipanti · AI Academy
          </p>
        </div>
      </div>

      {/* Avviso esclusioni */}
      <div className="max-w-3xl mx-auto mt-6 px-4">
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900">
          <strong>⚠️ Attenzione — destinatari esclusi dalla misura:</strong> contratti intermittenti o di somministrazione, tirocinanti, apprendisti con periodo formativo in corso, titolari di sole cariche societarie (es. AD non soci/dipendenti), collaboratori di imprese familiari, chi ha già in corso altre politiche attive (es. Dote Unica Lavoro V Fase). Verificare prima di procedere.
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Step 1 — Dati Azienda */}
        {step === 1 && (
          <form onSubmit={submitAzienda} className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Sezione 1 · Dati azienda</h2>
              <p className="text-sm text-gray-500 mb-6">Compilare una sola volta per tutte le iscrizioni</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ragione sociale *</label>
                  <input name="ragione_sociale" value={azienda.ragione_sociale} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">P.IVA / Codice Fiscale *</label>
                    <input name="piva_cf" value={azienda.piva_cf} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codice ATECO</label>
                    <input name="codice_ateco" value={azienda.codice_ateco} onChange={handleAzienda} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sede operativa in Lombardia *</label>
                  <input name="sede_operativa" value={azienda.sede_operativa} onChange={handleAzienda} required placeholder="Indirizzo completo sede dove presta servizio il destinatario" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numero addetti *</label>
                  <select name="numero_addetti" value={azienda.numero_addetti} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleziona fascia</option>
                    {FASCE_ADDETTI.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Determina la fascia di cofinanziamento — verificato da Regione su visura camerale</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Referente aziendale</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input name="referente_nome" value={azienda.referente_nome} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                    <input name="referente_cognome" value={azienda.referente_cognome} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input name="referente_email" type="email" value={azienda.referente_email} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                    <input name="referente_telefono" value={azienda.referente_telefono} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Legale rappresentante</h3>
              <p className="text-sm text-gray-500 mb-4">Necessario per firma digitale domanda voucher</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input name="legale_rappresentante_nome" value={azienda.legale_rappresentante_nome} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                    <input name="legale_rappresentante_cognome" value={azienda.legale_rappresentante_cognome} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
                  <input name="legale_rappresentante_cf" value={azienda.legale_rappresentante_cf} onChange={handleAzienda} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {errore && <p className="text-red-600 text-sm">{errore}</p>}

            <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50">
              {loading ? 'Salvataggio...' : 'Continua → Aggiungi partecipanti'}
            </button>
          </form>
        )}

        {/* Step 2 — Dati Partecipante */}
        {step === 2 && (
          <form onSubmit={submitPartecipante} className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <strong>Azienda:</strong> {ragioneSociale} — Aggiungi i dati del partecipante
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sezione 2 · Dati anagrafici partecipante</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input name="nome" value={partecipante.nome} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognome *</label>
                    <input name="cognome" value={partecipante.cognome} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale *</label>
                  <input name="codice_fiscale" value={partecipante.codice_fiscale} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data di nascita *</label>
                    <input name="data_nascita" type="date" value={partecipante.data_nascita} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luogo di nascita *</label>
                    <input name="luogo_nascita" value={partecipante.luogo_nascita} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sesso *</label>
                    <select name="sesso" value={partecipante.sesso} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleziona</option>
                      <option value="M">Maschio</option>
                      <option value="F">Femmina</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cittadinanza *</label>
                    <input name="cittadinanza" value={partecipante.cittadinanza} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titolo di studio *</label>
                  <select name="titolo_studio" value={partecipante.titolo_studio} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleziona</option>
                    {TITOLI_STUDIO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condizione di vulnerabilità</label>
                  <input name="condizione_vulnerabilita" value={partecipante.condizione_vulnerabilita} onChange={handlePartecipante} placeholder="Facoltativo — su base volontaria" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo di residenza/domicilio *</label>
                  <input name="indirizzo" value={partecipante.indirizzo} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comune *</label>
                    <input name="comune" value={partecipante.comune} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                    <input name="provincia" value={partecipante.provincia} onChange={handlePartecipante} required maxLength={2} placeholder="CO" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                    <input name="cap" value={partecipante.cap} onChange={handlePartecipante} required maxLength={5} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sezione 3 · Rapporto di lavoro</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipologia rapporto *</label>
                  <select name="tipologia_rapporto" value={partecipante.tipologia_rapporto} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleziona</option>
                    {TIPOLOGIE_RAPPORTO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numero COB</label>
                  <input name="numero_cob" value={partecipante.numero_cob} onChange={handlePartecipante} placeholder="Obbligatorio per dipendenti e soci-lavoratori" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400 mt-1">Se contratto ante 01/03/2008: allegare contratto + ultimo cedolino</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data assunzione / decorrenza incarico</label>
                  <input name="data_assunzione" type="date" value={partecipante.data_assunzione} onChange={handlePartecipante} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orario abituale di lavoro / turno *</label>
                  <input name="orario_lavoro" value={partecipante.orario_lavoro} onChange={handlePartecipante} required placeholder="es. Lun-Ven 9:00-18:00" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-xs text-gray-400 mt-1">Il corso va fruito solo in orario di servizio — vincolo del bando</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA</label>
                  <input name="partita_iva" value={partecipante.partita_iva} onChange={handlePartecipante} placeholder="Solo per libero professionista / lavoratore autonomo" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sezione 4 · Contatti e consenso</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email personale *</label>
                    <input name="email" type="email" value={partecipante.email} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefono cellulare *</label>
                    <input name="telefono" value={partecipante.telefono} onChange={handlePartecipante} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input name="privacy_firmata" type="checkbox" checked={partecipante.privacy_firmata} onChange={handlePartecipante} required className="mt-1" />
                  <label className="text-sm text-gray-700">
                    Confermo che l'informativa privacy (All. A.5) è stata consegnata e firmata dal partecipante prima dell'iscrizione. *
                  </label>
                </div>
              </div>
            </div>

            {errore && <p className="text-red-600 text-sm">{errore}</p>}

            <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50">
              {loading ? 'Salvataggio...' : 'Registra partecipante'}
            </button>
          </form>
        )}

        {/* Step 3 — Successo */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Partecipante registrato</h2>
            <p className="text-gray-600 mb-6">I dati sono stati salvati correttamente. Starting Work vi contatterà per confermare l'iscrizione.</p>
            <button onClick={aggiungiAltro} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition mr-4">
              Aggiungi altro partecipante
            </button>
            <a href="/" className="text-blue-700 underline text-sm">Torna alla home</a>
          </div>
        )}

      </div>

      {/* Footer istituzionale */}
      <div className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-500">
          Starting Work Srl Impresa Sociale · Programma PR Lombardia FSE+ 2021-2027 · Voucher Aziendali a Catalogo — Quarta Edizione
        </div>
      </div>
    </div>
  )
}
