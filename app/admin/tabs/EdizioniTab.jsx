'use client'

import { useEffect, useState } from 'react'
import { generaIncontriRicorrenti, normalizzaSede } from '@/app/lib/edizioni'

const GIORNI_SETTIMANA = [
  { valore: 1, label: 'Lun' },
  { valore: 2, label: 'Mar' },
  { valore: 3, label: 'Mer' },
  { valore: 4, label: 'Gio' },
  { valore: 5, label: 'Ven' },
  { valore: 6, label: 'Sab' },
  { valore: 0, label: 'Dom' },
]

const STATO_EDIZIONE_COLORS = {
  pianificata: { bg: '#DBEAFE', text: '#1E40AF', label: 'Pianificata' },
  avviata:     { bg: '#D1FAE5', text: '#065F46', label: 'Avviata' },
  conclusa:    { bg: '#F3F4F6', text: '#374151', label: 'Conclusa' },
  annullata:   { bg: '#FEE2E2', text: '#991B1B', label: 'Annullata' },
}

const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }

function nuovaEdizioneVuota() {
  return { corso_id: '', nome: '', data_inizio: '', data_fine: '', sede: '', posti_max: 10, stato: 'pianificata', note: '', calendario: [] }
}

export default function EdizioniTab({ token }) {
  const [corsi, setCorsi] = useState([])
  const [edizioni, setEdizioni] = useState([])
  const [partecipanti, setPartecipanti] = useState([]) // flat: { id, nome, cognome, edizione_id, ragione_sociale }
  const [uditori, setUditori] = useState([])
  const [loading, setLoading] = useState(true)
  const [espansa, setEspansa] = useState(null)
  const [formNuovoCorso, setFormNuovoCorso] = useState(false)
  const [nuovoCorso, setNuovoCorso] = useState({ nome: '', codice_catalogo: '', costo_partecipante: '', ore_totali: '' })
  const [formNuovaEdizione, setFormNuovaEdizione] = useState(false)
  const [nuovaEdizione, setNuovaEdizione] = useState(nuovaEdizioneVuota())
  const [conflitti, setConflitti] = useState([])
  const [uditoreForm, setUditoreForm] = useState({}) // per edizione id: { nome, cognome, email, telefono }
  const [salvando, setSalvando] = useState(false)
  const [ricorrenza, setRicorrenza] = useState({ giorni: [], oraInizio: '', oraFine: '' })

  const sediEsistenti = [...new Set(edizioni.map((e) => e.sede).filter(Boolean))]

  async function caricaTutto() {
    setLoading(true)
    const [corsiRes, edizioniRes, voucherRes, uditoriRes] = await Promise.all([
      fetch('/api/admin/corsi', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/admin/edizioni', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/admin/voucher', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/admin/edizioni/uditori', { headers: { Authorization: `Bearer ${token}` } }),
    ])
    if (corsiRes.ok) setCorsi((await corsiRes.json()).corsi || [])
    if (edizioniRes.ok) setEdizioni((await edizioniRes.json()).edizioni || [])
    if (uditoriRes.ok) setUditori((await uditoriRes.json()).uditori || [])
    if (voucherRes.ok) {
      const { aziende } = await voucherRes.json()
      const flat = []
      for (const a of aziende || []) {
        for (const p of a.partecipanti || []) {
          flat.push({ ...p, ragione_sociale: a.ragione_sociale })
        }
      }
      setPartecipanti(flat)
    }
    setLoading(false)
  }

  useEffect(() => { caricaTutto() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function creaCorso(e) {
    e.preventDefault()
    if (!nuovoCorso.nome.trim()) return
    setSalvando(true)
    const res = await fetch('/api/admin/corsi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        nome: nuovoCorso.nome,
        codice_catalogo: nuovoCorso.codice_catalogo || undefined,
        costo_partecipante: nuovoCorso.costo_partecipante ? Number(nuovoCorso.costo_partecipante) : undefined,
        ore_totali: nuovoCorso.ore_totali ? Number(nuovoCorso.ore_totali) : undefined,
      }),
    })
    if (res.ok) {
      setNuovoCorso({ nome: '', codice_catalogo: '', costo_partecipante: '', ore_totali: '' })
      setFormNuovoCorso(false)
      await caricaTutto()
    }
    setSalvando(false)
  }

  function aggiungiIncontro() {
    setNuovaEdizione((prev) => ({ ...prev, calendario: [...prev.calendario, { data: '', ora_inizio: '', ora_fine: '' }] }))
  }
  function aggiornaIncontro(i, campo, valore) {
    setNuovaEdizione((prev) => {
      const calendario = [...prev.calendario]
      calendario[i] = { ...calendario[i], [campo]: valore }
      return { ...prev, calendario }
    })
  }
  function rimuoviIncontro(i) {
    setNuovaEdizione((prev) => ({ ...prev, calendario: prev.calendario.filter((_, idx) => idx !== i) }))
  }

  function toggleGiornoRicorrenza(valore) {
    setRicorrenza((prev) => ({
      ...prev,
      giorni: prev.giorni.includes(valore) ? prev.giorni.filter((g) => g !== valore) : [...prev.giorni, valore],
    }))
  }

  function generaCalendario() {
    const incontri = generaIncontriRicorrenti({
      giorni: ricorrenza.giorni,
      oraInizio: ricorrenza.oraInizio,
      oraFine: ricorrenza.oraFine,
      dataInizio: nuovaEdizione.data_inizio,
      dataFine: nuovaEdizione.data_fine,
    })
    setNuovaEdizione((prev) => ({ ...prev, calendario: incontri }))
  }

  async function creaEdizione(e) {
    e.preventDefault()
    if (!nuovaEdizione.corso_id) return
    setSalvando(true)
    setConflitti([])
    const res = await fetch('/api/admin/edizioni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...nuovaEdizione, posti_max: Number(nuovaEdizione.posti_max) || 10 }),
    })
    const dati = await res.json()
    if (res.ok) {
      if (dati.conflitti?.length) setConflitti(dati.conflitti)
      setNuovaEdizione(nuovaEdizioneVuota())
      setFormNuovaEdizione(false)
      await caricaTutto()
    }
    setSalvando(false)
  }

  async function cambiaStatoEdizione(id, stato) {
    const res = await fetch('/api/admin/edizioni', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, stato }),
    })
    if (res.status === 409) {
      const dati = await res.json()
      if (window.confirm(`${dati.error}\n\nConfermi comunque l'annullamento?`)) {
        await fetch('/api/admin/edizioni', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id, stato, conferma_annullamento: true }),
        })
        await caricaTutto()
      }
      return
    }
    await caricaTutto()
  }

  async function rinominaEdizione(id, nome) {
    setEdizioni((prev) => prev.map((ed) => (ed.id === id ? { ...ed, nome } : ed)))
    await fetch('/api/admin/edizioni', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, nome }),
    })
  }

  async function aggiungiUditore(edizioneId) {
    const f = uditoreForm[edizioneId]
    if (!f?.nome || !f?.cognome) return
    await fetch('/api/admin/edizioni/uditori', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ edizione_id: edizioneId, ...f }),
    })
    setUditoreForm((prev) => ({ ...prev, [edizioneId]: { nome: '', cognome: '', email: '', telefono: '' } }))
    await caricaTutto()
  }

  async function rimuoviUditore(id) {
    await fetch('/api/admin/edizioni/uditori', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    await caricaTutto()
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Caricamento…</div>

  return (
    <div>
      {/* Corsi a catalogo */}
      <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: formNuovoCorso ? '14px' : 0 }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
            📖 Corsi a catalogo ({corsi.length}): {corsi.map((c) => c.nome).join(', ') || '—'}
          </span>
          <button onClick={() => setFormNuovoCorso((v) => !v)}
            style={{ background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
            {formNuovoCorso ? 'Annulla' : '+ Nuovo corso'}
          </button>
        </div>
        {formNuovoCorso && (
          <form onSubmit={creaCorso} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto', gap: '10px', alignItems: 'end' }}>
            <div><label style={labelStyle}>Nome corso</label><input required style={inputStyle} value={nuovoCorso.nome} onChange={(e) => setNuovoCorso({ ...nuovoCorso, nome: e.target.value })} /></div>
            <div><label style={labelStyle}>Codice catalogo</label><input style={inputStyle} value={nuovoCorso.codice_catalogo} onChange={(e) => setNuovoCorso({ ...nuovoCorso, codice_catalogo: e.target.value })} /></div>
            <div><label style={labelStyle}>Costo/partecipante €</label><input type="number" step="0.01" style={inputStyle} value={nuovoCorso.costo_partecipante} onChange={(e) => setNuovoCorso({ ...nuovoCorso, costo_partecipante: e.target.value })} /></div>
            <div><label style={labelStyle}>Ore totali</label><input type="number" style={inputStyle} value={nuovoCorso.ore_totali} onChange={(e) => setNuovoCorso({ ...nuovoCorso, ore_totali: e.target.value })} /></div>
            <button type="submit" disabled={salvando} style={{ background: '#166534', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', height: '36px' }}>Salva</button>
          </form>
        )}
      </div>

      {conflitti.length > 0 && (
        <div style={{ background: '#FEF3C7', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400E' }}>
          <div style={{ fontWeight: '700', marginBottom: '6px' }}>⚠️ Sovrapposizione di sede e orario con {conflitti.length} edizione/i esistente/i:</div>
          {conflitti.map((c) => (
            <div key={c.id}>— {c.sede}, {c.data_inizio || '—'} → {c.data_fine || '—'} (stato: {c.stato})</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>📚 Edizioni ({edizioni.length})</span>
        <button onClick={() => setFormNuovaEdizione((v) => !v)}
          style={{ background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
          {formNuovaEdizione ? 'Annulla' : '+ Nuova edizione'}
        </button>
      </div>

      {formNuovaEdizione && (
        <form onSubmit={creaEdizione} style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Corso</label>
              <select required style={inputStyle} value={nuovaEdizione.corso_id} onChange={(e) => setNuovaEdizione({ ...nuovaEdizione, corso_id: e.target.value })}>
                <option value="">Seleziona…</option>
                {corsi.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Nome edizione</label><input style={inputStyle} value={nuovaEdizione.nome} onChange={(e) => setNuovaEdizione({ ...nuovaEdizione, nome: e.target.value })} placeholder="Edizione autunno 2026" /></div>
            <div>
              <label style={labelStyle}>Sede</label>
              <input style={inputStyle} list="sedi-esistenti" value={nuovaEdizione.sede}
                onChange={(e) => setNuovaEdizione({ ...nuovaEdizione, sede: e.target.value })}
                placeholder="Como - sede (o scrivine una nuova)" />
              <datalist id="sedi-esistenti">
                {sediEsistenti.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div><label style={labelStyle}>Data inizio</label><input type="date" style={inputStyle} value={nuovaEdizione.data_inizio} onChange={(e) => setNuovaEdizione({ ...nuovaEdizione, data_inizio: e.target.value })} /></div>
            <div><label style={labelStyle}>Data fine</label><input type="date" style={inputStyle} value={nuovaEdizione.data_fine} onChange={(e) => setNuovaEdizione({ ...nuovaEdizione, data_fine: e.target.value })} /></div>
            <div><label style={labelStyle}>Posti max</label><input type="number" style={inputStyle} value={nuovaEdizione.posti_max} onChange={(e) => setNuovaEdizione({ ...nuovaEdizione, posti_max: e.target.value })} /></div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
            <label style={labelStyle}>Genera calendario ricorrente</label>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px' }}>
              Es. "tutti i martedì e giovedì dalle 14 alle 18" — usa le date inizio/fine impostate sopra come intervallo.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {GIORNI_SETTIMANA.map((g) => (
                <button key={g.valore} type="button" onClick={() => toggleGiornoRicorrenza(g.valore)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    border: ricorrenza.giorni.includes(g.valore) ? '1px solid #1e3a8a' : '1px solid #e2e8f0',
                    background: ricorrenza.giorni.includes(g.valore) ? '#dbeafe' : 'white',
                    color: ricorrenza.giorni.includes(g.valore) ? '#1e3a8a' : '#64748b',
                  }}>
                  {g.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <div><label style={labelStyle}>Dalle</label><input type="time" style={inputStyle} value={ricorrenza.oraInizio} onChange={(e) => setRicorrenza({ ...ricorrenza, oraInizio: e.target.value })} /></div>
              <div><label style={labelStyle}>Alle</label><input type="time" style={inputStyle} value={ricorrenza.oraFine} onChange={(e) => setRicorrenza({ ...ricorrenza, oraFine: e.target.value })} /></div>
              <button type="button" onClick={generaCalendario}
                disabled={!ricorrenza.giorni.length || !ricorrenza.oraInizio || !ricorrenza.oraFine || !nuovaEdizione.data_inizio || !nuovaEdizione.data_fine}
                style={{ background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', height: '36px' }}>
                Genera calendario
              </button>
            </div>
          </div>

          <label style={labelStyle}>Calendario incontri {nuovaEdizione.calendario.length > 0 ? `(${nuovaEdizione.calendario.length})` : ''}</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {nuovaEdizione.calendario.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px' }}>
                <input type="date" style={inputStyle} value={s.data} onChange={(e) => aggiornaIncontro(i, 'data', e.target.value)} />
                <input type="time" style={inputStyle} value={s.ora_inizio} onChange={(e) => aggiornaIncontro(i, 'ora_inizio', e.target.value)} />
                <input type="time" style={inputStyle} value={s.ora_fine} onChange={(e) => aggiornaIncontro(i, 'ora_fine', e.target.value)} />
                <button type="button" onClick={() => rimuoviIncontro(i)} style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={aggiungiIncontro} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', marginBottom: '14px' }}>
            + Aggiungi incontro
          </button>

          <div>
            <button type="submit" disabled={salvando} style={{ background: '#166534', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Crea edizione
            </button>
          </div>
        </form>
      )}

      {edizioni.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Nessuna edizione creata.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {edizioni.map((ed) => {
            const aperta = espansa === ed.id
            const iscritti = partecipanti.filter((p) => p.edizione_id === ed.id)
            const colori = STATO_EDIZIONE_COLORS[ed.stato] || STATO_EDIZIONE_COLORS.pianificata
            const uf = uditoreForm[ed.id] || { nome: '', cognome: '', email: '', telefono: '' }
            return (
              <div key={ed.id} style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div onClick={() => setEspansa(aperta ? null : ed.id)}
                  style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', flexWrap: 'wrap' }}>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{aperta ? '▾' : '▸'}</span>
                  <div style={{ minWidth: '200px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>{ed.corsi?.nome}</div>
                    <input
                      defaultValue={ed.nome || ''}
                      placeholder="Nome edizione (es. autunno 2026)"
                      onBlur={(e) => { if (e.target.value !== (ed.nome || '')) rinominaEdizione(ed.id, e.target.value) }}
                      style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a', border: '1px solid transparent', borderRadius: '5px', padding: '3px 6px', background: 'transparent', width: '100%', outline: 'none' }}
                      onFocus={(e) => { e.target.style.border = '1px solid #93c5fd'; e.target.style.background = 'white' }}
                      onMouseEnter={(e) => { if (document.activeElement !== e.target) e.target.style.border = '1px solid #e2e8f0' }}
                      onMouseLeave={(e) => { if (document.activeElement !== e.target) e.target.style.border = '1px solid transparent' }}
                    />
                    <div style={{ fontSize: '11px', color: '#94a3b8', padding: '0 6px' }}>{ed.sede || 'sede da definire'}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{ed.data_inizio || '—'} → {ed.data_fine || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '700' }}>{ed.numero_iscritti}/{ed.posti_max} iscritti</div>
                  {ed.numero_uditori > 0 && <div style={{ fontSize: '12px', color: '#64748b' }}>+{ed.numero_uditori} uditori</div>}
                  <select value={ed.stato} onClick={(e) => e.stopPropagation()} onChange={(e) => cambiaStatoEdizione(ed.id, e.target.value)}
                    style={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: colori.bg, color: colori.text }}>
                    {Object.keys(STATO_EDIZIONE_COLORS).map((s) => <option key={s} value={s}>{STATO_EDIZIONE_COLORS[s].label}</option>)}
                  </select>
                </div>

                {aperta && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 18px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Iscritti ({iscritti.length})</div>
                    {iscritti.length === 0 ? (
                      <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>Nessun partecipante assegnato — assegnali dal tab Voucher.</div>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {iscritti.map((p) => (
                          <li key={p.id} style={{ fontSize: '13px', color: '#334155' }}>
                            {p.nome} {p.cognome} <span style={{ color: '#94a3b8' }}>— {p.ragione_sociale}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Uditori</div>
                    {(() => {
                      const uditoriEdizione = uditori.filter((u) => u.edizione_id === ed.id)
                      if (uditoriEdizione.length === 0) {
                        return <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>Nessun uditore.</div>
                      }
                      return (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {uditoriEdizione.map((u) => (
                            <li key={u.id} style={{ fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {u.nome} {u.cognome}
                              {u.email && <span style={{ color: '#94a3b8' }}>· {u.email}</span>}
                              {u.telefono && <span style={{ color: '#94a3b8' }}>· {u.telefono}</span>}
                              <button type="button" onClick={() => rimuoviUditore(u.id)}
                                style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontSize: '12px' }}>✕ rimuovi</button>
                            </li>
                          ))}
                        </ul>
                      )
                    })()}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto', gap: '8px' }}>
                      <input placeholder="Nome" style={inputStyle} value={uf.nome} onChange={(e) => setUditoreForm({ ...uditoreForm, [ed.id]: { ...uf, nome: e.target.value } })} />
                      <input placeholder="Cognome" style={inputStyle} value={uf.cognome} onChange={(e) => setUditoreForm({ ...uditoreForm, [ed.id]: { ...uf, cognome: e.target.value } })} />
                      <input placeholder="Email" style={inputStyle} value={uf.email} onChange={(e) => setUditoreForm({ ...uditoreForm, [ed.id]: { ...uf, email: e.target.value } })} />
                      <input placeholder="Telefono" style={inputStyle} value={uf.telefono} onChange={(e) => setUditoreForm({ ...uditoreForm, [ed.id]: { ...uf, telefono: e.target.value } })} />
                      <button type="button" onClick={() => aggiungiUditore(ed.id)} style={{ background: '#166534', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>+ Aggiungi</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
