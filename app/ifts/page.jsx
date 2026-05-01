import Link from 'next/link'

export const metadata = {
  title: 'Percorsi IFTS — Formazione Como Lago e Valli',
  description: 'Istruzione e Formazione Tecnica Superiore con apprendistato di primo livello. Percorsi per Tecnici Amministrativi e Tecnici Moda nel distretto comasco.',
}

export default function IftsPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #1a2e5a 0%, #142347 100%)' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#7dd3a8' }}>
            Istruzione e Formazione Tecnica Superiore
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-6">
            Percorsi IFTS<br />in Apprendistato
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            800–1000 ore di formazione specialistica, interamente finanziate, con un contratto
            di lavoro già dal primo giorno. Per chi ha un diploma o una qualifica professionale
            e vuole costruire una carriera nel tessile-moda o nell'amministrazione.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ifts/candidati"
              className="inline-block font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#2d7a4f', color: '#fff' }}
            >
              Sono un ragazzo / una ragazza
            </Link>
            <Link
              href="/ifts/aziende"
              className="inline-block font-semibold text-base px-8 py-4 rounded-xl border-2 transition-all duration-200 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
            >
              Sono un'azienda
            </Link>
          </div>
        </div>
      </section>

      {/* Cosa sono i percorsi IFTS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#1a2e5a' }}>
            Cosa sono i percorsi IFTS
          </h2>
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: '#2d7a4f' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 text-base leading-relaxed">
            <p>
              I percorsi IFTS — Istruzione e Formazione Tecnica Superiore — sono programmi di
              specializzazione post-diploma o post-qualifica professionale della durata di 800–1000 ore.
              Sono progettati per chi vuole acquisire competenze tecniche avanzate in tempi definiti,
              con una forte componente pratica in azienda.
            </p>
            <p>
              Il percorso si attiva con l'<strong>apprendistato di primo livello</strong>: il giovane
              firma un contratto di assunzione con un'azienda prima di iniziare a formarsi. La formazione
              è interamente finanziata da risorse pubbliche. Per l'azienda è l'opportunità di contribuire
              alla crescita del futuro collaboratore fin dall'inizio, con il metodo <em>on the job</em>.
            </p>
          </div>
        </div>
      </section>

      {/* I corsi disponibili */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#1a2e5a' }}>
            Gli indirizzi attivi
          </h2>
          <div className="w-12 h-1 rounded-full mb-10" style={{ backgroundColor: '#2d7a4f' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(26,46,90,0.08)' }}>
                <svg className="w-6 h-6" fill="none" stroke="#1a2e5a" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-3" style={{ color: '#1a2e5a' }}>
                Tecnico Amministrativo
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Contabilità, gestione documentale, strumenti digitali per l'ufficio, relazione con
                clienti e fornitori. Una figura richiesta in ogni tipologia di azienda, dalla PMI
                al grande gruppo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(45,122,79,0.08)' }}>
                <svg className="w-6 h-6" fill="none" stroke="#2d7a4f" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-3" style={{ color: '#1a2e5a' }}>
                Tecnico Moda — Made in Italy
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Produzione tessile, gestione del campionario, controllo qualità, supply chain della
                moda. Pensato per il distretto comasco, tra i principali fornitori di tessuti dei
                grandi brand del lusso italiano.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Due corsie */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4 text-center" style={{ color: '#1a2e5a' }}>
            Da dove vuoi iniziare?
          </h2>
          <div className="w-12 h-1 rounded-full mb-12 mx-auto" style={{ backgroundColor: '#2d7a4f' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #1a2e5a 0%, #2d4a8a 100%)' }}>
              <h3 className="font-display font-bold text-2xl mb-3">Sei un ragazzo o una ragazza?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Hai un diploma o una qualifica professionale, hai tra i 18 e i 24 anni e vuoi
                iniziare a lavorare nel tessile-moda o in un ufficio amministrativo con una
                formazione solida già pagata? Registra il tuo interesse — ti contatteremo per
                trovare l'abbinamento con un'azienda.
              </p>
              <Link
                href="/ifts/candidati"
                className="inline-block font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#2d7a4f', color: '#fff' }}
              >
                Voglio candidarmi →
              </Link>
            </div>

            <div className="rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #2d7a4f 0%, #1a6a3a 100%)' }}>
              <h3 className="font-display font-bold text-2xl mb-3">Sei un'azienda?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Cerchi un giovane tecnico da formare secondo le esigenze della tua azienda?
                O vuoi costruire una vera Academy aziendale per inserire più figure
                specializzate? Parliamone — il percorso IFTS in apprendistato è lo strumento
                giusto.
              </p>
              <Link
                href="/ifts/aziende"
                className="inline-block font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#fff', color: '#1a6a3a' }}
              >
                Voglio saperne di più →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Banner finanziamento */}
      <section className="py-10 px-4" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Percorsi finanziati da</p>
          <span className="text-sm font-semibold text-gray-700">🇪🇺 Unione Europea</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-700">Ministero del Lavoro</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-700">Regione Lombardia</span>
        </div>
      </section>

    </main>
  )
}
