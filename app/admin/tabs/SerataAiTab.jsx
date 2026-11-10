'use client'

import { useEffect, useState } from 'react'
import { INTERESSI_SERATA, SERATA_AI } from '@/app/lib/serataAi'

const STATI = {
  nuovo:      { bg: '#DBEAFE', text: '#1E40AF', label: 'Nuovo' },
  confermato: { bg: '#D1FAE5', text: '#065F46', label: 'Confermato' },
  presente:   { bg: '#FEF3C7', text: '#92400E', label: 'Presente' },
  assente:    { bg: '#F3F4F6', text: '#374151', label: 'Assente' },
  annullato:  { bg: '#FEE2E2', text: '#991B1B', label: 'Annullato' },
}

const ETICHETTA_INTERESSE = Object.fromEntries(INTERESSI_SERATA.map((i) => [i.key, i.label]))

function formattaData(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function csvCella(v) {
  const s = String(v ?? '')
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// Tab admin "Serata AI Academy": elenco iscritti alla serata di presentazione,
// con cambio stato, note e export CSV. Fa le proprie fetch (come EdizioniTab).
export default function SerataAiTab({ token }) {
  const [iscrizioni, setIscrizioni] = useState([])
  const [loading, setLoading] = useState(true)
  const [errore, setErrore] = useState('')
  const [filtroEvento, setFiltroEvento] = useState('tutti')
  const [filtroStato, setFiltroStato] = useState('attivi')
  const [ricerca, setRicerca] = useState('')
  const [espansa, setEspansa] = useState(null)
  const [note, setNote] = useState({})

  async function carica() {
    setLoading(true)
    setErrore('')
    try {
      const res = await fetch('/api/admin/serata-ai', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore di caricamento')
      setIscrizioni(data.iscrizioni)
    } catch (e) {
      setErrore(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carica() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function salva(id, update) {
    const res = await fetch('/api/admin/serata-ai', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...update }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'Salvataggio non riuscito')
      return
    }
    setIscrizioni((lista) => lista.map((r) => (r.id === id ? { ...r, ...update } : r)))
  }

  const eventi = [...new Set(iscrizioni.map((r) => r.evento))]
  const filtrate = iscrizioni.filter((r) => {
    if (filtroEvento !== 'tutti' && r.evento !== filtroEvento) return false
    if (filtroStato === 'attivi' && r.stato === 'annullato') return false
    if (filtroStato !== 'attivi' && filtroStato !== 'tutti' && r.stato !== filtroStato) return false
    if (ricerca) {
      const q = ricerca.toLowerCase()
      const testo = [r.nome, r.cognome, r.email, r.telefono, r.azienda, r.ruolo].join(' ').toLowerCase()
      if (!testo.includes(q)) return false
    }
    return true
  })
  const totalePersone = filtrate.reduce((somma, r) => somma + (r.num_persone || 1), 0)
  // Posti occupati della serata in corso: stesso calcolo del server
  // (somma di num_persone, escluse le iscrizioni annullate), senza filtri.
  const postiOccupati = iscrizioni
    .filter((r) => r.evento === SERATA_AI.slug && r.stato !== 'annullato')
    .reduce((somma, r) => somma + (r.num_persone || 0), 0)
  const consensiMarketing = filtrate.filter((r) => r.consenso_marketing).length

  function esportaCsv() {
    const intestazioni = ['Data iscrizione', 'Evento', 'Nome', 'Cognome', 'Email', 'Telefono', 'Azienda', 'Ruolo', 'Persone', 'Interessi', 'Messaggio', 'Consenso marketing', 'Stato', 'Note']
    const righe = filtrate.map((r) => [
      formattaData(r.created_at), r.evento, r.nome, r.cognome, r.email, r.telefono, r.azienda, r.ruolo, r.num_persone,
      (r.interessi || '').split(',').filter(Boolean).map((k) => ETICHETTA_INTERESSE[k] || k).join(' | '),
      r.messaggio, r.consenso_marketing ? 'Sì' : 'No', r.stato, r.note_operatore,
    ])
    const csv = [intestazioni, ...righe].map((riga) => riga.map(csvCella).join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iscritti-serata-ai-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const cella = { padding: '10px 14px', fontSize: '13px', color: '#334155', verticalAlign: 'top' }

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="text" placeholder="🔍 Cerca nome, email, azienda…" value={ricerca} onChange={(e) => setRicerca(e.target.value)}
          style={{ flex: '1', minWidth: '220px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
        {eventi.length > 1 && (
          <select value={filtroEvento} onChange={(e) => setFiltroEvento(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }}>
            <option value="tutti">Tutte le serate</option>
            {eventi.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
          </select>
        )}
        <select value={filtroStato} onChange={(e) => setFiltroStato(e.target.value)}
          style={{ padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }}>
          <option value="attivi">Tutti tranne annullati</option>
          <option value="tutti">Tutti</option>
          {Object.entries(STATI).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
        <button onClick={carica} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>↻ Aggiorna</button>
        <button onClick={esportaCsv} disabled={filtrate.length === 0} style={{ background: '#c1440e', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>↓ Esporta CSV</button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Iscrizioni', valore: filtrate.length },
          { label: 'Persone attese', valore: totalePersone },
          { label: 'Posti occupati (serata attuale)', valore: `${postiOccupati} / ${SERATA_AI.postiMassimi}` },
          { label: 'Consenso marketing', valore: consensiMarketing },
        ].map((k) => (
          <div key={k.label} style={{ background: 'white', borderRadius: '10px', padding: '14px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a' }}>{k.valore}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Caricamento…</div>
        ) : errore ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#b91c1c' }}>
            {errore}
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
              Se l&apos;errore parla di una tabella mancante, va eseguita la migrazione supabase/migrations/20261110_serata_ai_academy.sql nel SQL editor di Supabase.
            </div>
          </div>
        ) : filtrate.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Nessuna iscrizione.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Iscritto il', 'Persona', 'Contatti', 'Azienda', 'Pers.', 'Stato', ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrate.map((r, idx) => {
                  const stato = STATI[r.stato] || STATI.nuovo
                  const aperta = espansa === r.id
                  return [
                    <tr key={r.id} style={{ borderBottom: aperta ? 'none' : '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ ...cella, whiteSpace: 'nowrap', color: '#64748b' }}>{formattaData(r.created_at)}</td>
                      <td style={cella}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{r.nome} {r.cognome}</div>
                        {r.ruolo && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.ruolo}</div>}
                      </td>
                      <td style={cella}>
                        <a href={`mailto:${r.email}`} style={{ color: '#1e40af' }}>{r.email}</a>
                        {r.telefono && <div><a href={`tel:${r.telefono}`} style={{ color: '#334155' }}>{r.telefono}</a></div>}
                        <div style={{ fontSize: '11px', marginTop: '2px', color: r.consenso_marketing ? '#065F46' : '#94a3b8' }}>
                          {r.consenso_marketing ? '✓ Consenso marketing' : 'No marketing'}
                        </div>
                      </td>
                      <td style={cella}>{r.azienda || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                      <td style={{ ...cella, textAlign: 'center', fontWeight: '600' }}>{r.num_persone}</td>
                      <td style={cella}>
                        <select value={r.stato} onChange={(e) => salva(r.id, { stato: e.target.value })}
                          style={{ padding: '4px 8px', borderRadius: '999px', border: 'none', fontSize: '12px', fontWeight: '600', background: stato.bg, color: stato.text, cursor: 'pointer' }}>
                          {Object.entries(STATI).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={cella}>
                        <button onClick={() => setEspansa(aperta ? null : r.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', fontSize: '12px' }}>
                          {aperta ? 'Chiudi' : 'Dettagli'}{(r.messaggio || r.note_operatore) ? ' •' : ''}
                        </button>
                      </td>
                    </tr>,
                    aperta && (
                      <tr key={`${r.id}-dettaglio`} style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <td colSpan={7} style={{ padding: '14px 20px', fontSize: '13px', color: '#334155' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Interessi</div>
                              {(r.interessi || '').split(',').filter(Boolean).map((k) => <div key={k}>• {ETICHETTA_INTERESSE[k] || k}</div>)}
                              {!r.interessi && <span style={{ color: '#94a3b8' }}>—</span>}
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: '12px 0 4px' }}>Messaggio</div>
                              <div style={{ whiteSpace: 'pre-wrap' }}>{r.messaggio || <span style={{ color: '#94a3b8' }}>—</span>}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Note interne</div>
                              <textarea rows={3} value={note[r.id] ?? r.note_operatore ?? ''} onChange={(e) => setNote((n) => ({ ...n, [r.id]: e.target.value }))}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                              <button onClick={() => salva(r.id, { note_operatore: note[r.id] ?? r.note_operatore ?? '' })}
                                style={{ marginTop: '6px', background: '#1a2e5a', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>
                                Salva note
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ),
                  ]
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
