import Link from 'next/link'
import { SERATA_AI } from '@/app/lib/serataAi'

// Riquadro di invito alla serata di presentazione AI Academy per le imprese.
// Usato su home, formazione-impresa e pagina AI Academy. Porta al modulo
// di iscrizione su /ai-academy/imprese#serata.

export default function InvitoSerataAi({ tema = 'chiaro', className = '' }) {
  const scuro = tema === 'scuro'
  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 text-left flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 ${className}`}
      style={
        scuro
          ? { backgroundColor: 'rgba(236,232,225,0.05)', border: '1.5px solid rgba(217,106,63,0.55)' }
          : { backgroundColor: '#0b0b0c', border: '1.5px solid #c1440e' }
      }
    >
      <div
        className="shrink-0 rounded-xl text-center px-4 py-3 self-start"
        style={{ backgroundColor: '#c1440e', color: '#fff', minWidth: '5.5rem' }}
      >
        <div className="font-sans text-xs font-semibold uppercase" style={{ letterSpacing: '0.12em' }}>{SERATA_AI.meseBreve}</div>
        <div className="font-sans text-3xl font-bold leading-none my-1">{SERATA_AI.giornoNumero}</div>
        <div className="font-sans text-xs font-semibold">ore {SERATA_AI.ora}</div>
      </div>
      <div className="flex-1">
        <p className="font-sans text-xs font-semibold uppercase mb-1" style={{ letterSpacing: '0.14em', color: '#d96a3f' }}>
          Serata gratuita · aperta a tutti
        </p>
        <p className="font-sans font-bold text-lg sm:text-xl mb-1.5" style={{ color: '#ece8e1' }}>
          AI Academy per le imprese: vieni a vedere come lavoriamo.
        </p>
        <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(236,232,225,0.7)' }}>
          {SERATA_AI.giorno}, ore {SERATA_AI.ora}, da {SERATA_AI.luogo} ({SERATA_AI.indirizzo}).
          Presentiamo i percorsi formativi sull&apos;AI e ti mostriamo i nostri laboratori.
        </p>
      </div>
      <Link
        href="/ai-academy/imprese#serata"
        className="inline-flex items-center justify-center font-sans font-semibold rounded-full px-6 py-3 text-sm shrink-0 transition-all duration-200 hover:brightness-110"
        style={{ backgroundColor: '#c1440e', color: '#fff' }}
      >
        Prenota il tuo posto →
      </Link>
    </div>
  )
}
