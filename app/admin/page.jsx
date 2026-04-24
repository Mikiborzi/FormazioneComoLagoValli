'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../lib/supabase'

const supabase = createClient()

const PASSWORD_ADMIN = 'formazione2026'
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
  const [errore, setErrore] = useState(false)
  function handleSubmit(e) {
    e.preventDefault()
    if (pwd === PASSWORD_ADMIN) { onLogin() }
    else { setErrore(true); setPwd('') }
  }
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a,#1e293b)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'white', borderRadius:'12px', padding:'48px', width:'100%', maxWidth:'400px', boxShadow:'0 25px 50px rgba(0,0,0,0.4)', textAlign:'center' }}>
        <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔐</div>
        <h1 style={{ fontSize:'22px', fontWeight:'700', color:'#0f172a', marginBottom:'8px' }}>Area Admin</h1>
        <p style={{ color:'#64748b', fontSize:'14px', marginBottom:'32px' }}>Formazione Como Lago e Valli</p>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Password" value={pwd}
            onChange={e => { setPwd(e.target.value); setErrore(false) }} autoFocus
            style={{ width:'100%', padding:'12px 16px', border: errore ? '2px solid #ef4444' : '2px solid #e2e8f0', borderRadius:'8px', fontSize:'16px', outline:'none', marginBottom:'8px', boxSizing:'border-box' }} />
          {errore && <p style={{ color:'#ef4444', fontSize:'13px', marginBottom:'16px', textAlign:'left' }}>Password non corretta</p>}
          <button type="submit" style={{ width:'100%', padding:'12px', background:'#0f172a', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:'pointer', marginTop:'8px' }}>Accedi</button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [autenticato, setAutenticato] = useState(false)
  const [iscrizioni, setIscrizioni] = useState([])
  const [loading, setLoading] = useState(true)
  const [aggiornamento, setAggiornamento] = useState(null)
  const [filtroStato, setFiltroStato] = useState('tutti')
  const [filtroCorso, setFiltroCorso] = useState('tutti')
  const [filtroGol, setFiltroGol] = useState('tutti')
  const [ricerca, setRicerca] = useState('')
  const [selezionato, setSelezionato] = useState(null)

  useEffect(() => { if (autenticato) caricaIscrizioni() }, [autenticato])

  async function caricaIscrizioni() {
    setLoading(true)
    const { data, error } = await supabase.from('iscrizioni').select('*').order('created_at', { ascending: false })
    if (error) console.error('Errore:', error)
    else setIscrizioni(data || [])
    setLoading(false)
  }

  async function aggiornaStato(id, nuovoStato) {
    const { error } = await supabase.from('iscrizioni').update({ stato: nuovoStato, updated_at: new Date().toISOString() }).eq('id', id)
    if (!error) {
      setIscrizioni(prev => prev.map(i => i.id === id ? { ...i, stato: nuovoStato } : i))
      if (selezionato?.id === id) setSelezionato(prev => ({ ...prev, stato: nuovoStato }))
      setAggiornamento(id)
      setTimeout(() => setAggiornamento(null), 2000)
    }
  }

  const iscrizioniFiltrate = useMemo(() => iscrizioni.filter(i => {
    if (filtroStato !== 'tutti' && i.stato !== filtroStato) return false
    if (filtroGol === 'si' && !i.idoneo_gol) return false
    if (filtroGol === 'no' && i.idoneo_gol) return false
    if (filtroCorso !== 'tutti' && !(i.corsi_interesse || []).includes(filtroCorso)) return false
    if (ricerca) {
      const q = ricerca.toLowerCase()
      if (![i.nome, i.cognome, i.email, i.telefono, i.codice_fiscale].join(' ').toLowerCase().includes(q)) return false
    }
    return true
  }), [iscrizioni, filtroStato, filtroCorso, filtroGol, ricerca])

  const stats = useMemo(() => ({
    totale: iscrizioni.length,
    nuovi: iscrizioni.filter(i => i.stato === 'nuovo').length,
    iscritti: iscrizioni.filter(i => i.stato === 'iscritto').length,
    gol: iscrizioni.filter(i => i.idoneo_gol).length,
  }), [iscrizioni])

  function esportaCSV() {
    const header = ['Nome','Cognome','Email','Telefono','CF','Status','GOL','Corsi','Sede','Stato','CPI','GOL attivo','Ente GOL','Data'].join(',')
    const righe = iscrizioniFiltrate.map(i => [
      i.nome||'', i.cognome||'', i.email||'', i.telefono||'', i.codice_fiscale||'',
      i.status||'', i.idoneo_gol?'SI':'NO', (i.corsi_interesse||[]).join('|'),
      (i.sedi_preferite||[]).join('|'), i.stato||'',
      i.iscritto_cpi?'SI':'NO', i.gol_attivo?'SI':'NO', i.ente_gol||'',
      i.created_at ? new Date(i.created_at).toLocaleDateString('it-IT') : ''
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    const csv = [header, ...righe].join('\n')
    const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `iscrizioni_${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const sel = { padding:'8px 12px', border:'1px solid #e2e8f0', borderRadius:'6px', fontSize:'13px', color:'#334155', background:'white', cursor:'pointer', outline:'none' }

  if (!autenticato) return <LoginScreen onLogin={() => setAutenticato(true)} />

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* HEADER */}
      <div style={{ background:'#0f172a', color:'white', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
        <div>
          <h1 style={{ fontSize:'18px', fontWeight:'700', margin:0 }}>🎓 Admin — Formazione Como Lago e Valli</h1>
          <p style={{ fontSize:'12px', color:'#94a3b8', margin:'2px 0 0' }}>Gestione iscrizioni e lead</p>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={caricaIscrizioni} style={{ background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontSize:'13px' }}>↻ Aggiorna</button>
          <button onClick={esportaCSV} style={{ background:'#f97316', color:'white', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>↓ Esporta CSV</button>
        </div>
      </div>

      <div style={{ padding:'24px', maxWidth:'1400px', margin:'0 auto' }}>
        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }}>
          {[
            { label:'Totale iscrizioni', value:stats.totale, color:'#0f172a', emoji:'📋' },
            { label:'Da contattare',     value:stats.nuovi,   color:'#d97706', emoji:'🔔' },
            { label:'Iscritti confermati', value:stats.iscritti, color:'#059669', emoji:'✅' },
            { label:'Idonei GOL',        value:stats.gol,     color:'#2563eb', emoji:'🎯' },
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
          <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} style={sel}>
            <option value="tutti">Tutti gli stati</option>
            {STATI.map(s => <option key={s} value={s}>{STATO_COLORS[s]?.label||s}</option>)}
          </select>
          <select value={filtroCorso} onChange={e => setFiltroCorso(e.target.value)} style={sel}>
            <option value="tutti">Tutti i corsi</option>
            {Object.entries(CORSI_LABELS).map(([slug,label]) => <option key={slug} value={slug}>{label}</option>)}
          </select>
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
              <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Caricamento iscrizioni...</div>
            ) : iscrizioniFiltrate.length === 0 ? (
              <div style={{ padding:'60px', textAlign:'center', color:'#94a3b8' }}>Nessuna iscrizione trovata</div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e2e8f0' }}>
                      {['Nome','Email / Tel','Corso','Sede','GOL','Stato','Data'].map(h => (
                        <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {iscrizioniFiltrate.map((i,idx) => (
                      <tr key={i.id} onClick={() => setSelezionato(selezionato?.id===i.id ? null : i)}
                        style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', transition:'background 0.2s',
                          background: selezionato?.id===i.id ? '#eff6ff' : aggiornamento===i.id ? '#f0fdf4' : idx%2===0 ? 'white' : '#fafafa' }}>
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
                            {(i.corsi_interesse||[]).slice(0,2).map(c => <div key={c}>{CORSI_LABELS[c]||c}</div>)}
                            {(i.corsi_interesse||[]).length > 2 && <div style={{ color:'#94a3b8' }}>+{i.corsi_interesse.length-2} altri</div>}
                          </div>
                        </td>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ fontSize:'12px', color:'#64748b' }}>{(i.sedi_preferite||[]).join(', ')}</div>
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PANNELLO DETTAGLIO */}
          {selezionato && (
            <div style={{ width:'320px', flexShrink:0, background:'white', borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', padding:'20px', position:'sticky', top:'80px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
                <h3 style={{ margin:0, fontSize:'16px', fontWeight:'700', color:'#0f172a' }}>{selezionato.nome} {selezionato.cognome}</h3>
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
                { label:'Sedi preferite', value:(selezionato.sedi_preferite||[]).join(', ') },
                { label:'Online', value:selezionato.modalita_online?'✅ Sì':'No' },
                { label:'Newsletter', value:selezionato.newsletter?'✅ Sì':'No' },
                { label:'Come ci ha trovati', value:selezionato.come_saputo },
              ].map(({ label, value }) => value && (
                <div key={label} style={{ marginBottom:'10px' }}>
                  <div style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
                  <div style={{ fontSize:'13px', color:'#0f172a', marginTop:'2px' }}>{value}</div>
                </div>
              ))}
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
                  onBlur={async e => { await supabase.from('iscrizioni').update({ note_operatore: e.target.value }).eq('id', selezionato.id) }}
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
                Iscritto il {selezionato.created_at ? new Date(selezionato.created_at).toLocaleString('it-IT') : '—'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
