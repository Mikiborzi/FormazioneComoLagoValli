'use client'

import { useState, useEffect, useMemo } from 'react'

const STATI = ['nuovo', 'contattato', 'iscritto', 'in_attesa', 'non_idoneo']
const STATO_COLORS = {
  nuovo:      { bg: '#FEF3C7', text: '#92400E', label: 'Nuovo' },
  contattato: { bg: '#DBEAFE', text: '#1E40AF', label: 'Contattato' },
  iscritto:   { bg: '#D1FAE5', text: '#065F46', label: 'Iscritto' },
  in_attesa:  { bg: '#F3F4F6', text: '#374151', label: 'In attesa' },
  non_idoneo: { bg: '#FEE2E2', text: '#991B1B', label: 'Non idoneo' },
}
const CORSI_LABELS = {
  'fatti-impresa': '⭐ Fatti Impresa',
  'business-up': 'Business UP!',
  'digital-marketing-ai': 'Digital Marketing & AI',
  'giardinaggio-base': 'Giardinaggio Base',
  'addetto-cucina': 'Addetto di Cucina',
  'centralinista-receptionist': 'Centralinista e Receptionist',
  'inglese-base': 'Inglese Base',
  'inglese-intermedio': 'Inglese Intermedio',
  'business-english': 'Business English',
  'tedesco-base': 'Tedesco Base',
  'tedesco-intermedio': 'Tedesco Intermedio',
  'informatica-base': 'Informatica Base',
  'informatica-intermedio': 'Informatica Intermedio',
  'intelligenza-artificiale': 'Intelligenza Artificiale',
  'digital-marketing': 'Digital Marketing',
}

function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [mostra, setMostra] = useState(false)
  const [errore, setErrore] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      if (res.ok) {
        const { token } = await res.json()
        sessionStorage.setItem('admin_token', token)
        onLogin(token)
      } else {
        setErrore(true)
        setPwd('')
      }
    } catch {
      setErrore(true)
      setPwd('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a,#1e293b)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'white', borderRadius:'12px', padding:'48px', width:'100%', maxWidth:'400px', boxShadow:'0 25px 50px rgba(0,0,0,0.4)', textAlign:'center' }}>
        <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔐</div>
        <h1 style={{ fontSize:'22px', fontWeight:'700', color:'#0f172a', marginBottom:'8px' }}>Area Admin</h1>
        <p style={{ color:'#64748b', fontSize:'14px', marginBottom:'32px' }}>Formazione Como Lago e Valli</p>
        <form onSubmit={handleSubmit}>
          <div style={{ position:'relative', marginBottom:'8px' }}>
            <input type={mostra ? 'text' : 'password'} placeholder="Password" value={pwd}
              onChange={e => { setPwd(e.target.value); setErrore(false) }} autoFocus
              style={{ width:'100%', padding:'12px 48px 12px 16px', border: errore ? '2px solid #ef4444' : '2px solid #e2e8f0', borderRadius:'8px', fontSize:'16px', outline:'none', boxSizing:'border-box' }} />
            <button type="button" onClick={() => setMostra(v => !v)}
              style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'18px', lineHeight:1, padding:0 }}>
              {mostra ? '🙈' : '👁️'}
            </button>
          </div>
          {errore && <p style={{ color:'#ef4444', fontSize:'13px', marginBottom:'8px', textAlign:'left' }}>Password non corretta</p>}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background:'#0f172a', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:'pointer', marginTop:'8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Verifica...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState(null)
  const [iscrizioni, setIscrizioni] = useState([])
  const [loading, setLoading] = useState(true)
  const [aggiornamento, setAggiornamento] = useState(null)
  const [filtroStato, setFiltroStato] = useState('tutti')
  const [filtroCorso, setFiltroCorso] = useState('tutti')
  const [filtroGol, setFiltroGol] = useState('tutti')
  const [filtroTipo, setFiltroTipo] = useState('tutti')
  const [ricerca, setRicerca] = useState('')
  const [selezionato, setSelezionato] = useState(null)

  const [tabAttivo, setTabAttivo] = useState('gol')
  const [iftsCandidati, setIftsCandidati] = useState([])
  const [iftsAziende, setIftsAziende] = useState([])
  const [loadingIfts, setLoadingIfts] = useState(false)
  const [iftsSubTab, setIftsSubTab] = useState('candidati')
  const [aggIfts, setAggIfts] = useState(null)

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) { setToken(t); caricaIscrizioni(t) }
    else setLoading(false)
  }, [])

  function handleLogin(t) { setToken(t); caricaIscrizioni(t) }

  async function caricaIscrizioni(t) {
    setLoading(true)
    const res = await fetch('/api/admin/iscrizioni', {
      headers: { Authorization: `Bearer ${t}` }
    })
    if (res.ok) setIscrizioni(await res.json())
    else { sessionStorage.removeItem('admin_token'); setToken(null) }
    setLoading(false)
  }

  async function aggiornaStato(id, nuovoStato) {
    const res = await fetch('/api/admin/iscrizioni', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, stato: nuovoStato, updated_at: new Date().toISOString() }),
    })
    if (res.ok) {
      setIscrizioni(prev => prev.map(i => i.id === id ? { ...i, stato: nuovoStato } : i))
      if (selezionato?.id === id) setSelezionato(prev => ({ ...prev, stato: nuovoStato }))
      setAggiornamento(id)
      setTimeout(() => setAggiornamento(null), 2000)
    }
  }

  async function caricaIfts(t) {
    setLoadingIfts(true)
    const res = await fetch('/api/admin/ifts', { headers: { Authorization: `Bearer ${t}` } })
    if (res.ok) {
      const { candidati, aziende } = await res.json()
      setIftsCandidati(candidati)
      setIftsAziende(aziende)
    }
    setLoadingIfts(false)
  }

  async function aggiornaStatoIfts(id, tipo, nuovoStato) {
    const res = await fetch('/api/admin/ifts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, tipo, stato: nuovoStato }),
    })
    if (res.ok) {
      if (tipo === 'candidato') setIftsCandidati(prev => prev.map(c => c.id === id ? { ...c, stato: nuovoStato } : c))
      else setIftsAziende(prev => prev.map(a => a.id === id ? { ...a, stato: nuovoStato } : a))
      setAggIfts(id)
      setTimeout(() => setAggIfts(null), 2000)
    }
  }

  async function salvaNoteOperatore(id, note) {
    await fetch('/api/admin/iscrizioni', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, note_operatore: note }),
    })
  }

  const iscrizioniFiltrate = useMemo(() => iscrizioni.filter(i => {
    if (filtroTipo !== 'tutti' && (i.tipo || 'formazione') !== filtroTipo) return false
    if (filtroStato !== 'tutti' && i.stato !== filtroStato) return false
    if (filtroGol === 'si' && !i.idoneo_gol) return false
    if (filtroGol === 'no' && i.idoneo_gol) return false
    if (filtroCorso !== 'tutti' && !(i.corsi_interesse || []).includes(filtroCorso)) return false
    if (ricerca) {
      const q = ricerca.toLowerCase()
      if (![i.nome, i.cognome, i.email, i.telefono, i.codice_fiscale].join(' ').toLowerCase().includes(q)) return false
    }
    return true
  }), [iscrizioni, filtroTipo, filtroStato, filtroCorso, filtroGol, ricerca])

  const stats = useMemo(() => ({
    totale: iscrizioniFiltrate.length,
    nuovi: iscrizioniFiltrate.filter(i => i.stato === 'nuovo').length,
    iscritti: iscrizioniFiltrate.filter(i => i.stato === 'iscritto').length,
    gol: iscrizioniFiltrate.filter(i => i.idoneo_gol).length,
  }), [iscrizioniFiltrate])

  function esportaCSV() {
    const header = ['Tipo','Nome','Cognome','Email','Telefono','CF','Status','GOL','Corsi','Sede','Stato','CPI','GOL attivo','Ente GOL','Fonte','CV','Data'].join(',')
    const righe = iscrizioniFiltrate.map(i => [
      i.tipo||'formazione', i.nome||'', i.cognome||'', i.email||'', i.telefono||'', i.codice_fiscale||'',
      i.status||'', i.idoneo_gol?'SI':'NO', (i.corsi_interesse||[]).join('|'),
      (i.sedi_preferite||[]).join('|'), i.stato||'',
      i.iscritto_cpi?'SI':'NO', i.gol_attivo?'SI':'NO', i.ente_gol||'',
      i.come_saputo||'', i.cv_url||'',
      i.created_at ? new Date(i.created_at).toLocaleDateString('it-IT') : ''
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    const csv = [header, ...righe].join('\n')
    const blob = new Blob(['﻿'+csv], { type:'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `iscrizioni_${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const sel = { padding:'8px 12px', border:'1px solid #e2e8f0', borderRadius:'6px', fontSize:'13px', color:'#334155', background:'white', cursor:'pointer', outline:'none' }

  if (!token && !loading) return <LoginScreen onLogin={handleLogin} />
  if (loading && !token) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8' }}>Caricamento...</div>

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* HEADER */}
      <div style={{ background:'#0f172a', color:'white', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
        <div>
          <h1 style={{ fontSize:'18px', fontWeight:'700', margin:0 }}>🎓 Admin — Formazione Como Lago e Valli</h1>
          <p style={{ fontSize:'12px', color:'#94a3b8', margin:'2px 0 0' }}>Gestione iscrizioni e lead</p>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={() => caricaIscrizioni(token)} style={{ background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontSize:'13px' }}>↻ Aggiorna</button>
          <button onClick={esportaCSV} style={{ background:'#f97316', color:'white', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>↓ Esporta CSV</button>
          <button onClick={() => { sessionStorage.removeItem('admin_token'); setToken(null) }} style={{ background:'#374151', color:'#9ca3af', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontSize:'13px' }}>Esci</button>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ background:'white', borderBottom:'2px solid #e2e8f0', padding:'0 24px', display:'flex', gap:'4px' }}>
        {[
          { key:'gol', label:'🎓 GOL / Servizi Lavoro' },
          { key:'ifts', label:'🏭 Percorsi IFTS' },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setTabAttivo(tab.key); if (tab.key==='ifts' && iftsCandidati.length===0) caricaIfts(token) }}
            style={{ padding:'12px 20px', border:'none', borderBottom: tabAttivo===tab.key ? '3px solid #1a2e5a' : '3px solid transparent',
              background:'none', cursor:'pointer', fontSize:'14px', fontWeight: tabAttivo===tab.key ? '700' : '500',
              color: tabAttivo===tab.key ? '#1a2e5a' : '#94a3b8', marginBottom:'-2px', transition:'color 0.2s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding:'24px', maxWidth:'1400px', margin:'0 auto' }}>
        {tabAttivo === 'gol' && <>
        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
          {[
            { label:'Totale contatti', value:stats.totale, color:'#0f172a', emoji:'📋' },
            { label:'Da contattare',   value:stats.nuovi,  color:'#d97706', emoji:'🔔' },
            { label:'Iscritti/Presi in carico', value:stats.iscritti, color:'#059669', emoji:'✅' },
            { label:'Idonei GOL',      value:stats.gol,    color:'#2563eb', emoji:'🎯' },
          ].map((s,i) => (
            <div key={i} style={{ background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', borderLeft:`4px solid ${s.color}` }}>
              <div style={{ fontSize:'24px', marginBottom:'4px' }}>{s.emoji}</div>
              <div style={{ fontSize:'32px', fontWeight:'800', color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'13px', color:'#64748b', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTRI */}
        <div style={{ background:'white', borderRadius:'10px', padding:'16px 20px', marginBottom:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
          <input type="text" placeholder="🔍 Cerca nome, email, telefono, CF..." value={ricerca}
            onChange={e => setRicerca(e.target.value)}
            style={{ flex:'1', minWidth:'200px', padding:'8px 12px', border:'1px solid #e2e8f0', borderRadius:'6px', fontSize:'14px', outline:'none' }} />
          <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setFiltroCorso('tutti') }} style={{ ...sel, fontWeight:'600', borderColor: filtroTipo !== 'tutti' ? '#2563eb' : '#e2e8f0' }}>
            <option value="tutti">Tutti i contatti</option>
            <option value="formazione">Solo formazione</option>
            <option value="servizi_lavoro">Solo servizi lavoro</option>
          </select>
          <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} style={sel}>
            <option value="tutti">Tutti gli stati</option>
            {STATI.map(s => <option key={s} value={s}>{STATO_COLORS[s]?.label||s}</option>)}
          </select>
          {filtroTipo !== 'servizi_lavoro' && (
            <select value={filtroCorso} onChange={e => setFiltroCorso(e.target.value)} style={sel}>
              <option value="tutti">Tutti i corsi</option>
              {Object.entries(CORSI_LABELS).map(([slug,label]) => <option key={slug} value={slug}>{label}</option>)}
            </select>
          )}
          <select value={filtroGol} onChange={e => setFiltroGol(e.target.value)} style={sel}>
            <option value="tutti">GOL: tutti</option>
            <option value="si">Solo idonei GOL</option>
            <option value="no">Solo non idonei</option>
          </select>
          <span style={{ fontSize:'13px', color:'#64748b', whiteSpace:'nowrap' }}>{iscrizioniFiltrate.length} risultati</span>
        </div>

        {/* TABELLA + DETTAGLIO */}
        <div style={{ display:'flex', gap:'20px', alignItems:'flex-start' }}>
          <div style={{ flex:1, background:'white', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', overflow:'hidden', minWidth:0 }}>
            {loading ? (
              <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Caricamento...</div>
            ) : iscrizioniFiltrate.length === 0 ? (
              <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Nessun contatto trovato</div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                      {['Tipo','Nome','Email / Tel','Interesse','Sede','GOL','Stato','Data'].map(h => (
                        <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {iscrizioniFiltrate.map((i,idx) => {
                      const tipo = i.tipo || 'formazione'
                      return (
                        <tr key={i.id} onClick={() => setSelezionato(selezionato?.id===i.id ? null : i)}
                          style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', transition:'background 0.2s',
                            background: selezionato?.id===i.id ? '#eff6ff' : aggiornamento===i.id ? '#f0fdf4' : idx%2===0 ? 'white' : '#fafafa' }}>
                          <td style={{ padding:'10px 14px' }}>
                            <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700',
                              background: tipo==='servizi_lavoro' ? '#ede9fe' : '#e0f2fe',
                              color: tipo==='servizi_lavoro' ? '#5b21b6' : '#0369a1' }}>
                              {tipo==='servizi_lavoro' ? '💼 Lavoro' : '🎓 Corso'}
                            </span>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ fontWeight:'600', fontSize:'14px', color:'#0f172a' }}>{i.nome} {i.cognome}</div>
                            <div style={{ fontSize:'11px', color:'#94a3b8' }}>{i.status}</div>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ fontSize:'13px', color:'#334155' }}>{i.email}</div>
                            <div style={{ fontSize:'13px', color:'#64748b' }}>{i.telefono}</div>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ fontSize:'12px', color:'#334155', maxWidth:'160px' }}>
                              {tipo==='servizi_lavoro'
                                ? <span style={{ color:'#5b21b6' }}>Supporto ricerca lavoro</span>
                                : (i.corsi_interesse||[]).slice(0,2).map(c => <div key={c}>{CORSI_LABELS[c]||c}</div>)
                              }
                              {tipo==='formazione' && (i.corsi_interesse||[]).length > 2 && <div style={{ color:'#94a3b8' }}>+{i.corsi_interesse.length-2} altri</div>}
                            </div>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ fontSize:'12px', color:'#64748b' }}>{(i.sedi_preferite||[]).join(', ') || '—'}</div>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700',
                              background: i.idoneo_gol?'#d1fae5':'#fee2e2', color: i.idoneo_gol?'#065f46':'#991b1b' }}>
                              {i.idoneo_gol?'SÌ':'NO'}
                            </span>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <select value={i.stato||'nuovo'} onClick={e => e.stopPropagation()} onChange={e => aggiornaStato(i.id, e.target.value)}
                              style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'12px', fontWeight:'600', cursor:'pointer', outline:'none',
                                background: STATO_COLORS[i.stato]?.bg||'#f3f4f6', color: STATO_COLORS[i.stato]?.text||'#374151' }}>
                              {STATI.map(s => <option key={s} value={s}>{STATO_COLORS[s]?.label||s}</option>)}
                            </select>
                          </td>
                          <td style={{ padding:'10px 14px' }}>
                            <div style={{ fontSize:'12px', color:'#94a3b8', whiteSpace:'nowrap' }}>
                              {i.created_at ? new Date(i.created_at).toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—'}
                            </div>
                            <div style={{ fontSize:'11px', color:'#cbd5e1' }}>
                              {i.created_at ? new Date(i.created_at).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}) : ''}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PANNELLO DETTAGLIO */}
          {selezionato && (
            <div style={{ width:'320px', flexShrink:0, background:'white', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', padding:'20px', position:'sticky', top:'80px', maxHeight:'calc(100vh - 120px)', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
                <div>
                  <h3 style={{ margin:0, fontSize:'16px', fontWeight:'700', color:'#0f172a' }}>{selezionato.nome} {selezionato.cognome}</h3>
                  <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700', marginTop:'4px', display:'inline-block',
                    background: (selezionato.tipo||'formazione')==='servizi_lavoro' ? '#ede9fe' : '#e0f2fe',
                    color: (selezionato.tipo||'formazione')==='servizi_lavoro' ? '#5b21b6' : '#0369a1' }}>
                    {(selezionato.tipo||'formazione')==='servizi_lavoro' ? '💼 Servizi lavoro' : '🎓 Formazione'}
                  </span>
                </div>
                <button onClick={() => setSelezionato(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'18px', lineHeight:1 }}>×</button>
              </div>

              {[
                { label:'Email', value:selezionato.email },
                { label:'Telefono', value:selezionato.telefono },
                { label:'Codice Fiscale', value:selezionato.codice_fiscale },
                { label:'Data nascita', value:selezionato.data_nascita },
                { label:'Comune residenza', value:selezionato.comune_residenza },
                { label:'Comune domicilio', value:selezionato.comune_domicilio },
                { label:'Indirizzo', value:selezionato.indirizzo },
                { label:'Status lavorativo', value:selezionato.status },
                { label:'Idoneo GOL', value:selezionato.idoneo_gol?'✅ Sì':'❌ No' },
                { label:'Iscritto CPI', value:selezionato.iscritto_cpi?`✅ Sì — ${selezionato.cpi_riferimento||''}`:'❌ No' },
                { label:'GOL attivo', value:selezionato.gol_attivo?`✅ Sì — ${selezionato.ente_gol||''}`:'❌ No' },
                { label:'Interessato alla formazione', value:selezionato.interessato_formazione?'✅ Sì':selezionato.tipo==='servizi_lavoro'?'No':'—' },
                { label:'Sedi preferite', value:(selezionato.sedi_preferite||[]).join(', ') },
                { label:'Online', value:selezionato.modalita_online?'✅ Sì':'No' },
                { label:'Newsletter', value:selezionato.newsletter?'✅ Sì':'No' },
                { label:'Come ci ha trovati', value:selezionato.come_saputo },
              ].map(({ label, value }) => value && value !== '—' && (
                <div key={label} style={{ marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
                  <div style={{ fontSize:'13px', color:'#0f172a', marginTop:'2px' }}>{value}</div>
                </div>
              ))}

              {selezionato.cv_url && (
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>CV allegato</div>
                  <a href={selezionato.cv_url} target="_blank" rel="noopener noreferrer"
                    style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'4px', padding:'6px 12px', background:'#eff6ff', color:'#1d4ed8', borderRadius:'6px', fontSize:'13px', fontWeight:'600', textDecoration:'none' }}>
                    📄 Scarica CV
                  </a>
                </div>
              )}

              {(selezionato.corsi_interesse||[]).length > 0 && (
                <div style={{ marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px' }}>Corsi di interesse</div>
                  {selezionato.corsi_interesse.map((c,idx) => (
                    <div key={c} style={{ fontSize:'12px', padding:'4px 8px', borderRadius:'4px', marginBottom:'4px',
                      background:idx===0?'#eff6ff':'#f8fafc', color:idx===0?'#1d4ed8':'#475569', fontWeight:idx===0?'600':'400' }}>
                      {idx===0?'1° ':`${idx+1}° `}{CORSI_LABELS[c]||c}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop:'16px' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px' }}>Note operatore</div>
                <textarea defaultValue={selezionato.note_operatore||''} rows={3} placeholder="Aggiungi note interne..."
                  onBlur={e => salvaNoteOperatore(selezionato.id, e.target.value)}
                  style={{ width:'100%', padding:'8px', border:'1px solid #e2e8f0', borderRadius:'6px', fontSize:'13px', resize:'vertical', outline:'none', boxSizing:'border-box', color:'#334155' }} />
              </div>
              <div style={{ marginTop:'12px' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'6px' }}>Stato gestione</div>
                <select value={selezionato.stato||'nuovo'} onChange={e => aggiornaStato(selezionato.id, e.target.value)}
                  style={{ width:'100%', padding:'8px 12px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'14px', fontWeight:'600', cursor:'pointer', outline:'none',
                    background:STATO_COLORS[selezionato.stato]?.bg||'#f3f4f6', color:STATO_COLORS[selezionato.stato]?.text||'#374151' }}>
                  {STATI.map(s => <option key={s} value={s}>{STATO_COLORS[s]?.label||s}</option>)}
                </select>
              </div>
              <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid #f1f5f9', fontSize:'11px', color:'#cbd5e1', textAlign:'center' }}>
                Registrato il {selezionato.created_at ? new Date(selezionato.created_at).toLocaleString('it-IT') : '—'}
              </div>
            </div>
          )}
        </div>
        </>}

        {tabAttivo === 'ifts' && (
          <div>
            {/* Sub-tab */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
              {[{ key:'candidati', label:`👤 Candidati (${iftsCandidati.length})` }, { key:'aziende', label:`🏢 Aziende (${iftsAziende.length})` }].map(t => (
                <button key={t.key} onClick={() => setIftsSubTab(t.key)}
                  style={{ padding:'8px 18px', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'600',
                    background: iftsSubTab===t.key ? '#1a2e5a' : '#e2e8f0', color: iftsSubTab===t.key ? 'white' : '#64748b', transition:'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
              <button onClick={() => caricaIfts(token)} style={{ marginLeft:'auto', background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontSize:'13px' }}>↻ Aggiorna</button>
            </div>

            {loadingIfts ? (
              <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Caricamento...</div>
            ) : iftsSubTab === 'candidati' ? (
              <div style={{ background:'white', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', overflow:'hidden' }}>
                {iftsCandidati.length === 0 ? (
                  <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Nessun candidato ancora</div>
                ) : (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                          {['Nome','Email / Tel','Titolo','Indirizzo','Azienda','Stato','Data'].map(h => (
                            <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {iftsCandidati.map((c, idx) => (
                          <tr key={c.id} style={{ borderBottom:'1px solid #f1f5f9', background: aggIfts===c.id ? '#f0fdf4' : idx%2===0 ? 'white' : '#fafafa' }}>
                            <td style={{ padding:'10px 14px' }}>
                              <div style={{ fontWeight:'600', fontSize:'14px', color:'#0f172a' }}>{c.nome} {c.cognome}</div>
                            </td>
                            <td style={{ padding:'10px 14px' }}>
                              <div style={{ fontSize:'13px', color:'#334155' }}>{c.email}</div>
                              <div style={{ fontSize:'13px', color:'#64748b' }}>{c.telefono}</div>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'12px', color:'#475569' }}>
                              {c.titolo_studio === 'diploma' ? 'Diploma' : c.titolo_studio === 'qualifica_professionale' ? 'Qualifica prof.' : c.titolo_studio || '—'}
                              {c.anno_titolo && <div style={{ color:'#94a3b8' }}>{c.anno_titolo}</div>}
                            </td>
                            <td style={{ padding:'10px 14px' }}>
                              <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700',
                                background: c.indirizzo_interesse==='moda'?'#fce7f3':c.indirizzo_interesse==='amministrativo'?'#dbeafe':'#f3f4f6',
                                color: c.indirizzo_interesse==='moda'?'#9d174d':c.indirizzo_interesse==='amministrativo'?'#1e40af':'#374151' }}>
                                {c.indirizzo_interesse==='moda'?'👗 Moda':c.indirizzo_interesse==='amministrativo'?'📋 Amm.':'?'}
                              </span>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'12px', color:'#64748b' }}>
                              {c.ha_azienda ? <span style={{ color:'#059669' }}>✅ {c.nome_azienda||'Sì'}</span> : '—'}
                            </td>
                            <td style={{ padding:'10px 14px' }}>
                              <select value={c.stato||'nuovo'} onChange={e => aggiornaStatoIfts(c.id,'candidato',e.target.value)}
                                style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'12px', fontWeight:'600', cursor:'pointer', outline:'none',
                                  background:STATO_COLORS[c.stato]?.bg||'#f3f4f6', color:STATO_COLORS[c.stato]?.text||'#374151' }}>
                                {STATI.map(s => <option key={s} value={s}>{STATO_COLORS[s]?.label||s}</option>)}
                              </select>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8', whiteSpace:'nowrap' }}>
                              {c.created_at ? new Date(c.created_at).toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background:'white', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', overflow:'hidden' }}>
                {iftsAziende.length === 0 ? (
                  <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Nessuna azienda ancora</div>
                ) : (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                          {['Azienda','Referente','Email / Tel','Settore','Tipo','Indirizzi','Giovani','Stato','Data'].map(h => (
                            <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {iftsAziende.map((a, idx) => (
                          <tr key={a.id} style={{ borderBottom:'1px solid #f1f5f9', background: aggIfts===a.id ? '#f0fdf4' : idx%2===0 ? 'white' : '#fafafa' }}>
                            <td style={{ padding:'10px 14px' }}>
                              <div style={{ fontWeight:'600', fontSize:'14px', color:'#0f172a' }}>{a.ragione_sociale}</div>
                              {a.piva && <div style={{ fontSize:'11px', color:'#94a3b8' }}>P.IVA {a.piva}</div>}
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'13px', color:'#334155' }}>
                              {a.referente_nome} {a.referente_cognome}
                              {a.referente_ruolo && <div style={{ fontSize:'11px', color:'#94a3b8' }}>{a.referente_ruolo}</div>}
                            </td>
                            <td style={{ padding:'10px 14px' }}>
                              <div style={{ fontSize:'13px', color:'#334155' }}>{a.referente_email}</div>
                              <div style={{ fontSize:'13px', color:'#64748b' }}>{a.referente_telefono}</div>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'12px', color:'#64748b' }}>{a.settore||'—'}</td>
                            <td style={{ padding:'10px 14px' }}>
                              <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700',
                                background: a.tipo_interesse==='academy'?'#fef3c7':a.tipo_interesse==='singolo'?'#dbeafe':'#f3e8ff',
                                color: a.tipo_interesse==='academy'?'#92400e':a.tipo_interesse==='singolo'?'#1e40af':'#6b21a8' }}>
                                {a.tipo_interesse==='academy'?'Academy':a.tipo_interesse==='singolo'?'Singolo':a.tipo_interesse||'—'}
                              </span>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'12px', color:'#475569' }}>
                              {(a.indirizzi_interesse||[]).join(', ')||'—'}
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'13px', color:'#334155', textAlign:'center' }}>
                              {a.n_giovani_previsti||'—'}
                            </td>
                            <td style={{ padding:'10px 14px' }}>
                              <select value={a.stato||'nuovo'} onChange={e => aggiornaStatoIfts(a.id,'azienda',e.target.value)}
                                style={{ padding:'4px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', fontSize:'12px', fontWeight:'600', cursor:'pointer', outline:'none',
                                  background:STATO_COLORS[a.stato]?.bg||'#f3f4f6', color:STATO_COLORS[a.stato]?.text||'#374151' }}>
                                {STATI.map(s => <option key={s} value={s}>{STATO_COLORS[s]?.label||s}</option>)}
                              </select>
                            </td>
                            <td style={{ padding:'10px 14px', fontSize:'12px', color:'#94a3b8', whiteSpace:'nowrap' }}>
                              {a.created_at ? new Date(a.created_at).toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
