'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'

const STATUS_OPTIONS = [
  { value: 'disoccupato', label: 'Disoccupato/a (ex lavoratore in cerca di impiego)' },
  { value: 'inoccupato', label: 'Inoccupato/a (mai lavorato, in cerca di prima occupazione)' },
  { value: 'studente_universitario', label: 'Studente universitario o di accademia' },
  { value: 'occupato', label: 'Occupato/a (dipendente o autonomo)' },
  { value: 'imprenditore', label: 'Imprenditore/trice' },
]

const GOL_IDONEI = ['disoccupato', 'inoccupato', 'studente_universitario']

const COME_SAPUTO_OPTIONS = [
  { value: 'indeed', label: 'Annuncio Indeed' },
  { value: 'linkedin', label: 'Annuncio LinkedIn' },
  { value: 'passaparola', label: 'Passaparola' },
  { value: 'google', label: 'Ricerca Google' },
  { value: 'social', label: 'Social media (Facebook, Instagram)' },
  { value: 'cpi', label: 'Centro per l\'Impiego' },
  { value: 'altro', label: 'Altro' },
]

const CF_REGEX = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ServiziLavoro() {
  const [showSospensione, setShowSospensione] = useState(true)
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', telefono: '',
    codice_fiscale: '', data_nascita: '',
    comune_residenza: '', indirizzo: '',
    status: '',
    iscritto_cpi: false, cpi_riferimento: '',
    gol_attivo: false, ente_gol: '',
    interessato_formazione: false,
    come_saputo: '',
    newsletter: false,
    gdpr: false,
  })
  const [cvFile, setCvFile] = useState(null)
  const [errori, setErrori] = useState({})
  const [step, setStep] = useState('form') // form | success | error
  const [loading, setLoading] = useState(false)

  const idoneoGol = GOL_IDONEI.includes(form.status)

  function set(campo, valore) {
    setForm(prev => ({ ...prev, [campo]: valore }))
    if (errori[campo]) setErrori(prev => { const e = { ...prev }; delete e[campo]; return e })
  }

  function valida() {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Campo obbligatorio'
    if (!form.cognome.trim()) e.cognome = 'Campo obbligatorio'
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) e.email = 'Email non valida'
    if (!form.telefono.trim()) e.telefono = 'Campo obbligatorio'
    if (form.codice_fiscale && !CF_REGEX.test(form.codice_fiscale.toUpperCase())) e.codice_fiscale = 'Codice fiscale non valido'
    if (!form.comune_residenza.trim()) e.comune_residenza = 'Campo obbligatorio'
    if (!form.status) e.status = 'Seleziona la tua situazione lavorativa'
    if (!form.come_saputo) e.come_saputo = 'Seleziona come ci hai trovato'
    if (!form.gdpr) e.gdpr = 'Il consenso è obbligatorio'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = valida()
    if (Object.keys(e2).length > 0) { setErrori(e2); return }

    setLoading(true)
    try {
      let cv_url = null

      // Upload CV se presente
      if (cvFile) {
        const ext = cvFile.name.split('.').pop()
        const path = `${Date.now()}_${form.cognome.replace(/\s/g,'_')}_${form.nome.replace(/\s/g,'_')}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(path, cvFile, { cacheControl: '3600', upsert: false })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(path)
          cv_url = urlData.publicUrl
        }
      }

      const payload = {
        tipo: 'servizi_lavoro',
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        codice_fiscale: form.codice_fiscale ? form.codice_fiscale.toUpperCase().trim() : null,
        data_nascita: form.data_nascita || null,
        comune_residenza: form.comune_residenza.trim(),
        indirizzo: form.indirizzo.trim() || null,
        status: form.status,
        idoneo_gol: idoneoGol,
        iscritto_cpi: form.iscritto_cpi,
        cpi_riferimento: form.cpi_riferimento.trim() || null,
        gol_attivo: form.gol_attivo,
        ente_gol: form.ente_gol.trim() || null,
        interessato_formazione: form.interessato_formazione,
        come_saputo: form.come_saputo,
        newsletter: form.newsletter,
        stato: 'nuovo',
        cv_url,
      }

      const { error } = await supabase.from('iscrizioni').insert(payload)
      if (error) throw error

      if (form.newsletter) {
        await supabase.from('newsletter').upsert(
          { email: payload.email, nome: payload.nome, attivo: true },
          { onConflict: 'email' }
        )
      }

      setStep('success')
    } catch (err) {
      console.error(err)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (campo) => ({
    width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    border: errori[campo] ? '2px solid #ef4444' : '1px solid #d1d5db',
    background: 'white',
  })
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }
  const errStyle = { color: '#ef4444', fontSize: '12px', marginTop: '4px' }
  const fieldStyle = { marginBottom: '20px' }

  // SUCCESS
  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2e5a 0%, #2d4a8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Richiesta ricevuta!</h1>
          {idoneoGol ? (
            <>
              <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>
                Hai i requisiti per accedere ai <strong>servizi gratuiti GOL</strong>: orientamento professionale, accompagnamento alla ricerca del lavoro e formazione finanziata.
              </p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ color: '#065f46', fontSize: '14px', margin: 0, fontWeight: '600' }}>
                  🎯 Sarai contattato entro 2-3 giorni lavorativi da un nostro operatore.
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>
                Abbiamo ricevuto la tua richiesta. Anche se non rientri nel programma GOL, possiamo valutare insieme le opzioni più adatte alla tua situazione.
              </p>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ color: '#1e40af', fontSize: '14px', margin: 0, fontWeight: '600' }}>
                  📞 Ti contatteremo entro 3-5 giorni lavorativi.
                </p>
              </div>
            </>
          )}
          <a href="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#1a2e5a', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            Torna alla home
          </a>
        </div>
      </div>
    )
  }

  // ERROR
  if (step === 'error') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2e5a 0%, #2d4a8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Si è verificato un errore</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Non siamo riusciti a salvare la tua richiesta. Riprova o scrivici a <strong>como@mestierilombardia.it</strong></p>
          <button onClick={() => setStep('form')} style={{ padding: '12px 28px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
            Riprova
          </button>
        </div>
      </div>
    )
  }

  // FORM
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* POPUP SOSPENSIONE */}
      {showSospensione && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px 36px', maxWidth: '560px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.35)', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '12px' }}>⚠️</div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '14px', lineHeight: '1.3' }}>
              Servizio temporaneamente sospeso
            </h2>
            <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '12px', fontSize: '15px' }}>
              Regione Lombardia sta rivedendo gli strumenti di <strong>Politiche Attive del Lavoro</strong>.
              Siamo in attesa di conoscere le nuove misure che saranno adottate.
            </p>
            <p style={{ color: '#374151', lineHeight: '1.7', marginBottom: '24px', fontSize: '15px' }}>
              Le informazioni presenti in questa sezione — riferite al <strong>Programma GOL fino al 30/06/2026</strong> — <strong>non sono da ritenersi aggiornate e valide</strong>.
            </p>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '28px' }}>
              Per informazioni aggiornate contattaci direttamente: saremo felici di aggiornarti non appena le nuove misure saranno disponibili.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:como@mestierilombardia.it" style={{ padding: '12px 22px', background: '#1a2e5a', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                Contattaci
              </a>
              <button onClick={() => setShowSospensione(false)} style={{ padding: '12px 22px', background: 'white', color: '#1a2e5a', border: '2px solid #1a2e5a', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                Consulta le informazioni archiviate
              </button>
            </div>
          </div>
        </div>
      )}
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a2e5a 0%, #2d4a8a 100%)', color: 'white', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 12px', lineHeight: '1.2' }}>
            Supporto gratuito alla ricerca del lavoro
          </h1>
          <p style={{ fontSize: '17px', color: '#bfdbfe', lineHeight: '1.6', margin: '0 0 24px' }}>
            Mestieri Lombardia Como ti offre orientamento professionale, accompagnamento al lavoro e formazione finanziata.
            Compila il form: ti contatteremo entro 3 giorni lavorativi.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['✅ Servizio completamente gratuito', '🎯 Operatori specializzati', '📍 Como e Tremezzina'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '600' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* BANNER FINANZIAMENTO */}
      <div style={{ background: '#f0f7ff', borderBottom: '1px solid #bfdbfe', padding: '20px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Finanziato da misure di Politiche Attive del Lavoro
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            {[
              { flag: '🇪🇺', label: 'Unione Europea' },
              { flag: '🇮🇹', label: 'Ministero del Lavoro e delle Politiche Sociali' },
              { flag: '🏛️', label: 'Regione Lombardia' },
            ].map(({ flag, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e3a8a', fontWeight: '600' }}>
                <span>{flag}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#1e40af', fontStyle: 'italic' }}>
            Nessun costo nascosto. È un investimento pubblico sul tuo sviluppo professionale. <strong>Cogli l'occasione.</strong>
          </p>
        </div>
      </div>

      {/* FORM */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <form onSubmit={handleSubmit} noValidate>

          {/* DATI PERSONALI */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' }}>Dati personali</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nome *</label>
                <input style={inputStyle('nome')} value={form.nome} onChange={e => set('nome', e.target.value)} />
                {errori.nome && <p style={errStyle}>{errori.nome}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cognome *</label>
                <input style={inputStyle('cognome')} value={form.cognome} onChange={e => set('cognome', e.target.value)} />
                {errori.cognome && <p style={errStyle}>{errori.cognome}</p>}
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email *</label>
              <input type="email" style={inputStyle('email')} value={form.email} onChange={e => set('email', e.target.value)} />
              {errori.email && <p style={errStyle}>{errori.email}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Telefono *</label>
              <input type="tel" style={inputStyle('telefono')} value={form.telefono} onChange={e => set('telefono', e.target.value)} />
              {errori.telefono && <p style={errStyle}>{errori.telefono}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Codice fiscale</label>
                <input style={inputStyle('codice_fiscale')} value={form.codice_fiscale} onChange={e => set('codice_fiscale', e.target.value.toUpperCase())} maxLength={16} />
                {errori.codice_fiscale && <p style={errStyle}>{errori.codice_fiscale}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Data di nascita</label>
                <input type="date" style={inputStyle('data_nascita')} value={form.data_nascita} onChange={e => set('data_nascita', e.target.value)} />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Comune di residenza *</label>
              <input style={inputStyle('comune_residenza')} value={form.comune_residenza} onChange={e => set('comune_residenza', e.target.value)} placeholder="es. Como, Menaggio, Tremezzina..." />
              {errori.comune_residenza && <p style={errStyle}>{errori.comune_residenza}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Indirizzo</label>
              <input style={inputStyle('indirizzo')} value={form.indirizzo} onChange={e => set('indirizzo', e.target.value)} />
            </div>
          </div>

          {/* SITUAZIONE LAVORATIVA */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' }}>Situazione lavorativa</h2>
            <div style={fieldStyle}>
              <label style={labelStyle}>Qual è la tua situazione attuale? *</label>
              {STATUS_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', border: form.status === opt.value ? '2px solid #1a2e5a' : '1px solid #e5e7eb', background: form.status === opt.value ? '#eff6ff' : 'white' }}>
                  <input type="radio" name="status" value={opt.value} checked={form.status === opt.value} onChange={e => set('status', e.target.value)} style={{ marginTop: '2px', accentColor: '#1a2e5a' }} />
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4' }}>{opt.label}</span>
                </label>
              ))}
              {errori.status && <p style={errStyle}>{errori.status}</p>}
            </div>

            {/* Banner GOL */}
            {form.status && (
              <div style={{ padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', background: idoneoGol ? '#f0fdf4' : '#fef9c3', border: idoneoGol ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>
                {idoneoGol ? (
                  <p style={{ margin: 0, color: '#065f46', fontSize: '14px', fontWeight: '600' }}>
                    ✅ Con la tua situazione puoi accedere ai <strong>servizi GOL completamente gratuiti</strong>: orientamento, accompagnamento al lavoro e formazione finanziata.
                  </p>
                ) : (
                  <p style={{ margin: 0, color: '#92400e', fontSize: '14px', fontWeight: '600' }}>
                    ℹ️ Non rientri nel programma GOL, ma possiamo comunque supportarti con altri servizi. Compila il form e ti contatteremo.
                  </p>
                )}
              </div>
            )}

            <div style={fieldStyle}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                <input type="checkbox" checked={form.iscritto_cpi} onChange={e => set('iscritto_cpi', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#1a2e5a' }} />
                Sono iscritto/a al Centro per l'Impiego (CPI)
              </label>
            </div>
            {form.iscritto_cpi && (
              <div style={fieldStyle}>
                <label style={labelStyle}>CPI di riferimento</label>
                <input style={inputStyle('cpi_riferimento')} value={form.cpi_riferimento} onChange={e => set('cpi_riferimento', e.target.value)} placeholder="es. CPI di Como, CPI di Menaggio..." />
              </div>
            )}

            <div style={fieldStyle}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                <input type="checkbox" checked={form.gol_attivo} onChange={e => set('gol_attivo', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#1a2e5a' }} />
                Sono già inserito/a in un percorso GOL con un altro ente
              </label>
            </div>
            {form.gol_attivo && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Ente che gestisce il tuo percorso GOL</label>
                <input style={inputStyle('ente_gol')} value={form.ente_gol} onChange={e => set('ente_gol', e.target.value)} />
              </div>
            )}
          </div>

          {/* CV E FORMAZIONE */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' }}>CV e formazione</h2>

            <div style={fieldStyle}>
              <label style={labelStyle}>Allega il tuo CV (PDF, Word — max 5MB)</label>
              <div style={{ border: '2px dashed #d1d5db', borderRadius: '10px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: cvFile ? '#f0fdf4' : '#fafafa', position: 'relative' }}
                onDragOver={e => { e.preventDefault() }}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.size <= 5*1024*1024) setCvFile(f) }}>
                <input type="file" accept=".pdf,.doc,.docx" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  onChange={e => { const f = e.target.files[0]; if (f && f.size <= 5*1024*1024) setCvFile(f) }} />
                {cvFile ? (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                    <p style={{ color: '#065f46', fontWeight: '600', margin: 0 }}>{cvFile.name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0' }}>{(cvFile.size/1024).toFixed(0)} KB</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📎</div>
                    <p style={{ color: '#6b7280', margin: 0 }}>Trascina il file qui o clicca per selezionarlo</p>
                    <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0' }}>PDF, Word — max 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '12px 16px', borderRadius: '10px', background: form.interessato_formazione ? '#eff6ff' : '#f8fafc', border: form.interessato_formazione ? '2px solid #1a2e5a' : '1px solid #e5e7eb' }}>
              <input type="checkbox" checked={form.interessato_formazione} onChange={e => set('interessato_formazione', e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#1a2e5a' }} />
              <div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'block' }}>Sono interessato/a anche ai corsi di formazione</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Ti invieremo informazioni sui corsi disponibili a Como e Tremezzina</span>
              </div>
            </label>
          </div>

          {/* COME CI HAI TROVATI + CONSENSI */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' }}>Consensi</h2>

            <div style={fieldStyle}>
              <label style={labelStyle}>Come hai saputo di noi? *</label>
              <select style={{ ...inputStyle('come_saputo'), appearance: 'none' }} value={form.come_saputo} onChange={e => set('come_saputo', e.target.value)}>
                <option value="">Seleziona...</option>
                {COME_SAPUTO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errori.come_saputo && <p style={errStyle}>{errori.come_saputo}</p>}
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '16px' }}>
              <input type="checkbox" checked={form.newsletter} onChange={e => set('newsletter', e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#1a2e5a' }} />
              <span style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                Acconsento a ricevere aggiornamenti su nuovi corsi e opportunità lavorative (facoltativo)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '14px', borderRadius: '8px', background: errori.gdpr ? '#fef2f2' : '#f8fafc', border: errori.gdpr ? '2px solid #ef4444' : '1px solid #e5e7eb' }}>
              <input type="checkbox" checked={form.gdpr} onChange={e => set('gdpr', e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#1a2e5a' }} />
              <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                * Ho letto e accetto il trattamento dei miei dati personali ai sensi dell'art. 13 GDPR per le finalità descritte nella{' '}
                <a href="/privacy-policy" target="_blank" style={{ color: '#1a2e5a', fontWeight: '600' }}>Privacy Policy</a>.
              </span>
            </label>
            {errori.gdpr && <p style={{ ...errStyle, marginTop: '8px' }}>{errori.gdpr}</p>}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '16px', background: loading ? '#6b7280' : '#1a2e5a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
            {loading ? 'Invio in corso...' : '📩 Invia la mia richiesta'}
          </button>
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '12px' }}>
            I campi con * sono obbligatori · Servizio gratuito offerto da Mestieri Lombardia Como
          </p>
        </form>
      </div>
    </div>
  )
}
