import Link from 'next/link'

export const metadata = {
  title: 'Formazione Impresa — L\'investimento migliore | Formazione Como Lago e Valli',
  description: 'Percorsi di formazione continua per dipendenti, imprenditori, consulenti e professionisti. Finanziabili con i voucher di Regione Lombardia per la Formazione Continua — PR FSE+ 2021-2027.',
}

const TARGET = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: 'Dipendenti',
    desc: 'Aggiorna le tue competenze, acquisisci nuovi strumenti e aumenta il tuo valore professionale. Con il voucher, il tuo datore di lavoro può finanziare la formazione fino al 90%.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Imprenditori',
    desc: 'Guida la tua azienda attraverso le trasformazioni del presente con visione aggiornata, strumenti nuovi e una rete di confronto reale. Come titolare, puoi accedere direttamente al voucher.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    label: 'Consulenti',
    desc: 'Resta al passo con gli ultimi sviluppi nei tuoi ambiti di specializzazione. I liberi professionisti con domicilio fiscale in Lombardia possono richiedere il voucher in prima persona.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    label: 'Professionisti',
    desc: 'Approfondisci temi trasversali — dall\'intelligenza artificiale alla gestione strategica — che stanno ridefinendo ogni professione. I lavoratori autonomi accedono al voucher con partita IVA.',
  },
]

const SFIDE = [
  {
    titolo: 'Intelligenza Artificiale',
    testo: 'Non è fantascienza: è già dentro i processi aziendali. Capire cosa fa, cosa non fa e come usarla al meglio è oggi una competenza di base per chiunque voglia restare competitivo.',
  },
  {
    titolo: 'Trasformazione digitale',
    testo: 'Strumenti, piattaforme e modelli operativi cambiano più velocemente di quanto si riesca ad aggiornare i team. La formazione continua è l\'unico modo per non restare indietro.',
  },
  {
    titolo: 'Sostenibilità e transizione ecologica',
    testo: 'Le imprese sono chiamate a riconsiderare processi, materiali e modelli di business. Le competenze green sono diventate un asset strategico, non un optional.',
  },
  {
    titolo: 'Leadership e soft skill',
    testo: 'Hybrid work, nuove generazioni, team distribuiti: gestire persone e progetti oggi richiede competenze trasversali continuamente rinnovate e testate sul campo.',
  },
]

export default function FormazioneImpresaPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #6b0000 0%, #b01a1a 50%, #cc2222 100%)' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#fca5a5' }}>
            Starting Work — Formazione Continua
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-6">
            Formazione Impresa<br />
            <span style={{ color: '#fca5a5' }}>L&apos;investimento migliore</span>
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed text-justify">
            Per chi l&apos;impresa la vive tutti i giorni. Percorsi studiati per chi vuole restare
            aggiornato, cogliere le opportunità del cambiamento e confrontarsi su come navigare
            — con lucidità e concretezza — un&apos;epoca di grandi trasformazioni.
          </p>
          <a
            href="https://sw-aiacademy.duckdns.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: 'white', color: '#8b0000' }}
          >
            Scopri il percorso AI ACADEMY →
          </a>
        </div>
      </section>

      {/* Di cosa si tratta */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#1a2e5a' }}>
            Di cosa si tratta
          </h2>
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: '#8b0000' }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 text-base leading-relaxed">
            <div className="space-y-4">
              <p className="text-justify">
                Formazione Impresa è la proposta di <strong>Starting Work</strong> dedicata a chi
                lavora dentro le organizzazioni — dipendenti, quadri, manager — e a chi le guida
                o le supporta dall&apos;esterno: imprenditori, consulenti, liberi professionisti.
              </p>
              <p className="text-justify">
                Non corsi generici. Percorsi <strong>studiati attorno alle esigenze reali</strong> di
                chi ogni giorno deve prendere decisioni, motivare persone, gestire processi e
                stare al passo con evoluzioni tecnologiche, normative e di mercato che si
                susseguono a ritmo sostenuto.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-justify">
                L&apos;obiettivo non è solo trasferire contenuti: è creare occasioni di
                <strong> confronto tra pari</strong>, momenti in cui chi vive le stesse sfide
                ragiona insieme su come affrontarle, con l&apos;aiuto di chi quelle sfide le ha
                studiate e vissute sul campo.
              </p>
              <p className="text-justify">
                Perché la formazione migliore non è quella che ti dice cosa fare: è quella
                che ti aiuta a capire <em>perché</em>, ti dà gli strumenti per farlo e ti mette
                in contatto con chi può aiutarti a farlo meglio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Per chi è pensata */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#1a2e5a' }}>
            Per chi è pensata
          </h2>
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: '#8b0000' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TARGET.map((t) => (
              <div key={t.label} className="bg-white rounded-2xl p-7 shadow-sm">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(139,0,0,0.07)', color: '#8b0000' }}
                >
                  {t.icon}
                </div>
                <h3 className="font-display font-bold text-xl mb-3" style={{ color: '#1a2e5a' }}>
                  {t.label}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed text-justify">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le sfide del nostro tempo */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#1a2e5a' }}>
            Le sfide del nostro tempo
          </h2>
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: '#8b0000' }} />
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-2xl text-justify">
            I percorsi Formazione Impresa nascono attorno ai temi che più impattano chi
            lavora e chi gestisce oggi: transizione digitale, intelligenza artificiale,
            sostenibilità, competenze trasversali.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SFIDE.map((s) => (
              <div
                key={s.titolo}
                className="rounded-2xl p-7"
                style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
              >
                <h3 className="font-display font-bold text-lg mb-3" style={{ color: '#8b0000' }}>
                  {s.titolo}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed text-justify">{s.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA percorsi */}
      <section className="py-16 px-4 text-white" style={{ background: 'linear-gradient(135deg, #6b0000 0%, #cc2222 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl mb-4">I percorsi disponibili</h2>
          <div className="w-12 h-1 rounded-full mb-6 mx-auto" style={{ backgroundColor: '#fca5a5' }} />
          <p className="text-white/85 text-base leading-relaxed max-w-2xl mx-auto mb-10 text-justify">
            Il catalogo completo dei percorsi Formazione Impresa — contenuti, modalità,
            date e iscrizioni — è disponibile sul portale dedicato di Starting Work.
          </p>
          <a
            href="https://sw-aiacademy.duckdns.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: 'white', color: '#8b0000' }}
          >
            Vai al catalogo dei percorsi →
          </a>
        </div>
      </section>

      {/* Voucher Formazione Continua */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">

          <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#1a2e5a' }}>
            Voucher Formazione Continua — Regione Lombardia
          </h2>
          <div className="w-12 h-1 rounded-full mb-8" style={{ backgroundColor: '#8b0000' }} />
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-2xl text-justify">
            Finanziato dal Programma Regionale Lombardia FSE+ 2021-2027 (Obiettivo ESO 4.4),
            il voucher consente a lavoratori e imprese di finanziare percorsi di formazione
            continua selezionabili da un catalogo regionale di offerte accreditate.
          </p>

          {/* Avviso stato */}
          <div
            className="rounded-2xl p-6 mb-12 flex gap-4"
            style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}
          >
            <span className="text-2xl shrink-0">📋</span>
            <div>
              <p className="font-semibold text-sm mb-2" style={{ color: '#92400e' }}>
                Quarta edizione — in attesa dell&apos;avviso attuativo
              </p>
              <p className="text-sm leading-relaxed text-justify" style={{ color: '#78350f' }}>
                Le linee guida della quarta edizione di Formazione Continua sono state approvate
                in delibera di Giunta Regionale. I percorsi Formazione Impresa di Starting Work
                saranno inseriti nel catalogo non appena l&apos;avviso attuativo sarà pubblicato.
                Scrivici a{' '}
                <a href="mailto:como@mestierilombardia.it" style={{ color: '#92400e', fontWeight: 700 }}>
                  como@mestierilombardia.it
                </a>{' '}
                per essere tra i primi informati.
              </p>
            </div>
          </div>

          {/* Come funziona */}
          <h3 className="font-display font-bold text-2xl mb-6" style={{ color: '#1a2e5a' }}>
            Come funziona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: '1',
                titolo: 'Scegli dal catalogo',
                testo: "L'azienda o il lavoratore autonomo consulta il catalogo regionale e sceglie il percorso formativo accreditato. I corsi sono organizzati per aree tematiche: digitale, green, linguistico, tecnico, soft skill.",
              },
              {
                step: '2',
                titolo: 'Richiedi il voucher',
                testo: 'Si presenta domanda "a sportello" sul portale regionale, indicando il percorso scelto e i nominativi dei destinatari. L\'impegno contabile è assunto solo dopo la verifica di ammissibilità.',
              },
              {
                step: '3',
                titolo: 'Partecipa e ottieni il rimborso',
                testo: 'Il voucher è erogato a rimborso dopo la conclusione del corso, a condizione che il destinatario abbia frequentato almeno il 75% delle ore previste e ottenuto la certificazione finale.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-2xl p-7">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-lg mb-5 text-white"
                  style={{ backgroundColor: '#8b0000' }}
                >
                  {item.step}
                </div>
                <h4 className="font-display font-bold text-base mb-3" style={{ color: '#1a2e5a' }}>
                  {item.titolo}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed text-justify">{item.testo}</p>
              </div>
            ))}
          </div>

          {/* Importi voucher */}
          <h3 className="font-display font-bold text-2xl mb-6" style={{ color: '#1a2e5a' }}>
            Quanto vale il voucher
          </h3>
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm rounded-2xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
              <thead>
                <tr style={{ backgroundColor: '#8b0000', color: 'white' }}>
                  <th className="text-left px-6 py-4 font-semibold">Livello EQF del percorso</th>
                  <th className="text-left px-6 py-4 font-semibold">Durata minima</th>
                  <th className="text-left px-6 py-4 font-semibold">Voucher massimo</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td className="px-6 py-4 text-gray-700 font-medium">EQF 6 – 8 &nbsp;(alto)</td>
                  <td className="px-6 py-4 text-gray-500">40 ore</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#8b0000' }}>€ 2.000</td>
                </tr>
                <tr style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td className="px-6 py-4 text-gray-700 font-medium">EQF 4 – 5 &nbsp;(medio)</td>
                  <td className="px-6 py-4 text-gray-500">30 ore</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#8b0000' }}>€ 1.500</td>
                </tr>
                <tr style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td className="px-6 py-4 text-gray-700 font-medium">EQF 3 &nbsp;(base)</td>
                  <td className="px-6 py-4 text-gray-500">16 ore</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#8b0000' }}>€ 800</td>
                </tr>
                <tr style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#fef2f2' }}>
                  <td className="px-6 py-4 text-gray-700 font-semibold" colSpan={2}>Massimale per lavoratore per anno solare</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#8b0000' }}>€ 2.000</td>
                </tr>
                <tr style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#fef2f2' }}>
                  <td className="px-6 py-4 text-gray-700 font-semibold" colSpan={2}>Massimale per azienda per anno solare</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#8b0000' }}>€ 50.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cofinanziamento */}
          <h3 className="font-display font-bold text-2xl mb-6" style={{ color: '#1a2e5a' }}>
            Quota pubblica e cofinanziamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {[
              {
                label: 'Liberi professionisti, lavoratori autonomi e imprese fino a 9 addetti',
                pubblica: '90%',
                privata: '10%',
                highlight: true,
              },
              {
                label: 'Imprese da 10 a 50 addetti',
                pubblica: '70%',
                privata: '30%',
                highlight: false,
              },
              {
                label: 'Imprese da 51 addetti in su',
                pubblica: '50%',
                privata: '50%',
                highlight: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-6"
                style={{
                  border: item.highlight ? '2px solid #8b0000' : '1px solid #e5e7eb',
                  backgroundColor: item.highlight ? '#fef2f2' : '#f9fafb',
                }}
              >
                <p className="text-sm text-gray-600 mb-5 leading-relaxed text-justify">{item.label}</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Quota pubblica</span>
                    <span className="font-display font-black text-xl" style={{ color: '#8b0000' }}>{item.pubblica}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Tuo contributo</span>
                    <span className="font-display font-bold text-lg text-gray-700">{item.privata}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chi può accedere */}
          <h3 className="font-display font-bold text-2xl mb-6" style={{ color: '#1a2e5a' }}>
            Chi può accedere
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className="rounded-2xl p-7"
              style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            >
              <h4 className="font-semibold text-base mb-4" style={{ color: '#1a2e5a' }}>
                Destinatari della formazione
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  'Lavoratori dipendenti a tempo indeterminato o determinato (full/part-time)',
                  'Soci-lavoratori di cooperative',
                  'Titolari e soci di micro, piccole, medie e grandi imprese con sede in Lombardia',
                  'Titolari di ditte individuali',
                  'Lavoratori autonomi e liberi professionisti con domicilio fiscale in Lombardia',
                ].map((v) => (
                  <li key={v} className="flex gap-2">
                    <span className="shrink-0 mt-0.5" style={{ color: '#8b0000' }}>✓</span>
                    <span className="text-justify">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl p-7"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <h4 className="font-semibold text-base mb-4" style={{ color: '#8b0000' }}>
                Sono esclusi
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  'Lavoratori con contratto intermittente o in somministrazione',
                  'Tirocinanti e apprendisti con periodo formativo ancora in corso',
                  'Collaboratori familiari dell\'imprenditore',
                  'Amministratori delegati e componenti del CdA',
                  'Soggetti assenti per ferie, malattia o aspettativa al momento della formazione',
                ].map((v) => (
                  <li key={v} className="flex gap-2">
                    <span className="shrink-0 mt-0.5 text-red-400">✗</span>
                    <span className="text-justify">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Aree tematiche */}
          <h3 className="font-display font-bold text-2xl mb-6" style={{ color: '#1a2e5a' }}>
            Aree tematiche del catalogo
          </h3>
          <div className="flex flex-wrap gap-3 mb-12">
            {[
              'Competenze digitali',
              'Competenze green / sostenibilità ambientale',
              'Competenze linguistiche',
              'Competenze tecniche',
              'Competenze trasversali / Soft skill',
            ].map((area) => (
              <span
                key={area}
                className="inline-block text-sm font-semibold px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(139,0,0,0.08)', color: '#8b0000', border: '1px solid rgba(139,0,0,0.2)' }}
              >
                {area}
              </span>
            ))}
          </div>

          {/* Nota legale */}
          <div
            className="rounded-2xl p-6 text-xs leading-relaxed text-justify"
            style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', color: '#6b7280' }}
          >
            <strong className="text-gray-700">Fonte e regime di aiuto</strong> — Le linee guida riportate
            fanno riferimento all&apos;Allegato A della DGR proposta n. 30 — Quarta Edizione Formazione
            Continua, PR Lombardia FSE+ 2021-2027, Priorità 1 Occupazione, Obiettivo ESO 4.4, Azione d.1.
            Il contributo è concesso ai sensi del Reg. (UE) n. 2831/2023 (de minimis), con un massimale
            cumulativo di € 300.000 per impresa nell&apos;arco di tre anni. Le agevolazioni non sono cumulabili
            con altri aiuti di Stato per le medesime spese.
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 px-4" style={{ backgroundColor: '#fef2f2', borderTop: '1px solid #fecaca' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-sans font-semibold text-sm uppercase tracking-widest mb-1" style={{ color: '#8b0000' }}>
              Vuoi essere informato sull&apos;apertura del bando?
            </p>
            <p className="text-gray-600 text-sm">
              Scrivici: ti avvisiamo non appena l&apos;avviso attuativo sarà pubblicato e i percorsi saranno disponibili.
            </p>
          </div>
          <a
            href="mailto:como@mestierilombardia.it"
            className="inline-block font-semibold text-sm px-6 py-3 rounded-xl text-white transition-all hover:brightness-110"
            style={{ backgroundColor: '#8b0000' }}
          >
            como@mestierilombardia.it
          </a>
        </div>
      </section>

    </main>
  )
}
