'use client'
import { useEffect, useState } from 'react'

const CREAM = '#ece8e1'
const CLAY_LIGHT = '#d96a3f'

export default function AllegatiVerificati() {
  const [allegati, setAllegati] = useState([])
  const [caricato, setCaricato] = useState(false)

  useEffect(() => {
    fetch('/api/allegati-voucher')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setAllegati(d); setCaricato(true) })
      .catch(() => setCaricato(true))
  }, [])

  if (!caricato) return null
  if (allegati.length === 0) return null

  return (
    <div className="mt-6 rounded-2xl p-6 sm:p-7" style={{ backgroundColor: 'rgba(217,106,63,0.06)', border: '1px solid rgba(217,106,63,0.25)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl leading-none" style={{ color: CLAY_LIGHT }} aria-hidden="true">📎</span>
        <p className="font-sans text-sm font-semibold uppercase" style={{ letterSpacing: '0.1em', color: 'rgba(236,232,225,0.7)' }}>
          Allegati del decreto — versione verificata
        </p>
      </div>
      <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: 'rgba(236,232,225,0.65)' }}>
        I documenti ufficiali del Decreto n. 8809/2026, verificati dal nostro team e pronti all&apos;uso.
        Scaricali gratuitamente: sono gli stessi che troverai sul portale di Regione Lombardia.
      </p>
      <div className="flex flex-col gap-3">
        {allegati.map(a => (
          <a
            key={a.id}
            href={a.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 transition-colors hover:brightness-110"
            style={{ backgroundColor: 'rgba(236,232,225,0.04)', border: '1px solid rgba(236,232,225,0.1)', textDecoration: 'none' }}
          >
            <div className="shrink-0 flex items-center gap-3 min-w-0 flex-1">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-xs shrink-0" style={{ backgroundColor: 'rgba(217,106,63,0.15)', color: CLAY_LIGHT }}>
                {a.codice}
              </span>
              <div className="min-w-0">
                <p className="font-sans font-semibold text-sm truncate" style={{ color: CREAM }}>{a.titolo}</p>
                {a.descrizione && (
                  <p className="font-sans text-xs leading-snug mt-0.5" style={{ color: 'rgba(236,232,225,0.55)' }}>{a.descrizione}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
              <span className="font-sans text-xs" style={{ color: 'rgba(236,232,225,0.5)' }}>
                Verificato il {new Date(a.data_verifica).toLocaleDateString('it-IT')} · v{a.versione}
              </span>
              <span className="font-sans text-xs font-semibold" style={{ color: CLAY_LIGHT }}>
                Scarica ↓
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
