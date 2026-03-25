'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'

const STATI = ['tutti', 'nuovo', 'contattato', 'iscritto', 'in_attesa', 'non_idoneo']
const STATI_BADGE = {
  nuovo:      { label: 'Nuovo',       color: '#6b7280', bg: '#f3f4f6' },
  contattato: { label: 'Contattato',  color: '#92400e', bg: '#fef3c7' },
  iscritto:   { label: 'Iscritto',    color: '#065f46', bg: '#d1fae5' },
  in_attesa:  { label: 'In attesa',   color: '#1e40af', bg: '#dbeafe' },
  non_idoneo: { label: 'Non idoneo',  color: '#991b1b', bg: '#fee2e2' },
}

export default function Admin() {
  const [user, setUser]               = useState(null)
  const [accesso, setAccesso]         = useState(false)
  const [tab, setTab]                 = useState('lead')
  const [iscrizioni, setIscrizioni]   = useState([])
  const [recensioni, setRecensioni]   = useState([])
  const [desideri, setDesideri]       = useState([])
  const [filtroStato, setFiltroStato] = useState('tutti')
  const [filtroCors, setFiltroCors]   = useState('tutti')
  const [selezionato, setSelezionato] = useState(null)
  const [nuovoStato, setNuovoStato]   = useState('')
  const [note, setNote]               = useState('')
  const [salvando, setSalvando]       = useState(false)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(user.email)) {
        window.location.href = '/'
        return
      }
      setUser(user)
      setAccesso(true)
      await caricaDati(supabase)
      setLoading(false)
    }
    init()
  }, [])

  async function caricaDati(supabase) {
    const [{ data: i }, { data: r }, { data: d }] = await Promise.all([
      supabase.from('iscrizioni').select('*').order('created_at', { ascending: false }),
      supabase.from('recensioni').select('*').order('created_at', { ascending: false }),
      supabase.from('desideri_formativi').select('*, categorie_formative(titolo)').order('created_at', { ascending: false }),
    ])
    setIscrizioni(i || [])
    setRecensioni(r || [])
    setDesideri(d || [])
  }

  async function salvaLead() {
    setSalvando(true)
    const supabase = createClient()
    await supabase.from('iscrizioni').update({
      stato: nuovoStato || selezionato.stato,
      note_operatore: note,
    }).eq('id', selezionato.id)
    await caricaDati(supabase)
    setSelezionato(null)
    setSalvando(false)
  }

  async function toggleRecensione(id, visibile) {
    const supabase = createClient()
    await supabase.from('recensioni').update({ visibile: !visibile }).eq('id', id)
    await caricaDati(supabase)
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">Caricamento...</p>
    </div>
  )

  const iscrizioniFiltrate = iscrizioni.filter(i => {
    const statoOk = filtroStato === 'tutti' || i.stato === filtroStato
    const corsoOk = filtroCors === 'tutti' || (Array.isArray(i.corsi_interesse) && i.corsi_interesse.includes(filtroCors))
    return statoOk && corsoOk
  })

  const corsiUnici = [...new Set(iscrizioni.flatMap(i => Array.isArray(i.corsi_interesse) ? i.corsi_interesse : [i.corsi_interesse]))]

  const contatoriCorsi = corsiUnici.map(corso => ({
    corso,
    count: iscrizioni.filter(i => Array.isArray(i.corsi_interesse) ? i.corsi_interesse.includes(corso) : i.corsi_interesse === corso).length
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2e5a' }}>Dashboard admin</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
        </div>
        <a href="/" className="text-sm text-gray-400 underline hover:text-gray-600">Vai al sito</a>
      </div>

      {/* Alert corsi attivabili */}
      {contatoriCorsi.filter(c => c.count >= 8).map(c => (
        <div key={c.corso} className="mb-4 rounded-xl px-5 py-3 text-sm font-medium" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
          Il corso <strong>{c.corso}</strong> ha raggiunto {c.count} preiscrizioni — valuta se attivarlo
        </div>
      ))}

      {/* Tab */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: '#e2e8f0' }}>
        {[['lead', 'Lead'], ['contatori', 'Contatori corsi'], ['recensioni', 'Recensioni'], ['desideri', 'Corsi proposti']].map(([k, v]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: tab === k ? '#1a2e5a' : 'transparent',
              color: tab === k ? '#1a2e5a' : '#6b7280'
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* TAB LEAD */}
      {tab === 'lead' && (
        <div>
          {/* Filtri */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <select
              value={filtroStato}
              onChange={e => setFiltroStato(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            >
              {STATI.map(s => <option key={s} value={s}>{s === 'tutti' ? 'Tutti gli stati' : STATI_BADGE[s]?.label || s}</option>)}
            </select>
            <select
              value={filtroCors}
              onChange={e => setFiltroCors(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="tutti">Tutti i corsi</option>
              {corsiUnici.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-sm text-gray-400 self-center">{iscrizioniFiltrate.length} lead</span>
          </div>

          {/* Tabella */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  {['Nome', 'Email', 'Corso', 'Sede', 'GOL', 'Stato', 'Data'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {iscrizioniFiltrate.map((i, idx) => {
                  const badge = STATI_BADGE[i.stato] || STATI_BADGE.nuovo
                  return (
                    <tr
                      key={i.id}
                      onClick={() => { setSelezionato(i); setNuovoStato(i.stato); setNote(i.note_operatore || '') }}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a2e5a' }}>{i.nome} {i.cognome}</td>
                      <td className="px-4 py-3 text-gray-500">{i.email}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-32 truncate">{Array.isArray(i.corsi_interesse) ? i.corsi_interesse[0] : i.corsi_interesse}</td>
                      <td className="px-4 py-3 text-gray-500">{Array.isArray(i.sedi_preferite) ? i.sedi_preferite[0] : i.sedi_preferite}</td>
                      <td className="px-4 py-3">{i.idoneo_gol ? '✓' : '✗'}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: badge.color, backgroundColor: badge.bg }}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(i.created_at).toLocaleDateString('it-IT')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTATORI */}
      {tab === 'contatori' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contatoriCorsi.map(({ corso, count }) => (
            <div key={corso} className="rounded-xl p-5" style={{ border: `1px solid ${count >= 8 ? '#a7f3d0' : '#e2e8f0'}`, backgroundColor: count >= 8 ? '#f0faf5' : 'white' }}>
              <p className="font-medium text-sm mb-1" style={{ color: '#1a2e5a' }}>{corso}</p>
              <p className="text-2xl font-bold" style={{ color: count >= 8 ? '#065f46' : '#1a2e5a' }}>{count}</p>
              <p className="text-xs text-gray-400 mt-0.5">preiscrizioni{count >= 8 ? ' — pronto per attivazione' : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB RECENSIONI */}
      {tab === 'recensioni' && (
        <div className="flex flex-col gap-3">
          {recensioni.map(r => (
            <div key={r.id} className="rounded-xl p-5 flex items-start justify-between gap-4" style={{ border: '1px solid #e2e8f0' }}>
              <div>
                <p className="font-medium text-sm" style={{ color: '#1a2e5a' }}>{r.nome} {r.cognome}</p>
                <p className="text-xs text-gray-400 mb-2">{r.corso} · {r.anno} · {'★'.repeat(r.valutazione)}</p>
                <p className="text-sm text-gray-600">{r.testo}</p>
              </div>
              <button
                onClick={() => toggleRecensione(r.id, r.visibile)}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: r.visibile ? '#fee2e2' : '#d1fae5', color: r.visibile ? '#991b1b' : '#065f46' }}
              >
                {r.visibile ? 'Nascondi' : 'Mostra'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB DESIDERI */}
      {tab === 'desideri' && (
        <div className="flex flex-col gap-3">
          {desideri.map(d => (
            <div key={d.id} className="rounded-xl p-5" style={{ border: '1px solid #e2e8f0' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-medium text-sm" style={{ color: '#1a2e5a' }}>{d.nome} {d.cognome}</p>
                <span className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString('it-IT')}</span>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: '#1a2e5a' }}>{d.categorie_formative?.titolo}</p>
              <p className="text-sm text-gray-600">{d.descrizione_libera}</p>
            </div>
          ))}
        </div>
      )}

      {/* PANNELLO LATERALE LEAD */}
      {selezionato && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onClick={() => setSelezionato(null)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg" style={{ color: '#1a2e5a' }}>{selezionato.nome} {selezionato.cognome}</h2>
              <button onClick={() => setSelezionato(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-3 text-sm mb-6">
              {[
                ['Email', selezionato.email],
                ['Telefono', selezionato.telefono],
                ['Codice fiscale', selezionato.codice_fiscale],
                ['Data nascita', selezionato.data_nascita],
                ['Comune residenza', selezionato.comune_residenza],
                ['Comune domicilio', selezionato.comune_domicilio],
                ['Status', selezionato.status],
                ['Idoneo GOL', selezionato.idoneo_gol ? 'Sì' : 'No'],
                ['Iscritto CPI', selezionato.iscritto_cpi ? 'Sì' : 'No'],
                ['CPI riferimento', selezionato.cpi_riferimento],
                ['GOL attivo', selezionato.gol_attivo ? 'Sì' : 'No'],
                ['Ente GOL', selezionato.ente_gol],
                ['Corsi interesse', Array.isArray(selezionato.corsi_interesse) ? selezionato.corsi_interesse.join(', ') : selezionato.corsi_interesse],
                ['Sedi preferite', Array.isArray(selezionato.sedi_preferite) ? selezionato.sedi_preferite.join(', ') : selezionato.sedi_preferite],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-400 w-36 shrink-0">{k}</span>
                  <span className="text-gray-700">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stato</label>
                <select
                  value={nuovoStato}
                  onChange={e => setNuovoStato(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {Object.entries(STATI_BADGE).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Note operatore</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Aggiungi una nota..."
                />
              </div>
              <button
                onClick={salvaLead}
                disabled={salvando}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: '#1a2e5a' }}
              >
                {salvando ? 'Salvataggio...' : 'Salva modifiche'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
