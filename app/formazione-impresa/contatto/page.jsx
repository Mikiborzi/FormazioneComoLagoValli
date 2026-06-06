import Link from 'next/link'
import FormContattoImpresa from '@/app/components/FormContattoImpresa'

export const metadata = {
  title: 'Richiedi contatto — Formazione Impresa | Formazione Como Lago e Valli',
  description: 'Lascia i tuoi riferimenti e ti ricontatteremo per illustrarti i percorsi di Formazione Impresa disponibili.',
}

export default function ContattoPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6b0000 0%, #b01a1a 50%, #cc2222 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-10 lg:pb-16">
          <Link
            href="/formazione-impresa"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium mb-6 transition-opacity hover:opacity-75"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Formazione Impresa
          </Link>
          <span
            className="inline-block font-sans font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' }}
          >
            Contatto
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Richiedi un contatto
          </h1>
          <p className="font-sans text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Lascia i tuoi riferimenti e descrivi brevemente le tue esigenze formative.
            Ti ricontatteremo entro 24 ore per illustrarti le opportunità disponibili.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '1px solid #e2e8f0' }}>
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#1a2e5a' }}>
              I tuoi riferimenti
            </h2>
            <p className="font-sans text-sm text-gray-500">
              Nessun impegno: ti risponderemo per capire come possiamo supportarti al meglio.
            </p>
          </div>
          <FormContattoImpresa />
        </div>
      </div>

    </main>
  )
}
