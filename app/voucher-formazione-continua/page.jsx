'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buildRiepilogoDocumento } from '@/app/lib/voucherRiepilogo'

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

const FASCE_ADDETTI = ['≤9 addetti', '10-50 addetti', '≥51 addetti']

const AZIENDA_VUOTA = {
  ragione_sociale: '', piva_cf: '', codice_ateco: '', sede_operativa: '', numero_addetti: '',
  referente_nome: '', referente_cognome: '', referente_email: '', referente_telefono: '',
  legale_rappresentante_nome: '', legale_rappresentante_cognome: '', legale_rappresentante_cf: '',
}

const PARTECIPANTE_VUOTO = {
  nome: '', cognome: '', codice_fiscale: '', data_nascita: '', luogo_nascita: '', sesso: '',
  cittadinanza: '', titolo_studio: '', condizione_occupazionale: 'occupato', condizione_vulnerabilita: '',
  indirizzo: '', comune: '', provincia: '', cap: '', tipologia_rapporto: '', numero_cob: '',
  data_assunzione: '', orario_lavoro: '', partita_iva: '', email: '', telefono: '', privacy_firmata: false,
}

const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelCls = 'block text-sm font-medium text-gray-700 mb-1'
const card = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6'
const btnPrimary = 'bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50'

export default function VoucherFormazioneContinua() {
  const [view, setView] = useState('landing') // landing | nuova | ripresa | gestione | fine
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState(null)

  const [azienda, setAzienda] = useState(AZIENDA_VUOTA)
  const [partecipanti, setPartecipanti] = useState([])

  const [editAzienda, setEditAzienda] = useState(false)
  const [aziendaBackup, setAziendaBackup] = useState(null)

  const [ripresa, setRipresa] = useState({ piva_cf: '', referente_email: '' })

  // partModal: null | { mode: 'new'|'edit', data }
  const [partModal, setPartModal] = useState(null)

  const handleAzienda = (e) => setAzienda({ ...azienda, [e.target.name]: e.target.value })
  const handlePart = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setPartModal((m) => ({ ...m, data: { ...m.data, [e.target.name]: val } }))
  }

  async function postJSON(url, body, method = 'POST') {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, json }
  }

  // ── Nuova pratica: crea azienda ────────────────────────────────────────────
  const creaAzienda = async (e) => {
    e.preventDefault()
    setLoading(true); setErrore(null)
    const { ok, status, json } = await postJSON('/api/voucher/azienda', azienda)
    setLoading(false)
    if (!ok) {
      if (status === 409) {
        setErrore('Esiste già una pratica per questa P.IVA. Passa a «Riprendi pratica» per aggiungere partecipanti.')
        setRipresa({ piva_cf: azienda.piva_cf, referente_email: azienda.referente_email })
      } else {
        setErrore(json.error || 'Errore nel salvataggio dei dati azienda.')
      }
      return
    }
    setAzienda(json.azienda)
    setPartecipanti([])
    setView('gestione')
  }

  // ── Riprendi pratica ───────────────────────────────────────────────────────
  const riprendiPratica = async (e) => {
    e.preventDefault()
    setLoading(true); setErrore(null)
    const { ok, status, json } = await postJSON('/api/voucher/riprendi', ripresa)
    setLoading(false)
    if (!ok) {
      setErrore(status === 404
        ? 'Nessuna pratica trovata con questa P.IVA ed email referente. Verifica i dati o avvia una nuova pratica.'
        : (json.error || 'Errore nel recupero della pratica.'))
      return
    }
    setAzienda(json.azienda)
    setPartecipanti(json.partecipanti || [])
    setView('gestione')
  }

  // ── Modifica dati azienda ──────────────────────────────────────────────────
  const iniziaModificaAzienda = () => { setAziendaBackup(azienda); setEditAzienda(true) }
  const annullaModificaAzienda = () => { setAzienda(aziendaBackup); setEditAzienda(false) }
  const salvaAzienda = async () => {
    setLoading(true); setErrore(null)
    const { ok, json } = await postJSON(
      '/api/voucher/azienda',
      { ...azienda, id: azienda.id, token: azienda.token_accesso },
      'PATCH'
    )
    setLoading(false)
    if (!ok) { setErrore(json.error || 'Errore nell\'aggiornamento.'); return }
    setAzienda(json.azienda)
    setEditAzienda(false)
  }

  // ── Partecipanti ───────────────────────────────────────────────────────────
  const apriNuovoPart = () => { setErrore(null); setPartModal({ mode: 'new', data: { ...PARTECIPANTE_VUOTO } }) }
  const apriModificaPart = (p) => { setErrore(null); setPartModal({ mode: 'edit', data: { ...p } }) }
  const chiudiPart = () => setPartModal(null)

  const salvaPart = async (e) => {
    e.preventDefault()
    setLoading(true); setErrore(null)
    if (partModal.mode === 'new') {
      const { ok, json } = await postJSON('/api/voucher/partecipante', {
        ...partModal.data, azienda_id: azienda.id, token: azienda.token_accesso,
      })
      setLoading(false)
      if (!ok) { setErrore(json.error || 'Errore nel salvataggio del partecipante.'); return }
      setPartecipanti((arr) => [...arr, json.partecipante])
    } else {
      const { ok, json } = await postJSON(
        '/api/voucher/partecipante',
        { ...partModal.data, token: azienda.token_accesso },
        'PATCH'
      )
      setLoading(false)
      if (!ok) { setErrore(json.error || 'Errore nell\'aggiornamento del partecipante.'); return }
      setPartecipanti((arr) => arr.map((p) => (p.id === json.partecipante.id ? json.partecipante : p)))
    }
    setPartModal(null)
  }

  const eliminaPart = async (p) => {
    if (!confirm(`Rimuovere ${p.nome} ${p.cognome} dalla pratica?`)) return
    setLoading(true); setErrore(null)
    const qs = new URLSearchParams({ id: p.id, token: azienda.token_accesso || '' })
    const res = await fetch(`/api/voucher/partecipante?${qs}`, { method: 'DELETE' })
    setLoading(false)
    if (!res.ok) { setErrore('Errore nella rimozione del partecipante.'); return }
    setPartecipanti((arr) => arr.filter((x) => x.id !== p.id))
  }

  // ── Conclusione ────────────────────────────────────────────────────────────
  // I dati sono già salvati a ogni passaggio; qui si marca la pratica come
  // conclusa, così in admin una bozza abbandonata non sembra completata.
  // La pratica resta comunque riapribile e modificabile.
  const concludi = async () => {
    setLoading(true); setErrore(null)
    const { ok, json } = await postJSON(
      '/api/voucher/azienda',
      { id: azienda.id, token: azienda.token_accesso, concludi: true },
      'PATCH'
    )
    setLoading(false)
    if (!ok) { setErrore(json.error || 'Errore nella conclusione della pratica.'); return }
    setAzienda(json.azienda)
    setView('fine')
  }

  // ── Stampa / salva PDF ─────────────────────────────────────────────────────
  const stampaPratica = () => {
    const html = buildRiepilogoDocumento({ azienda, partecipanti })
    const w = window.open('', '_blank')
    if (!w) { setErrore('Abilita i popup per stampare il riepilogo.'); return }
    w.document.write(html)
    w.document.close()
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-medium uppercase tracking-wide mb-2">
            Regione Lombardia · PR FSE+ 2021-2027
          </p>
          <h1 className="text-3xl font-bold mb-2">Voucher Formazione Continua</h1>
          <p className="text-blue-200 text-lg">Preregistrazione aziende e partecipanti · AI Academy</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 px-4">
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900">
          <strong>⚠️ Attenzione — destinatari esclusi dalla misura:</strong> contratti intermittenti o di somministrazione, tirocinanti, apprendisti con periodo formativo in corso, titolari di sole cariche societarie (es. AD non soci/dipendenti), collaboratori di imprese familiari, chi ha già in corso altre politiche attive (es. Dote Unica Lavoro V Fase). Verificare prima di procedere.
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {errore && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">{errore}</p>}

        {/* LANDING */}
        {view === 'landing' && (
          <div className="grid sm:grid-cols-2 gap-4">
            <button onClick={() => { setErrore(null); setAzienda(AZIENDA_VUOTA); setView('nuova') }}
              className={`${card} text-left hover:border-blue-400 transition`}>
              <div className="text-3xl mb-2">🆕</div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Nuova pratica</h2>
              <p className="text-sm text-gray-500">Registra la tua azienda e i primi partecipanti.</p>
            </button>
            <button onClick={() => { setErrore(null); setView('ripresa') }}
              className={`${card} text-left hover:border-blue-400 transition`}>
              <div className="text-3xl mb-2">📂</div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Riprendi pratica</h2>
              <p className="text-sm text-gray-500">Hai già registrato l&apos;azienda? Aggiungi o modifica i partecipanti.</p>
            </button>
          </div>
        )}

        {/* RIPRESA */}
        {view === 'ripresa' && (
          <form onSubmit={riprendiPratica} className="space-y-6">
            <div className={card}>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Riprendi la tua pratica</h2>
              <p className="text-sm text-gray-500 mb-6">Inserisci P.IVA/C.F. e l&apos;email del referente usati in fase di registrazione.</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>P.IVA / Codice Fiscale *</label>
                  <input value={ripresa.piva_cf} onChange={(e) => setRipresa({ ...ripresa, piva_cf: e.target.value })} required className={field} />
                </div>
                <div>
                  <label className={labelCls}>Email referente *</label>
                  <input type="email" value={ripresa.referente_email} onChange={(e) => setRipresa({ ...ripresa, referente_email: e.target.value })} required className={field} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setErrore(null); setView('landing') }} className="text-blue-700 underline text-sm">← Indietro</button>
              <button type="submit" disabled={loading} className={`${btnPrimary} ml-auto`}>
                {loading ? 'Ricerca…' : 'Apri pratica →'}
              </button>
            </div>
          </form>
        )}

        {/* NUOVA — dati azienda */}
        {view === 'nuova' && (
          <form onSubmit={creaAzienda} className="space-y-8">
            <AziendaFields azienda={azienda} onChange={handleAzienda} />
            <div className="flex gap-3 items-center">
              <button type="button" onClick={() => { setErrore(null); setView('landing') }} className="text-blue-700 underline text-sm">← Indietro</button>
              <button type="submit" disabled={loading} className={`${btnPrimary} ml-auto`}>
                {loading ? 'Salvataggio…' : 'Continua → Aggiungi partecipanti'}
              </button>
            </div>
          </form>
        )}

        {/* GESTIONE pratica */}
        {view === 'gestione' && (
          <div className="space-y-8">
            {/* Riepilogo / modifica azienda */}
            <div className={card}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{azienda.ragione_sociale}</h2>
                  <p className="text-sm text-gray-500">P.IVA/C.F. {azienda.piva_cf} · {azienda.numero_addetti}</p>
                </div>
                {!editAzienda && (
                  <button onClick={iniziaModificaAzienda} className="text-blue-700 underline text-sm shrink-0">Modifica dati azienda</button>
                )}
              </div>

              {editAzienda ? (
                <div className="space-y-6">
                  <AziendaFields azienda={azienda} onChange={handleAzienda} bare pivaBloccata />
                  <div className="flex gap-3">
                    <button onClick={annullaModificaAzienda} className="text-gray-500 underline text-sm">Annulla</button>
                    <button onClick={salvaAzienda} disabled={loading} className={`${btnPrimary} ml-auto py-2 px-4`}>
                      {loading ? 'Salvataggio…' : 'Salva modifiche'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 grid sm:grid-cols-2 gap-x-6 gap-y-1">
                  <span><strong>Referente:</strong> {azienda.referente_nome} {azienda.referente_cognome}</span>
                  <span><strong>Email:</strong> {azienda.referente_email}</span>
                  <span><strong>Telefono:</strong> {azienda.referente_telefono}</span>
                  <span><strong>Sede:</strong> {azienda.sede_operativa}</span>
                </div>
              )}
            </div>

            {/* Lista partecipanti */}
            <div className={card}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Partecipanti ({partecipanti.length})</h3>
                <button onClick={apriNuovoPart} className={`${btnPrimary} py-2 px-4 text-sm`}>+ Aggiungi partecipante</button>
              </div>
              {partecipanti.length === 0 ? (
                <p className="text-sm text-gray-500">Nessun partecipante ancora registrato. Aggiungi il primo dipendente.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {partecipanti.map((p) => (
                    <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{p.nome} {p.cognome}</p>
                        <p className="text-xs text-gray-500">{p.codice_fiscale} · {p.tipologia_rapporto}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button onClick={() => apriModificaPart(p)} className="text-blue-700 underline text-sm">Modifica</button>
                        <button onClick={() => eliminaPart(p)} className="text-red-600 underline text-sm">Elimina</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link href="/" className="text-gray-500 underline text-sm">Salva ed esci</Link>
              <button onClick={stampaPratica} disabled={partecipanti.length === 0}
                className="border border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition disabled:opacity-40 sm:ml-auto w-full sm:w-auto">
                🖨️ Stampa / Salva PDF
              </button>
              <button onClick={concludi} disabled={partecipanti.length === 0}
                className={`${btnPrimary} w-full sm:w-auto`}>
                Concludi e visualizza riepilogo
              </button>
            </div>
            {partecipanti.length === 0 && (
              <p className="text-xs text-gray-400 text-right">Aggiungi almeno un partecipante per concludere.</p>
            )}
          </div>
        )}

        {/* FINE */}
        {view === 'fine' && (
          <div className="space-y-6">
            <div className={`${card} text-center p-8`}>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pratica registrata</h2>
              <p className="text-gray-600">
                {partecipanti.length} partecipant{partecipanti.length === 1 ? 'e registrato' : 'i registrati'} per <strong>{azienda.ragione_sociale}</strong>.
                I dati sono salvati. Starting Work verificherà la pratica e contatterà il referente.
              </p>
            </div>

            {/* Box istruzioni riaccesso */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">📂 Come riaccedere alla pratica</h3>
              <p className="text-sm text-blue-900 mb-3">
                Puoi rientrare <strong>quando vuoi</strong> per <strong>visualizzare, modificare o aggiungere</strong> partecipanti,
                senza rifare la registrazione. Ti bastano due dati:
              </p>
              <ul className="text-sm text-blue-900 space-y-1 mb-3">
                <li>• <strong>P.IVA / Codice Fiscale:</strong> <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">{azienda.piva_cf}</span></li>
                <li>• <strong>Email del referente:</strong> <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">{azienda.referente_email}</span></li>
              </ul>
              <p className="text-sm text-blue-900">
                Torna su questa pagina e scegli <strong>«Riprendi pratica»</strong>. Nessuna password richiesta —
                conserva questi due dati e, se vuoi, <strong>stampa il riepilogo</strong> qui sotto.
              </p>
            </div>

            <div className={`${card} flex flex-col sm:flex-row gap-3 items-center`}>
              <button onClick={stampaPratica} className={`${btnPrimary} w-full sm:w-auto`}>🖨️ Stampa / Salva PDF</button>
              <button onClick={() => setView('gestione')} className="border border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition w-full sm:w-auto">
                Torna alla pratica
              </button>
              <Link href="/" className="text-blue-700 underline text-sm sm:ml-auto self-center">Torna alla home</Link>
            </div>
          </div>
        )}
      </div>

      {/* MODALE PARTECIPANTE */}
      {partModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <form onSubmit={salvaPart} className="bg-gray-50 rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="sticky top-0 bg-blue-900 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{partModal.mode === 'new' ? 'Nuovo partecipante' : 'Modifica partecipante'}</h2>
              <button type="button" onClick={chiudiPart} className="text-blue-200 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-8">
              <PartecipanteFields data={partModal.data} onChange={handlePart} />
              {errore && <p className="text-red-600 text-sm">{errore}</p>}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl px-6 py-4 flex gap-3">
              <button type="button" onClick={chiudiPart} className="text-gray-500 underline text-sm">Annulla</button>
              <button type="submit" disabled={loading} className={`${btnPrimary} ml-auto py-2 px-6`}>
                {loading ? 'Salvataggio…' : (partModal.mode === 'new' ? 'Aggiungi partecipante' : 'Salva modifiche')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-100 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-xs text-gray-500">
          Starting Work Srl Impresa Sociale · Programma PR Lombardia FSE+ 2021-2027 · Voucher Aziendali a Catalogo — Quarta Edizione
        </div>
      </div>
    </div>
  )
}

// ── Campi Azienda (riusati per creazione e modifica) ──────────────────────────
function AziendaFields({ azienda, onChange, bare = false, pivaBloccata = false }) {
  return (
    <div className="space-y-8">
      <div className={bare ? '' : card}>
        {!bare && <>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sezione 1 · Dati azienda</h2>
          <p className="text-sm text-gray-500 mb-6">Compilare una sola volta per tutte le iscrizioni</p>
        </>}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Ragione sociale *</label>
            <input name="ragione_sociale" value={azienda.ragione_sociale} onChange={onChange} required className={field} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>P.IVA / Codice Fiscale *</label>
              <input name="piva_cf" value={azienda.piva_cf} onChange={onChange} required
                readOnly={pivaBloccata} disabled={pivaBloccata}
                className={pivaBloccata ? `${field} bg-gray-100 text-gray-500 cursor-not-allowed` : field} />
              {pivaBloccata && (
                <p className="text-xs text-gray-400 mt-1">
                  Identifica la pratica e serve per riaprirla: non è modificabile.
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Codice ATECO</label>
              <input name="codice_ateco" value={azienda.codice_ateco} onChange={onChange} className={field} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Sede operativa in Lombardia *</label>
            <input name="sede_operativa" value={azienda.sede_operativa} onChange={onChange} required placeholder="Indirizzo completo sede dove presta servizio il destinatario" className={field} />
          </div>
          <div>
            <label className={labelCls}>Numero addetti *</label>
            <select name="numero_addetti" value={azienda.numero_addetti} onChange={onChange} required className={field}>
              <option value="">Seleziona fascia</option>
              {FASCE_ADDETTI.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Determina la fascia di cofinanziamento — verificato da Regione su visura camerale</p>
          </div>
        </div>
      </div>

      <div className={bare ? '' : card}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Referente aziendale</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nome *</label>
              <input name="referente_nome" value={azienda.referente_nome} onChange={onChange} required className={field} />
            </div>
            <div>
              <label className={labelCls}>Cognome *</label>
              <input name="referente_cognome" value={azienda.referente_cognome} onChange={onChange} required className={field} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email *</label>
              <input name="referente_email" type="email" value={azienda.referente_email} onChange={onChange} required className={field} />
            </div>
            <div>
              <label className={labelCls}>Telefono *</label>
              <input name="referente_telefono" value={azienda.referente_telefono} onChange={onChange} required className={field} />
            </div>
          </div>
        </div>
      </div>

      <div className={bare ? '' : card}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Legale rappresentante</h3>
        <p className="text-sm text-gray-500 mb-4">Necessario per firma digitale domanda voucher</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nome *</label>
              <input name="legale_rappresentante_nome" value={azienda.legale_rappresentante_nome} onChange={onChange} required className={field} />
            </div>
            <div>
              <label className={labelCls}>Cognome *</label>
              <input name="legale_rappresentante_cognome" value={azienda.legale_rappresentante_cognome} onChange={onChange} required className={field} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Codice Fiscale *</label>
            <input name="legale_rappresentante_cf" value={azienda.legale_rappresentante_cf} onChange={onChange} required className={field} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Campi Partecipante ────────────────────────────────────────────────────────
function PartecipanteFields({ data, onChange }) {
  return (
    <>
      <div className={card}>
        <h2 className="text-lg font-bold text-gray-900 mb-6">Dati anagrafici partecipante</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Nome *</label><input name="nome" value={data.nome} onChange={onChange} required className={field} /></div>
            <div><label className={labelCls}>Cognome *</label><input name="cognome" value={data.cognome} onChange={onChange} required className={field} /></div>
          </div>
          <div><label className={labelCls}>Codice Fiscale *</label><input name="codice_fiscale" value={data.codice_fiscale} onChange={onChange} required className={field} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Data di nascita *</label><input name="data_nascita" type="date" value={data.data_nascita} onChange={onChange} required className={field} /></div>
            <div><label className={labelCls}>Luogo di nascita *</label><input name="luogo_nascita" value={data.luogo_nascita} onChange={onChange} required className={field} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Sesso *</label>
              <select name="sesso" value={data.sesso} onChange={onChange} required className={field}>
                <option value="">Seleziona</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
              </select>
            </div>
            <div><label className={labelCls}>Cittadinanza *</label><input name="cittadinanza" value={data.cittadinanza} onChange={onChange} required className={field} /></div>
          </div>
          <div>
            <label className={labelCls}>Titolo di studio *</label>
            <select name="titolo_studio" value={data.titolo_studio} onChange={onChange} required className={field}>
              <option value="">Seleziona</option>
              {TITOLI_STUDIO.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Condizione di vulnerabilità</label>
            <input name="condizione_vulnerabilita" value={data.condizione_vulnerabilita} onChange={onChange} placeholder="Facoltativo — su base volontaria" className={field} />
          </div>
          <div><label className={labelCls}>Indirizzo di residenza/domicilio *</label><input name="indirizzo" value={data.indirizzo} onChange={onChange} required className={field} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Comune *</label><input name="comune" value={data.comune} onChange={onChange} required className={field} /></div>
            <div><label className={labelCls}>Provincia *</label><input name="provincia" value={data.provincia} onChange={onChange} required maxLength={2} placeholder="CO" className={field} /></div>
            <div><label className={labelCls}>CAP *</label><input name="cap" value={data.cap} onChange={onChange} required maxLength={5} className={field} /></div>
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="text-lg font-bold text-gray-900 mb-6">Rapporto di lavoro</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Tipologia rapporto *</label>
            <select name="tipologia_rapporto" value={data.tipologia_rapporto} onChange={onChange} required className={field}>
              <option value="">Seleziona</option>
              {TIPOLOGIE_RAPPORTO.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Numero COB</label>
            <input name="numero_cob" value={data.numero_cob} onChange={onChange} placeholder="Obbligatorio per dipendenti e soci-lavoratori" className={field} />
            <p className="text-xs text-gray-400 mt-1">Se contratto ante 01/03/2008: allegare contratto + ultimo cedolino</p>
          </div>
          <div><label className={labelCls}>Data assunzione / decorrenza incarico</label><input name="data_assunzione" type="date" value={data.data_assunzione} onChange={onChange} className={field} /></div>
          <div>
            <label className={labelCls}>Orario abituale di lavoro / turno *</label>
            <input name="orario_lavoro" value={data.orario_lavoro} onChange={onChange} required placeholder="es. Lun-Ven 9:00-18:00" className={field} />
            <p className="text-xs text-gray-400 mt-1">Il corso va fruito solo in orario di servizio — vincolo del bando</p>
          </div>
          <div><label className={labelCls}>Partita IVA</label><input name="partita_iva" value={data.partita_iva} onChange={onChange} placeholder="Solo per libero professionista / lavoratore autonomo" className={field} /></div>
        </div>
      </div>

      <div className={card}>
        <h2 className="text-lg font-bold text-gray-900 mb-6">Contatti e consenso</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Email personale *</label><input name="email" type="email" value={data.email} onChange={onChange} required className={field} /></div>
            <div><label className={labelCls}>Telefono cellulare *</label><input name="telefono" value={data.telefono} onChange={onChange} required className={field} /></div>
          </div>
          <div className="flex items-start gap-3">
            <input name="privacy_firmata" type="checkbox" checked={data.privacy_firmata} onChange={onChange} required className="mt-1" />
            <label className="text-sm text-gray-700">
              Confermo che l&apos;informativa privacy (All. A.5) è stata consegnata e firmata dal partecipante prima dell&apos;iscrizione. *
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
