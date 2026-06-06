import Link from 'next/link'
import FormIscrizioneImpresa from '@/app/components/FormIscrizioneImpresa'

export const metadata = {
  title: 'Iscriviti — Formazione Impresa | Formazione Como Lago e Valli',
  description: 'Registrati ai percorsi di Formazione Impresa. Inserisci i tuoi dati per la gestione di fatturazione e pagamento.',
}

export default function IscrivitiPage() {
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
            Iscrizione
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Iscriviti ora
          </h1>
          <p className="font-sans text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Compila il form con i tuoi dati personali e di fatturazione. Ti contatteremo entro 24 ore
            per confermare l&apos;iscrizione e il percorso di pagamento.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '1px solid #e2e8f0' }}>
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#1a2e5a' }}>
              Dati di iscrizione
            </h2>
            <p className="font-sans text-sm text-gray-500">
              Inserisci i dati necessari per gestire fatturazione e pagamento del percorso.
            </p>
          </div>
          <FormIscrizioneImpresa />
        </div>
      </div>

    </main>
  )
}
