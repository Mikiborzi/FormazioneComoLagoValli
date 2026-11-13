import Link from 'next/link'
import { PAGINA_SERATA, TESTI_SERATA } from '@/app/lib/serataAi'

// Riquadro di invito alla serata "AI Academy Open", nello stile del kit AI Academy
// (classi aia-* in app/aia-stile.css). Usato su home, formazione-impresa,
// /ai-academy e /ai-academy/imprese. Porta al modulo su /ai-academy/serata#prenota.
// `className` serve per i margini esterni (mt-6, mx-auto, max-w-…): il riquadro
// non li imposta, quindi le utility Tailwind funzionano.

export default function InvitoSerataAi({ className = '' }) {
  return (
    <div className={`aia-invito ${className}`}>
      <img className="aia-logo" src="/ai-academy-logo.png" alt="AI Academy" width="380" height="100" />
      <p className="aia-occhiello">{TESTI_SERATA.occhiello}</p>
      <p className="aia-invito__titolo">{TESTI_SERATA.titolo}</p>
      <div className="aia-barra" aria-hidden="true" />
      <p className="aia-invito__testo">{TESTI_SERATA.sottotitolo}</p>
      <div className="aia-azioni">
        <Link className="aia-pulsante aia-pulsante--piccolo" href={`${PAGINA_SERATA}#prenota`}>
          {TESTI_SERATA.pulsante}
        </Link>
        <span className="aia-badge">{TESTI_SERATA.dressCode}</span>
      </div>
    </div>
  )
}
