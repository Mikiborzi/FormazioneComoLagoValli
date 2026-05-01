'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function IftsAziendePage() {
  const [form, setForm] = useState({
    ragione_sociale: '', piva: '', settore: '',
    referente_nome: '', referente_cognome: '', referente_email: '', referente_telefono: '', referente_ruolo: '',
    tipo_interesse: '', n_giovani_previsti: '',
    indirizzi_interesse: [], note: '',
  })
  const [stato, setStato] = useState('idle')
  const [errore, setErrore] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleIndirizzo(val) {
    setForm(f => ({
      ...f,
      indirizzi_interesse: f.indirizzi_interesse.includes(val)
        ? f.indirizzi_interesse.filter(v => v !== val)
        : [...f.indirizzi_interesse, val]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.ragione_sociale || !form.referente_nome || !form.referente_cognome || !form.referente_email) {
      setErrore('Compila tutti i campi obbligatori.')
      return
    }
    setStato('loading')
    setErrore('')
    try {
      const res = await fetch('/api/ifts/aziende', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStato('ok')
    } catch {
      setStato('error')
      setErrore('Qualcosa è andato storto. Riprova o scrivici direttamente.')
    }
  }

  if (stato === 'ok') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#f0fdf4' }}>
            <svg className="w-8 h-8" fill="none" stroke="#2d7a4f" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-2xl mb-3" style={{ color: '#1a2e5a' }}>
            Richiesta ricevuta!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Grazie per l'interesse. Il nostro team ti contatterà nelle prossime settimane
            per presentarti nel dettaglio le opportunità IFTS in apprendistato di primo livello.
          </p>
          <Link href="/ifts" className="text-sm font-medium" style={{ color: '#2d7a4f' }}>
            ← Torna ai percorsi IFTS
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <Link href="/ifts" className="text-sm text-gray-400 hover:text-gray-600">← Percorsi IFTS</Link>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2" style={{ color: '#1a2e5a' }}>
            La tua azienda e i percorsi IFTS
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Inserisci i tuoi dati per essere ricontattato dal nostro team. Valutare insieme
            se il percorso IFTS in apprendistato di primo livello è la soluzione giusta
            per la tua esigenza di personale.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">

          {/* Dati azienda */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1a2e5a' }}>Dati azienda</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Ragione sociale *</label>
                <input
                  type="text" value={form.ragione_sociale} onChange={e => set('ragione_sociale', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Partita IVA</label>
                <input
                  type="text" value={form.piva} onChange={e => set('piva', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Settore</label>
                <select
                  value={form.settore} onChange={e => set('settore', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="">Seleziona...</option>
                  <option value="tessile_moda">Tessile e Moda</option>
                  <option value="amministrativo">Servizi amministrativi</option>
                  <option value="manifatturiero">Manifatturiero</option>
                  <option value="altro">Altro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Referente */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1a2e5a' }}>Referente aziendale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
                <input
                  type="text" value={form.referente_nome} onChange={e => set('referente_nome', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cognome *</label>
                <input
                  type="text" value={form.referente_cognome} onChange={e => set('referente_cognome', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email" value={form.referente_email} onChange={e => set('referente_email', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Telefono</label>
                <input
                  type="tel" value={form.referente_telefono} onChange={e => set('referente_telefono', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Ruolo in azienda</label>
                <input
                  type="text" value={form.referente_ruolo} onChange={e => set('referente_ruolo', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  placeholder="es. Responsabile HR, Titolare, Amministratore"
                />
              </div>
            </div>
          </div>

          {/* Interesse */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1a2e5a' }}>Tipo di interesse</h2>
            <div className="space-y-3 mb-5">
              {[
                { value: 'singolo', label: 'Singolo apprendista', desc: 'Inserire uno o pochi giovani con percorso IFTS dedicato' },
                { value: 'academy', label: 'Academy aziendale', desc: 'Costruire un programma ricorrente per più apprendisti' },
                { value: 'entrambi', label: 'Entrambe le opzioni', desc: 'Vorrei valutare le due possibilità insieme' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${form.tipo_interesse === opt.value ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input
                    type="radio" name="tipo" value={opt.value}
                    checked={form.tipo_interesse === opt.value}
                    onChange={() => set('tipo_interesse', opt.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Numero giovani previsti</label>
                <input
                  type="number" min="1" max="50" value={form.n_giovani_previsti}
                  onChange={e => set('n_giovani_previsti', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  placeholder="es. 2"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-gray-600 mb-2">Indirizzi di interesse</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'amministrativo', label: 'Tecnico Amministrativo' },
                  { value: 'moda', label: 'Tecnico Moda' },
                  { value: 'multimediale', label: 'Produzione Multimediale' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.indirizzi_interesse.includes(opt.value)}
                      onChange={() => toggleIndirizzo(opt.value)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Note o domande (facoltativo)</label>
            <textarea
              value={form.note} onChange={e => set('note', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
              placeholder="Descrivi le tue esigenze specifiche o eventuali domande"
            />
          </div>

          {errore && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{errore}</p>
          )}

          <button
            type="submit" disabled={stato === 'loading'}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#1a2e5a' }}
          >
            {stato === 'loading' ? 'Invio in corso...' : 'Invia la richiesta'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            I dati sono trattati nel rispetto della normativa GDPR.{' '}
            <Link href="/privacy-policy" className="underline">Privacy policy</Link>
          </p>

        </form>
      </div>
    </main>
  )
}
