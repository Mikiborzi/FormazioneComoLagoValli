import Link from 'next/link'
import { TESTI_SERATA } from '@/app/lib/serataAi'

// Riquadro di invito alla serata AI Academy Open (linea grafica aia-*, app/aia.css).
// Usato in home, /ai-academy, /ai-academy/imprese e /formazione-impresa.
// Porta al modulo di prenotazione su /ai-academy/serata#prenota.
export default function InvitoSerataAi({ className = '' }) {
  return (
    <div className={`aia-invito ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="aia-logo" src="/ai-academy-logo.png" alt="AI Academy" width={380} height={100} />
      <p className="aia-occhiello">{TESTI_SERATA.occhiello}</p>
      <p className="aia-invito__titolo">{TESTI_SERATA.titolo}</p>
      <div className="aia-barra" aria-hidden="true" />
      <p className="aia-invito__testo">{TESTI_SERATA.frase}</p>
      <div className="aia-azioni">
        <Link href="/ai-academy/serata#prenota" className="aia-pulsante aia-pulsante--piccolo">
          Prenota il tuo posto
        </Link>
        <span className="aia-badge">{TESTI_SERATA.dressCode}</span>
      </div>
    </div>
  )
}
