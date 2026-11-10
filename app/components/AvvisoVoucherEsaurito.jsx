import Link from 'next/link'

// Avviso unico per la chiusura dello sportello Voucher Formazione Continua
// (risorse esaurite). Testi in un solo punto: se Regione Lombardia rifinanzia
// la misura si aggiorna qui e su tutte le pagine che lo usano.

export const VOUCHER_ESAURITO = {
  titolo: 'Voucher Formazione Continua: risorse esaurite',
  testo:
    'Le risorse dello sportello Voucher Formazione Continua 2026 di Regione Lombardia sono esaurite: non è più possibile presentare nuove domande. Se Regione Lombardia rifinanzierà la misura, ti aggiorneremo qui.',
  invito:
    "Nel frattempo, valuta le nostre proposte formative studiate su misura per persone e imprese che vogliono usare l'intelligenza artificiale nel proprio lavoro.",
}

export function CtaProposteAi({ tema = 'chiaro', className = '' }) {
  const scuro = tema === 'scuro'
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Link
        href="/ai-academy"
        className="inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-xl px-6 py-3 text-sm transition-all duration-200 hover:brightness-110"
        style={{ backgroundColor: '#c1440e', color: '#fff' }}
      >
        Scopri le proposte AI →
      </Link>
      <Link
        href="/formazione-impresa/contatto"
        className="inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-xl px-6 py-3 text-sm transition-all duration-200"
        style={
          scuro
            ? { color: '#ece8e1', border: '1px solid rgba(236,232,225,0.35)' }
            : { color: '#1a2e5a', border: '1px solid #cbd5e1', backgroundColor: '#fff' }
        }
      >
        Richiedi una proposta su misura
      </Link>
    </div>
  )
}

export default function AvvisoVoucherEsaurito({ tema = 'chiaro', conCta = true, className = '' }) {
  const scuro = tema === 'scuro'
  return (
    <div
      role="status"
      className={`rounded-2xl p-6 sm:p-7 text-left ${className}`}
      style={
        scuro
          ? { backgroundColor: 'rgba(217,106,63,0.12)', border: '1.5px solid rgba(217,106,63,0.55)' }
          : { backgroundColor: '#fff7ed', border: '1.5px solid #fdba74' }
      }
    >
      <p
        className="font-sans font-bold text-base sm:text-lg mb-2"
        style={{ color: scuro ? '#d96a3f' : '#9a3412' }}
      >
        {VOUCHER_ESAURITO.titolo}
      </p>
      <p
        className="font-sans text-sm sm:text-base leading-relaxed mb-2"
        style={{ color: scuro ? '#ece8e1' : '#431407' }}
      >
        {VOUCHER_ESAURITO.testo}
      </p>
      <p
        className="font-sans text-sm sm:text-base leading-relaxed"
        style={{ color: scuro ? 'rgba(236,232,225,0.75)' : '#7c2d12' }}
      >
        {VOUCHER_ESAURITO.invito}
      </p>
      {conCta && <CtaProposteAi tema={tema} className="mt-5" />}
    </div>
  )
}
