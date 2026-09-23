'use client'

import { useState } from 'react'

const STATI_RIPRISTINO = ['nuovo', 'contattato', 'iscritto', 'annullato']

// Riceve gli stessi dati già caricati dal tab Voucher (nessuna fetch propria):
// mostra solo le aziende con stato "archiviato" e permette di ripristinarle.
export default function ArchiviatiTab({ voucherAziende, onCambiaStato }) {
  const [ricerca, setRicerca] = useState('')

  const archiviate = (voucherAziende || []).filter((a) => a.stato === 'archiviato')
  const filtrate = archiviate.filter((a) => {
    if (!ricerca) return true
    const q = ricerca.toLowerCase()
    return [a.ragione_sociale, a.piva_cf, a.referente_nome, a.referente_cognome, a.referente_email].join(' ').toLowerCase().includes(q)
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <input type="text" placeholder="🔍 Cerca ragione sociale, P.IVA, referente…" value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          style={{ flex: '1', minWidth: '200px', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
        <span style={{ fontSize: '13px', color: '#64748b' }}>{filtrate.length} aziende archiviate</span>
      </div>

      <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {filtrate.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Nessuna azienda archiviata.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Azienda', 'Referente', 'Partecipanti', 'Ripristina'].map((h, hi) => (
                    <th key={hi} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrate.map((a, idx) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{a.ragione_sociale}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.piva_cf}</div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '13px', color: '#334155' }}>{a.referente_nome} {a.referente_cognome}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '13px', color: '#334155' }}>{a.partecipanti?.length || 0}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <select defaultValue="" onChange={(e) => { if (e.target.value) onCambiaStato(a.id, e.target.value) }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', cursor: 'pointer' }}>
                        <option value="" disabled>Sposta in…</option>
                        {STATI_RIPRISTINO.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
