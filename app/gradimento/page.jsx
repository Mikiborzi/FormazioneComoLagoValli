'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const CORSI = [
  { slug: 'fatti-impresa', label: '⭐ Fatti Impresa (pacchetto)' },
  { slug: 'business-up', label: 'Business UP!' },
  { slug: 'digital-marketing-ai', label: 'Digital Marketing & AI' },
  { slug: 'giardinaggio-base', label: 'Giardinaggio Base' },
  { slug: 'addetto-cucina', label: 'Addetto di Cucina' },
  { slug: 'centralinista-receptionist', label: 'Centralinista e Receptionist' },
  { slug: 'inglese-base', label: 'Inglese Base (A1/A2)' },
  { slug: 'inglese-intermedio', label: 'Inglese Intermedio (B1/B2)' },
  { slug: 'business-english', label: 'Business English (B2/C1)' },
  { slug: 'tedesco-base', label: 'Tedesco Base (A1/A2)' },
  { slug: 'tedesco-intermedio', label: 'Tedesco Intermedio (B1/B2)' },
  { slug: 'informatica-base', label: 'Informatica Base' },
  { slug: 'informatica-intermedio', label: 'Informatica Intermedio' },
  { slug: 'intelligenza-artificiale', label: 'Intelligenza Artificiale' },
  { slug: 'digital-marketing', label: 'Digital Marketing' },
  { slug: 'orientamento', label: 'Orientamento e accompagnamento al lavoro' },
]

const STELLE_LABEL = {
  1: 'Deludente',
  2: 'Sotto le aspettative',
  3: 'Nella norma',
  4: 'Soddisfacente',
  5: 'Oltre le aspettative',
}

const SITUAZIONE_OPTIONS = [
  { value: 'lavoro', label: 'Sto lavorando' },
  { value: 'cerca', label: 'Sto cercando lavoro' },
  { value: 'corso', label: 'Sto seguendo un altro corso' },
  { value: 'altro', label: 'Altro' },
]

const SERVIZIO_OPTIONS = [
  { value: 'orientamento', label: 'Orientamento e accompagnamento al lavoro' },
  { value: 'corso', label: 'Un corso di formazione' },
  { value: 'entrambi', label: 'Entrambi' },
]

export default function FormGradimento() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    // Sezione 1
    nome_cognome: '',
    situazione_attuale: '',
    // Sezione 2
    servizio_usato: '',
    corso_slug: '',
    corso_label: '',
    valutazione: 0,
    // Sezione 3
    testo_recensione: '',
    vuole_video: '',
    // Sezione 4
    consenso_recensione: false,
    consenso_video: false,
    newsletter: false,
  })

  const [hoverStella, setHoverStella] = useState(0)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const mostraCorso = form.servizio_usato === 'corso' || form.servizio_usato === 'entrambi'
  const mostraConsensoVideo = form.vuole_video === 'si'

  // Validazione per step
  const validaStep1 = () => form.nome_cognome.trim().length >= 2 && form.situazione_attuale
  const validaStep2 = () => {
    if (!form.servizio_usato) return false
    if (mostraCorso && !form.corso_slug) return false
    if (!form.valutazione) return false
    return true
  }
  const validaStep3 = () => form.testo_recensione.trim().length >= 30 && form.vuole_video
  const validaStep4 = () => form.consenso_recensione

  const handleSubmit = async () => {
    if (!validaStep4()) return
    setLoading(true)
    setError(null)

    try {
      // Salva recensione in Supabase
      const { error: recErr } = await supabase.from('recensioni').insert([{
        nome: form.nome_cognome.split(' ')[0] || form.nome_cognome,
        cognome: form.nome_cognome.split(' ').slice(1).join(' ') || '',
        corso: form.corso_label || form.servizio_usato,
        corso_slug: form.corso_slug || null,
        anno: new Date().getFullYear(),
        testo: form.testo_recensione,
        valutazione: form.valutazione,
        visibile: false, // approvazione manuale da Supabase
      }])
      if (recErr) throw recErr

      // Salva newsletter se opt-in
      if (form.newsletter) {
        const nomeArr = form.nome_cognome.trim().split(' ')
        await supabase.from('newsletter').insert([{
          nome: nomeArr[0] || '',
          cognome: nomeArr.slice(1).join(' ') || '',
          attivo: true,
        }])
      }

      // Salva richiesta video in tabella video_testimonianze
      if (form.vuole_video === 'si' && form.consenso_video) {
        await supabase.from('video_testimonianze').insert([{
          nome: form.nome_cognome,
          corso: form.corso_label || form.servizio_usato,
          approvato: false,
          note: 'Richiesta video da form gradimento — da contattare con domande guida',
        }])
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Errore salvataggio form gradimento:', err)
      setError('Si è verificato un errore. Riprova o scrivici a como@mestierilombardia.it')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Grazie davvero.</h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            La tua recensione è stata ricevuta. Verrà pubblicata su{' '}
            <strong>formazionecomolago.it</strong> dopo una rapida verifica — di solito entro 24 ore.
          </p>
          {form.vuole_video === 'si' && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Hai detto sì al video — ottimo!</strong> Ti manderemo su WhatsApp le tre domande guida. Dal telefono, 60 secondi, nessuna pretesa di perfezione.
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">
            Il tuo contributo aiuta chi arriva dopo di te a fare la scelta giusta.
          </p>
          <a
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Torna ai corsi
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-2">
            Mestieri Lombardia · Starting Work
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Com'è andata? Raccontacelo.
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm">
            Hai partecipato a un percorso di orientamento o seguito un corso finanziato da{' '}
            <strong>Unione Europea, Ministero del Lavoro e Regione Lombardia</strong>. La tua opinione aiuta chi verrà dopo di te a fare la scelta giusta.
          </p>
          <p className="text-xs text-gray-400 mt-2">Meno di 3 minuti · 4 sezioni · mobile friendly</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1 — Chi sei */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Sezione 1 di 4</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Chi sei</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome e cognome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nome_cognome}
                onChange={e => set('nome_cognome', e.target.value)}
                placeholder="Mario Rossi"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Di cosa ti occupi adesso? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {SITUAZIONE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('situazione_attuale', opt.value)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                      form.situazione_attuale === opt.value
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!validaStep1()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Avanti →
            </button>
          </div>
        )}

        {/* STEP 2 — Il servizio */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Sezione 2 di 4</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Il servizio che hai ricevuto</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hai usato principalmente… <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {SERVIZIO_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('servizio_usato', opt.value)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                      form.servizio_usato === opt.value
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo corso — condizionale */}
            {mostraCorso && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quale corso hai fatto? <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.corso_slug}
                  onChange={e => {
                    const opt = CORSI.find(c => c.slug === e.target.value)
                    set('corso_slug', e.target.value)
                    set('corso_label', opt?.label || '')
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent bg-white"
                >
                  <option value="">Seleziona il corso…</option>
                  {CORSI.filter(c => c.slug !== 'orientamento').map(c => (
                    <option key={c.slug} value={c.slug}>{c.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stelle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Com'è andata, in sintesi? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => set('valutazione', n)}
                    onMouseEnter={() => setHoverStella(n)}
                    onMouseLeave={() => setHoverStella(0)}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    {n <= (hoverStella || form.valutazione) ? '★' : '☆'}
                  </button>
                ))}
              </div>
              {(hoverStella || form.valutazione) > 0 && (
                <p className="text-sm text-orange-600 font-medium">
                  {STELLE_LABEL[hoverStella || form.valutazione]}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Indietro
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!validaStep2()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Avanti →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Recensione */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Sezione 3 di 4</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">La tua recensione</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Scrivi liberamente — cosa ti ha aiutato, cosa porti con te, cosa diresti a chi sta valutando di venire. Non serve essere formali.
            </p>

            <div className="mb-5">
              <textarea
                value={form.testo_recensione}
                onChange={e => set('testo_recensione', e.target.value)}
                placeholder="Racconta com'è andata. Anche poche righe vanno benissimo…"
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-none"
              />
              <p className={`text-xs mt-1 ${form.testo_recensione.length < 30 ? 'text-gray-400' : 'text-green-600'}`}>
                {form.testo_recensione.length < 30
                  ? `Ancora ${30 - form.testo_recensione.length} caratteri`
                  : '✓ Lunghezza ottima'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vuoi raccontare la tua storia anche in un breve video? <span className="text-gray-400">(facoltativo)</span>
              </label>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Dal telefono, 60 secondi, nessuna pretesa. Ti mandiamo tre domande guida così non devi inventarti niente.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'si', label: 'Sì, mandami le domande 🎥' },
                  { value: 'no', label: 'No grazie' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('vuole_video', opt.value)}
                    className={`px-4 py-3 rounded-xl border text-sm transition-colors ${
                      form.vuole_video === opt.value
                        ? 'bg-orange-50 border-orange-400 text-orange-800 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Indietro
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!validaStep3()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Avanti →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Consenso */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Sezione 4 di 4</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Consenso alla pubblicazione</h2>

            {/* Consenso recensione — obbligatorio */}
            <div className="mb-4">
              <label className="flex gap-3 cursor-pointer">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={form.consenso_recensione}
                    onChange={e => set('consenso_recensione', e.target.checked)}
                    className="w-4 h-4 accent-orange-500 mt-0.5"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Autorizzo la pubblicazione della mia recensione <span className="text-red-500">*</span>
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Autorizzo Mestieri Lombardia a pubblicare la mia recensione su{' '}
                    <strong>formazionecomolago.it</strong> e sulle pagine social di Mestieri Lombardia
                    (Facebook e Instagram). Il mio nome comparirà accanto alla recensione.
                    Posso chiedere la rimozione in qualsiasi momento scrivendo a{' '}
                    <a href="mailto:como@mestierilombardia.it" className="text-orange-600 underline">
                      como@mestierilombardia.it
                    </a>.
                  </p>
                </div>
              </label>
            </div>

            {/* Consenso video — condizionale */}
            {mostraConsensoVideo && (
              <div className="mb-4 bg-blue-50 rounded-xl p-4">
                <label className="flex gap-3 cursor-pointer">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.consenso_video}
                      onChange={e => set('consenso_video', e.target.checked)}
                      className="w-4 h-4 accent-orange-500 mt-0.5"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Autorizzo la pubblicazione del mio video
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Autorizzo Mestieri Lombardia a pubblicare il video che invierò sui canali social
                      e sul sito. Posso chiedere la rimozione in qualsiasi momento scrivendo a{' '}
                      <a href="mailto:como@mestierilombardia.it" className="underline">
                        como@mestierilombardia.it
                      </a>.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Newsletter — opzionale */}
            <div className="mb-6">
              <label className="flex gap-3 cursor-pointer">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={e => set('newsletter', e.target.checked)}
                    className="w-4 h-4 accent-orange-500 mt-0.5"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Voglio ricevere aggiornamenti sui nuovi corsi
                  </p>
                  <p className="text-xs text-gray-500">
                    Niente spam — solo avvisi quando partono nuovi percorsi sul lago e nelle valli.
                    Puoi cancellarti in qualsiasi momento.
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Indietro
              </button>
              <button
                onClick={handleSubmit}
                disabled={!validaStep4() || loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors"
              >
                {loading ? 'Invio in corso…' : 'Invia la mia recensione ✓'}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
              I tuoi dati sono trattati da Mestieri Lombardia nel rispetto del GDPR.
              Puoi esercitare i tuoi diritti scrivendo a como@mestierilombardia.it
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
