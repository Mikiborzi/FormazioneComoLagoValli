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

const NAVY = '#1a2744'
const NAVY_DARK = '#111c33'
const GOLD = '#c9a84c'
const GOLD_LIGHT = '#f5edd6'
const GOLD_DARK = '#a8872e'

export default function FormGradimento() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nome_cognome: '',
    situazione_attuale: '',
    servizio_usato: '',
    corso_slug: '',
    corso_label: '',
    valutazione: 0,
    testo_recensione: '',
    vuole_video: '',
    consenso_recensione: false,
    consenso_video: false,
    newsletter: false,
  })

  const [hoverStella, setHoverStella] = useState(0)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const mostraCorso = form.servizio_usato === 'corso' || form.servizio_usato === 'entrambi'
  const mostraConsensoVideo = form.vuole_video === 'si'

  const validaStep1 = () => form.nome_cognome.trim().length >= 2 && form.situazione_attuale
  const validaStep2 = () => {
    if (!form.servizio_usato) return false
    if (mostraCorso && !form.corso_slug) return false
    if (!form.valutazione) return false
    return true
  }
  const validaStep3 = () => form.testo_recensione.trim().length >= 30
  const validaStep4 = () => form.consenso_recensione

  const handleSubmit = async () => {
    if (!validaStep4()) return
    setLoading(true)
    setError(null)

    try {
      const { error: recErr } = await supabase.from('recensioni').insert([{
        nome: form.nome_cognome.split(' ')[0] || form.nome_cognome,
        cognome: form.nome_cognome.split(' ').slice(1).join(' ') || '',
        corso: form.corso_label || form.servizio_usato,
        corso_slug: form.corso_slug || null,
        anno: new Date().getFullYear(),
        testo: form.testo_recensione,
        valutazione: form.valutazione,
        visibile: false,
      }])
      if (recErr) throw recErr

      if (form.newsletter) {
        const nomeArr = form.nome_cognome.trim().split(' ')
        await supabase.from('newsletter').insert([{
          nome: nomeArr[0] || '',
          cognome: nomeArr.slice(1).join(' ') || '',
          attivo: true,
        }])
      }

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
      <div style={{ background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 16, border: `1px solid #e5e0d5`, padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: NAVY, marginBottom: '0.75rem' }}>Grazie davvero.</h1>
          <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            La tua recensione è stata ricevuta. Verrà pubblicata su{' '}
            <strong>formazionecomolago.it</strong> dopo una rapida verifica — di solito entro 24 ore.
          </p>
          {form.vuole_video === 'si' && (
            <div style={{ background: GOLD_LIGHT, borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.875rem', color: NAVY, lineHeight: 1.6 }}>
                <strong>Hai detto sì al video — ottimo!</strong> Ti manderemo su WhatsApp le tre domande guida. Dal telefono, 60 secondi, nessuna pretesa di perfezione.
              </p>
            </div>
          )}
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
            Il tuo contributo aiuta chi arriva dopo di te a fare la scelta giusta.
          </p>
          <a
            href="/"
            style={{ display: 'inline-block', background: GOLD, color: NAVY, fontWeight: 600, padding: '0.75rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontFamily: 'Georgia, serif' }}
          >
            Torna ai corsi
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: NAVY, paddingTop: '2.5rem', paddingBottom: '2.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Mestieri Lombardia Como
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            Com&apos;è andata? Raccontacelo.
          </h2>
          <p style={{ color: '#c5cde0', lineHeight: 1.7, fontSize: '0.9rem' }}>
            Hai usufruito dei nostri <strong style={{ color: '#fff' }}>servizi di orientamento e accompagnamento al lavoro e/o percorsi di formazione professionale</strong> finanziati da{' '}
            <strong style={{ color: '#fff' }}>Unione Europea, Ministero del Lavoro e Regione Lombardia</strong>. La tua opinione aiuta chi verrà dopo di te a fare la scelta giusta.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7a99', marginTop: '0.5rem' }}>Meno di 3 minuti · 4 sezioni · mobile friendly</p>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                height: 6,
                flex: 1,
                borderRadius: 999,
                background: s <= step ? GOLD : NAVY_DARK,
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        {/* STEP 1 — Chi sei */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e0d5', padding: '1.75rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Sezione 1 di 4</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: NAVY, marginBottom: '1.5rem' }}>Chi sei</h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                Nome e cognome <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={form.nome_cognome}
                onChange={e => set('nome_cognome', e.target.value)}
                placeholder="Mario Rossi"
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: 10,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD_LIGHT}` }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Di cosa ti occupi adesso? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SITUAZIONE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('situazione_attuale', opt.value)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      border: `1px solid ${form.situazione_attuale === opt.value ? GOLD : '#d1d5db'}`,
                      background: form.situazione_attuale === opt.value ? GOLD_LIGHT : '#fff',
                      color: form.situazione_attuale === opt.value ? NAVY : '#374151',
                      fontWeight: form.situazione_attuale === opt.value ? 600 : 400,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!validaStep1()}
              style={{
                width: '100%',
                background: validaStep1() ? GOLD : '#e5e7eb',
                color: validaStep1() ? NAVY : '#9ca3af',
                fontWeight: 600,
                padding: '0.85rem',
                borderRadius: 10,
                border: 'none',
                cursor: validaStep1() ? 'pointer' : 'not-allowed',
                fontSize: '0.95rem',
                fontFamily: 'Georgia, serif',
                transition: 'background 0.15s',
              }}
            >
              Avanti →
            </button>
          </div>
        )}

        {/* STEP 2 — Il servizio */}
        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e0d5', padding: '1.75rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Sezione 2 di 4</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: NAVY, marginBottom: '1.5rem' }}>Il servizio che hai ricevuto</h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Hai usato principalmente… <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SERVIZIO_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('servizio_usato', opt.value)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      border: `1px solid ${form.servizio_usato === opt.value ? GOLD : '#d1d5db'}`,
                      background: form.servizio_usato === opt.value ? GOLD_LIGHT : '#fff',
                      color: form.servizio_usato === opt.value ? NAVY : '#374151',
                      fontWeight: form.servizio_usato === opt.value ? 600 : 400,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {mostraCorso && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                  Quale corso hai fatto? <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={form.corso_slug}
                  onChange={e => {
                    const opt = CORSI.find(c => c.slug === e.target.value)
                    set('corso_slug', e.target.value)
                    set('corso_label', opt?.label || '')
                  }}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: 10,
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#fff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">Seleziona il corso…</option>
                  {CORSI.filter(c => c.slug !== 'orientamento').map(c => (
                    <option key={c.slug} value={c.slug}>{c.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stelle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.75rem' }}>
                Com&apos;è andata, in sintesi? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => set('valutazione', n)}
                    onMouseEnter={() => setHoverStella(n)}
                    onMouseLeave={() => setHoverStella(0)}
                    style={{
                      fontSize: '2rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: n <= (hoverStella || form.valutazione) ? GOLD : '#d1d5db',
                      transition: 'transform 0.1s, color 0.1s',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              {(hoverStella || form.valutazione) > 0 && (
                <p style={{ fontSize: '0.875rem', color: GOLD, fontWeight: 600 }}>
                  {STELLE_LABEL[hoverStella || form.valutazione]}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  border: `1px solid #d1d5db`,
                  background: '#fff',
                  color: '#374151',
                  fontWeight: 500,
                  padding: '0.85rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                }}
              >
                ← Indietro
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!validaStep2()}
                style={{
                  flex: 1,
                  background: validaStep2() ? GOLD : '#e5e7eb',
                  color: validaStep2() ? NAVY : '#9ca3af',
                  fontWeight: 600,
                  padding: '0.85rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: validaStep2() ? 'pointer' : 'not-allowed',
                  fontSize: '0.95rem',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Avanti →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Recensione */}
        {step === 3 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e0d5', padding: '1.75rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Sezione 3 di 4</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: NAVY, marginBottom: '0.5rem' }}>La tua recensione</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Scrivi liberamente — cosa ti ha aiutato, cosa porti con te, cosa diresti a chi sta valutando di venire. Non serve essere formali.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <textarea
                value={form.testo_recensione}
                onChange={e => set('testo_recensione', e.target.value)}
                placeholder="Racconta com'è andata. Anche poche righe vanno benissimo…"
                rows={5}
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: 10,
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
                onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD_LIGHT}` }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
              />
              <p style={{ fontSize: '0.75rem', marginTop: 4, color: form.testo_recensione.length < 30 ? '#9ca3af' : '#16a34a' }}>
                {form.testo_recensione.length < 30
                  ? `Ancora ${30 - form.testo_recensione.length} caratteri`
                  : '✓ Lunghezza ottima'}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                Vuoi raccontare la tua storia anche in un breve video? <span style={{ color: '#9ca3af' }}>(facoltativo)</span>
              </label>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                Dal telefono, 60 secondi, nessuna pretesa. Ti mandiamo tre domande guida così non devi inventarti niente.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { value: 'si', label: 'Sì, mandami le domande 🎥' },
                  { value: 'no', label: 'No grazie' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('vuole_video', opt.value)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 10,
                      border: `1px solid ${form.vuole_video === opt.value ? GOLD : '#d1d5db'}`,
                      background: form.vuole_video === opt.value ? GOLD_LIGHT : '#fff',
                      color: form.vuole_video === opt.value ? NAVY : '#374151',
                      fontWeight: form.vuole_video === opt.value ? 600 : 400,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  color: '#374151',
                  fontWeight: 500,
                  padding: '0.85rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                }}
              >
                ← Indietro
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!validaStep3()}
                style={{
                  flex: 1,
                  background: validaStep3() ? GOLD : '#e5e7eb',
                  color: validaStep3() ? NAVY : '#9ca3af',
                  fontWeight: 600,
                  padding: '0.85rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: validaStep3() ? 'pointer' : 'not-allowed',
                  fontSize: '0.95rem',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Avanti →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Consenso */}
        {step === 4 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e0d5', padding: '1.75rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Sezione 4 di 4</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: NAVY, marginBottom: '1.5rem' }}>Consenso alla pubblicazione</h2>

            {/* Consenso recensione — obbligatorio */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', gap: 12, cursor: 'pointer' }}>
                <div style={{ marginTop: 2 }}>
                  <input
                    type="checkbox"
                    checked={form.consenso_recensione}
                    onChange={e => set('consenso_recensione', e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: GOLD, marginTop: 2 }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937', marginBottom: '0.25rem' }}>
                    Autorizzo la pubblicazione della mia recensione <span style={{ color: '#ef4444' }}>*</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                    Autorizzo Mestieri Lombardia Como a pubblicare la mia recensione su{' '}
                    <strong>formazionecomolago.it</strong> e sulle pagine social di Mestieri Lombardia Como
                    (Facebook e Instagram). Il mio nome comparirà accanto alla recensione.
                    Posso chiedere la rimozione in qualsiasi momento scrivendo a{' '}
                    <a href="mailto:como@mestierilombardia.it" style={{ color: GOLD_DARK, textDecoration: 'underline' }}>
                      como@mestierilombardia.it
                    </a>.
                  </p>
                </div>
              </label>
            </div>

            {/* Consenso video — condizionale */}
            {mostraConsensoVideo && (
              <div style={{ marginBottom: '1rem', background: GOLD_LIGHT, borderRadius: 12, padding: '1rem' }}>
                <label style={{ display: 'flex', gap: 12, cursor: 'pointer' }}>
                  <div style={{ marginTop: 2 }}>
                    <input
                      type="checkbox"
                      checked={form.consenso_video}
                      onChange={e => set('consenso_video', e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: GOLD, marginTop: 2 }}
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: NAVY, marginBottom: '0.25rem' }}>
                      Autorizzo la pubblicazione del mio video
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#5c4a1a', lineHeight: 1.6 }}>
                      Autorizzo Mestieri Lombardia Como a pubblicare il video che invierò sui canali social
                      e sul sito. Posso chiedere la rimozione in qualsiasi momento scrivendo a{' '}
                      <a href="mailto:como@mestierilombardia.it" style={{ textDecoration: 'underline', color: NAVY }}>
                        como@mestierilombardia.it
                      </a>.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Newsletter — opzionale */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', gap: 12, cursor: 'pointer' }}>
                <div style={{ marginTop: 2 }}>
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={e => set('newsletter', e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: GOLD, marginTop: 2 }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1f2937', marginBottom: '0.25rem' }}>
                    Voglio ricevere aggiornamenti sui nuovi corsi
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Niente spam — solo avvisi quando partono nuovi percorsi sul lago e nelle valli.
                    Puoi cancellarti in qualsiasi momento.
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <div style={{ marginBottom: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  color: '#374151',
                  fontWeight: 500,
                  padding: '0.85rem',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                }}
              >
                ← Indietro
              </button>
              <button
                onClick={handleSubmit}
                disabled={!validaStep4() || loading}
                style={{
                  flex: 1,
                  background: validaStep4() && !loading ? GOLD : '#e5e7eb',
                  color: validaStep4() && !loading ? NAVY : '#9ca3af',
                  fontWeight: 600,
                  padding: '0.85rem',
                  borderRadius: 10,
                  border: 'none',
                  cursor: validaStep4() && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {loading ? 'Invio in corso…' : 'Invia la mia recensione ✓'}
              </button>
            </div>

            <p style={{ fontSize: '0.72rem', color: '#9ca3af', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
              I tuoi dati sono trattati da Mestieri Lombardia Como nel rispetto del GDPR.
              Puoi esercitare i tuoi diritti scrivendo a como@mestierilombardia.it
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
