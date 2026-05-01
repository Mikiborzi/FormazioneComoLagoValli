'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function IftsCandidatiPage() {
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', telefono: '',
    data_nascita: '', titolo_studio: '', anno_titolo: '',
    indirizzo_interesse: '', ha_azienda: false, nome_azienda: '', note: '',
  })
  const [stato, setStato] = useState('idle') // idle | loading | ok | error
  const [errore, setErrore] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome || !form.cognome || !form.email || !form.indirizzo_interesse || !form.titolo_studio) {
      setErrore('Compila tutti i campi obbligatori.')
      return
    }
    setStato('loading')
    setErrore('')
    try {
      const res = await fetch('/api/ifts/candidati', {
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
            Abbiamo ricevuto la tua candidatura. Ti contatteremo nelle prossime settimane
            per valutare insieme il percorso più adatto e trovare un'azienda partner.
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
            Candidati a un percorso IFTS
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Compila il modulo. Ti risponderemo per valutare insieme il tuo profilo
            e abbinarti a un'azienda partner nella zona di Como.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">

          {/* Dati personali */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1a2e5a' }}>Dati personali</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome *</label>
                <input
                  type="text" value={form.nome} onChange={e => set('nome', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#2d7a4f' }} required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cognome *</label>
                <input
                  type="text" value={form.cognome} onChange={e => set('cognome', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Telefono</label>
                <input
                  type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Data di nascita</label>
                <input
                  type="date" value={form.data_nascita} onChange={e => set('data_nascita', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Titolo di studio */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1a2e5a' }}>Titolo di studio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo di titolo *</label>
                <select
                  value={form.titolo_studio} onChange={e => set('titolo_studio', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  required
                >
                  <option value="">Seleziona...</option>
                  <option value="diploma">Diploma di scuola superiore</option>
                  <option value="qualifica_professionale">Qualifica professionale</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Anno di conseguimento</label>
                <input
                  type="number" min="2000" max="2030" value={form.anno_titolo}
                  onChange={e => set('anno_titolo', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  placeholder="es. 2023"
                />
              </div>
            </div>
          </div>

          {/* Indirizzo di interesse */}
          <div>
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1a2e5a' }}>Percorso di interesse</h2>
            <div className="space-y-3">
              {[
                { value: 'amministrativo', label: 'Tecnico Amministrativo', desc: 'Contabilità, gestione ufficio, strumenti digitali' },
                { value: 'moda', label: 'Tecnico Moda — Made in Italy', desc: 'Produzione tessile, supply chain, distretto comasco' },
                { value: 'multimediale', label: 'Tecniche di Produzione Multimediale', desc: 'Video, fotografia, editing, comunicazione visiva' },
                { value: 'non_so', label: 'Non ho ancora deciso', desc: 'Ti aiutiamo a scegliere in base al tuo profilo' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${form.indirizzo_interesse === opt.value ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input
                    type="radio" name="indirizzo" value={opt.value} required
                    checked={form.indirizzo_interesse === opt.value}
                    onChange={() => set('indirizzo_interesse', opt.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Azienda */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" checked={form.ha_azienda}
                onChange={e => set('ha_azienda', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Ho già un'azienda interessata ad assumermi come apprendista</span>
            </label>
            {form.ha_azienda && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome dell'azienda</label>
                <input
                  type="text" value={form.nome_azienda} onChange={e => set('nome_azienda', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  placeholder="Ragione sociale"
                />
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Note o domande (facoltativo)</label>
            <textarea
              value={form.note} onChange={e => set('note', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
              placeholder="Scrivi qui eventuali domande o informazioni aggiuntive"
            />
          </div>

          {errore && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{errore}</p>
          )}

          <button
            type="submit" disabled={stato === 'loading'}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#2d7a4f' }}
          >
            {stato === 'loading' ? 'Invio in corso...' : 'Invia la candidatura'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            I tuoi dati sono trattati nel rispetto della normativa GDPR.{' '}
            <Link href="/privacy-policy" className="underline">Privacy policy</Link>
          </p>

        </form>
      </div>
    </main>
  )
}
