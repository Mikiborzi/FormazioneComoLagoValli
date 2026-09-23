'use client'

import { useEffect, useState } from 'react'
import { trovaConflittiSede } from '@/app/lib/edizioni'

const MESI = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

function meseAnno(dataIso) {
  if (!dataIso) return 'Senza data'
  const [anno, mese] = dataIso.split('-')
  return `${MESI[Number(mese) - 1]} ${anno}`
}

export default function CalendarioTab({ token }) {
  const [edizioni, setEdizioni] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/edizioni', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : { edizioni: [] })
      .then((d) => setEdizioni(d.edizioni || []))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Caricamento…</div>

  const ordinate = [...edizioni].sort((a, b) => (a.data_inizio || '9999').localeCompare(b.data_inizio || '9999'))
  const gruppi = {}
  for (const ed of ordinate) {
    const chiave = meseAnno(ed.data_inizio)
    ;(gruppi[chiave] ||= []).push(ed)
  }

  const conflittiTotali = ordinate.filter((ed) => trovaConflittiSede(ed, ordinate).length > 0).length

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Edizioni totali', value: edizioni.length, color: '#1e3a8a', emoji: '📚' },
          { label: 'Avviate/pianificate', value: edizioni.filter((e) => e.stato !== 'annullata' && e.stato !== 'conclusa').length, color: '#0369a1', emoji: '🗓️' },
          { label: 'Conflitti di sede/data', value: conflittiTotali, color: conflittiTotali > 0 ? '#991B1B' : '#166534', emoji: conflittiTotali > 0 ? '⚠️' : '✅' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.emoji}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {ordinate.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Nessuna edizione pianificata.</div>
      ) : (
        Object.entries(gruppi).map(([mese, elenco]) => (
          <div key={mese} style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{mese}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {elenco.map((ed) => {
                const conflitti = trovaConflittiSede(ed, ordinate)
                const inConflitto = conflitti.length > 0
                return (
                  <div key={ed.id} style={{
                    background: 'white', borderRadius: '8px', padding: '12px 16px',
                    border: inConflitto ? '1px solid #ef4444' : '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px',
                  }}>
                    <div style={{ minWidth: '180px' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{ed.corsi?.nome} {ed.nome ? `— ${ed.nome}` : ''}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{ed.sede || 'sede da definire'}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{ed.data_inizio || '—'} → {ed.data_fine || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '700' }}>{ed.numero_iscritti}/{ed.posti_max} posti</div>
                    {inConflitto && (
                      <div style={{ fontSize: '12px', color: '#991B1B', fontWeight: '600', marginLeft: 'auto' }}>
                        ⚠️ stessa sede e orario di {conflitti.length} altra/e edizione/i — verifica prima di confermare
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
