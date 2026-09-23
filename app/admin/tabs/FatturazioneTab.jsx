'use client'

import { useEffect, useState } from 'react'
import { FASCIA_LABEL } from '@/app/lib/edizioni'

const STATO_FATTURA_COLORS = {
  da_emettere: { bg: '#FEF3C7', text: '#92400E', label: 'Da emettere' },
  emessa:      { bg: '#DBEAFE', text: '#1E40AF', label: 'Emessa' },
  incassata:   { bg: '#D1FAE5', text: '#065F46', label: 'Incassata' },
}

function euro(v) {
  if (v == null) return '—'
  return Number(v).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

export default function FatturazioneTab({ token }) {
  const [fatture, setFatture] = useState([])
  const [suggerimenti, setSuggerimenti] = useState([])
  const [loading, setLoading] = useState(true)
  const [creando, setCreando] = useState(null)

  async function carica() {
    setLoading(true)
    const res = await fetch('/api/admin/fatture', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const dati = await res.json()
      setFatture(dati.fatture || [])
      setSuggerimenti(dati.suggerimenti || [])
    }
    setLoading(false)
  }

  useEffect(() => { carica() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function creaFattura(s) {
    setCreando(`${s.azienda_id}|${s.edizione_id}`)
    await fetch('/api/admin/fatture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ azienda_id: s.azienda_id, edizione_id: s.edizione_id }),
    })
    await carica()
    setCreando(null)
  }

  async function aggiornaFattura(id, campi) {
    setFatture((prev) => prev.map((f) => (f.id === id ? { ...f, ...campi } : f)))
    await fetch('/api/admin/fatture', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...campi }),
    })
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Caricamento…</div>

  const totaleDaEmettere = fatture.filter((f) => f.stato === 'da_emettere').reduce((n, f) => n + Number(f.importo || 0), 0)
  const totaleIncassato = fatture.filter((f) => f.stato === 'incassata').reduce((n, f) => n + Number(f.importo || 0), 0)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Da fatturare (suggerite)', value: suggerimenti.length, color: '#d97706', emoji: '🔔' },
          { label: 'Da emettere (già create)', value: euro(totaleDaEmettere), color: '#1e3a8a', emoji: '🧾' },
          { label: 'Incassato', value: euro(totaleIncassato), color: '#166534', emoji: '💶' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.emoji}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
        Gli importi sono sempre a prezzo pieno (costo corso × partecipanti): nessuno sconto in fattura.
        La fascia addetti indicata è solo un riferimento — è la quota di rimborso che l'azienda richiederà separatamente alla Regione.
      </p>

      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>🔔 Da fatturare</div>
      {suggerimenti.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '30px', textAlign: 'center', color: '#94a3b8', marginBottom: '24px' }}>
          Nessuna edizione avviata in attesa di fattura.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {suggerimenti.map((s) => {
            const chiave = `${s.azienda_id}|${s.edizione_id}`
            return (
              <div key={chiave} style={{ background: 'white', borderRadius: '8px', padding: '12px 16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{s.ragione_sociale}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{s.piva_cf}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{s.corso_nome} {s.edizione_nome ? `— ${s.edizione_nome}` : ''}</div>
                <div style={{ fontSize: '12px', color: '#334155' }}>{s.numero_partecipanti} partecipanti</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{FASCIA_LABEL[s.fascia_addetti] || 'fascia non nota'}</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{euro(s.importo_computato)}</div>
                <button onClick={() => creaFattura(s)} disabled={creando === chiave}
                  style={{ marginLeft: 'auto', background: '#166534', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  {creando === chiave ? 'Creazione…' : '+ Crea fattura'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>🧾 Fatture registrate ({fatture.length})</div>
      {fatture.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Nessuna fattura registrata.</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Azienda', 'Edizione', 'Importo', 'N. fattura', 'Data emissione', 'Stato'].map((h, hi) => (
                    <th key={hi} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fatture.map((f, idx) => {
                  const colori = STATO_FATTURA_COLORS[f.stato] || STATO_FATTURA_COLORS.da_emettere
                  return (
                    <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>{f.ragione_sociale}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{f.piva_cf}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#475569' }}>{f.corso_nome} {f.edizione_nome ? `— ${f.edizione_nome}` : ''}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <input type="number" step="0.01" defaultValue={f.importo ?? ''} onBlur={(e) => aggiornaFattura(f.id, { importo: e.target.value ? Number(e.target.value) : null })}
                          style={{ width: '100px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }} />
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <input type="text" defaultValue={f.numero_fattura || ''} onBlur={(e) => aggiornaFattura(f.id, { numero_fattura: e.target.value || null })}
                          style={{ width: '110px', padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }} />
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <input type="date" defaultValue={f.data_emissione || ''} onChange={(e) => aggiornaFattura(f.id, { data_emissione: e.target.value || null })}
                          style={{ padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }} />
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <select value={f.stato} onChange={(e) => aggiornaFattura(f.id, { stato: e.target.value })}
                          style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: colori.bg, color: colori.text }}>
                          {Object.keys(STATO_FATTURA_COLORS).map((s) => <option key={s} value={s}>{STATO_FATTURA_COLORS[s].label}</option>)}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
