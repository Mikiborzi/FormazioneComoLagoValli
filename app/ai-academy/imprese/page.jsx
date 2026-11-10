import Link from "next/link";
import { Fraunces } from "next/font/google";
import FormSerataAi from "@/app/components/FormSerataAi";
import { SERATA_AI } from "@/app/lib/serataAi";

// AI Academy per le imprese: percorsi modulari su misura, laboratori di
// Starting Work, esempio "Concretamente AI" e serata di presentazione.
// Stessa identità visiva della pagina /ai-academy.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const INK = "#0b0b0c";
const PAPER = "#f4f1ea";
const CREAM = "#ece8e1";
const CLAY = "#c1440e";
const CLAY_LIGHT = "#d96a3f";
const SERIF = "var(--font-fraunces), Georgia, serif";

export const metadata = {
  title: "AI Academy per le imprese — Formazione AI su misura · Como",
  description:
    "Percorsi di formazione sull'intelligenza artificiale costruiti sui processi della tua azienda: modulari, in aula, nei laboratori di Starting Work a Como. Serata di presentazione gratuita venerdì 27 novembre alle 18:00.",
};

// ─── Dati ────────────────────────────────────────────────────────────────────

const navSezioni = [
  { label: "Flessibilità", href: "#flessibilita" },
  { label: "I moduli", href: "#moduli" },
  { label: "Un esempio", href: "#esempio" },
  { label: "Laboratori", href: "#laboratori" },
  { label: "Serata 27/11", href: "#serata" },
];

const flessibilita = [
  {
    titolo: "Durata e ritmo",
    corpo:
      "Percorsi brevi o più articolati, con il numero di incontri che serve. Uno o due a settimana, per avere il tempo di provare in ufficio quello che si è visto in aula.",
  },
  {
    titolo: "Orari compatibili con il lavoro",
    corpo:
      "In orario di lavoro oppure in fascia serale, per esempio dalle 17:00 alle 20:00: la formazione si adatta all'azienda, non il contrario.",
  },
  {
    titolo: "Sede",
    corpo:
      "Nei laboratori attrezzati di Starting Work a Como oppure direttamente nella vostra sede. Decidete voi.",
  },
  {
    titolo: "Contenuti sui vostri processi",
    corpo:
      "Si lavora su offerte, report, contratti, procedure, email a clienti e fornitori: i vostri. Niente casi da manuale.",
  },
];

const moduli = [
  {
    fase: "Capire",
    titolo: "Cos'è davvero l'AI oggi",
    corpo:
      "Cosa sa fare e cosa no, come si è evoluta, dove finisce la promessa e iniziano i risultati.",
    risultato: "Separare l'hype da ciò che serve alla vostra impresa.",
  },
  {
    fase: "Capire",
    titolo: "Parlare con l'AI",
    corpo:
      "Prompt design: come si chiede per avere risposte utili. L'AI come sparring partner per decidere su offerte, priorità, commesse.",
    risultato: "Risposte affidabili invece di testi generici.",
  },
  {
    fase: "Usare",
    titolo: "Scrivere, mostrare, automatizzare",
    corpo:
      "Preventivi, relazioni, procedure, comunicazioni. Immagini e brevi video per presentare un progetto. I primi assistenti su misura.",
    risultato: "Ore di lavoro risparmiate ogni settimana, da subito.",
  },
  {
    fase: "Governare",
    titolo: "AI Act, dati e responsabilità",
    corpo:
      "Cosa prevede l'AI Act e cosa riguarda già una piccola impresa. Privacy, dati aziendali, responsabilità su ciò che l'AI produce.",
    risultato: "Sapere cosa si può fare, e cosa no.",
  },
  {
    fase: "Governare",
    titolo: "I numeri dell'azienda",
    corpo:
      "Margini, scostamenti e flussi di cassa letti e commentati con l'AI.",
    risultato: "Decisioni più rapide, su dati più chiari.",
  },
  {
    fase: "Costruire",
    titolo: "L'azienda agentica",
    corpo:
      "Dove l'AI entra nei processi: documenti, scadenze, pratiche, archivio. Gli agenti che lavorano al posto nostro.",
    risultato: "Una mappa di dove cominciare, nella vostra organizzazione.",
  },
];

const programmaEsempio = [
  { giorno: 1, fase: "Capire", titolo: "Overview, evoluzione, hype", corpo: "Cos'è davvero l'AI oggi, cosa sa fare e cosa no. Separare le promesse dai risultati." },
  { giorno: 2, fase: "Capire", titolo: "Prompt design e decisione", corpo: "Come si parla a un'AI per avere risposte utili. Usarla come sparring partner per decidere: offerte, priorità, scelte di commessa." },
  { giorno: 3, fase: "Usare", titolo: "Scrittura, immagini, agenti", corpo: "Preventivi, relazioni, procedure, email a clienti e fornitori. Immagini e brevi video per presentare un progetto." },
  { giorno: 4, fase: "Governare", titolo: "AI Act e compliance", corpo: "Cosa prevede l'AI Act e cosa riguarda già una piccola impresa. Dati, privacy, responsabilità. Poi i numeri: margini, scostamenti e flussi di cassa letti con l'AI." },
  { giorno: 5, fase: "Costruire", titolo: "Azienda agentica", corpo: "Dove l'AI entra nei processi di un'impresa o di uno studio: documenti, scadenze, pratiche, archivio. I primi agenti, e da dove partire." },
];

const risultati = [
  "usa l'AI in modo efficace sui documenti reali del proprio lavoro",
  "sa cosa può fare e cosa no secondo l'AI Act e la normativa sui dati",
  "sa leggere i numeri dell'azienda con l'AI: margini, flussi di cassa, scostamenti",
  "ha una mappa chiara di dove l'AI può entrare nell'organizzazione, e da dove cominciare",
];

const programmaSerata = [
  {
    titolo: "I percorsi",
    corpo: "Come costruiamo la formazione sull'AI per un'impresa: moduli, durate, formule.",
  },
  {
    titolo: "I laboratori",
    corpo: "Visita alle aule attrezzate di Starting Work, dove si prova l'AI con le mani.",
  },
  {
    titolo: "Le vostre domande",
    corpo: "Confronto con i docenti sulle esigenze concrete della vostra azienda.",
  },
];

// ─── Componenti ──────────────────────────────────────────────────────────────

function Eyebrow({ children, chiaro = false }) {
  return (
    <p
      className="font-sans text-xs font-semibold uppercase mb-4"
      style={{ letterSpacing: "0.16em", color: chiaro ? CLAY_LIGHT : CLAY }}
    >
      {children}
    </p>
  );
}

function Freccia() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function Bottone({ href, children, variante = "pieno", tema = "scuro" }) {
  const pieno = variante === "pieno";
  const classe =
    "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-full transition-all duration-200 hover:brightness-110";
  const stile = {
    backgroundColor: pieno ? CLAY : "transparent",
    color: pieno ? "#fff" : tema === "scuro" ? CREAM : INK,
    border: pieno ? "none" : `1px solid ${tema === "scuro" ? "rgba(236,232,225,0.35)" : "rgba(28,25,23,0.3)"}`,
    minHeight: "52px",
    padding: "0 1.9rem",
    fontSize: "16px",
  };
  if (href.startsWith("#")) {
    return <a href={href} className={classe} style={stile}>{children}<Freccia /></a>;
  }
  return <Link href={href} className={classe} style={stile}>{children}<Freccia /></Link>;
}

// ─── Pagina ──────────────────────────────────────────────────────────────────

export default function AiAcademyImpresePage() {
  return (
    <div className={fraunces.variable} style={{ backgroundColor: INK }}>
      {/* ── Sotto-navigazione ───────────────────────────────────────── */}
      <div
        className="sticky z-30 border-b"
        style={{
          top: "60px",
          backgroundColor: "rgba(11,11,12,0.92)",
          borderColor: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <Link href="/ai-academy" className="shrink-0">
            <img src="/ai-academy-logo.png" alt="AI Academy" className="h-7 sm:h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {navSezioni.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="font-sans text-sm transition-colors duration-200"
                style={{ color: "rgba(236,232,225,0.65)" }}
              >
                {s.label}
              </a>
            ))}
          </nav>
          <a
            href="#serata"
            className="font-sans text-sm font-semibold rounded-full px-4 py-2 shrink-0 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: CLAY, color: "#fff" }}
          >
            Prenota la serata
          </a>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-20 sm:py-28" style={{ backgroundColor: INK }}>
        <div
          className="absolute pointer-events-none rounded-full"
          aria-hidden="true"
          style={{
            width: "38rem",
            height: "38rem",
            top: "-14rem",
            right: "-12rem",
            background: `radial-gradient(circle, ${CLAY} 0%, rgba(193,68,14,0) 68%)`,
            opacity: 0.22,
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <Eyebrow chiaro>AI Academy per le imprese · Starting Work · Como</Eyebrow>

          <h1
            className="font-bold leading-[1.05] mb-7 text-4xl sm:text-5xl lg:text-6xl"
            style={{ fontFamily: SERIF, color: CREAM }}
          >
            L&apos;intelligenza artificiale, su misura per la tua azienda.
          </h1>

          <p className="font-sans text-lg sm:text-xl leading-relaxed mb-9 max-w-2xl" style={{ color: "rgba(236,232,225,0.75)" }}>
            Non un corso uguale per tutti: percorsi <strong style={{ color: CREAM }}>modulari</strong>,
            costruiti sui processi reali della tua impresa e da{" "}
            <strong style={{ color: CREAM }}>sperimentare concretamente</strong> nei
            laboratori attrezzati di Starting Work.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {["Percorsi su misura", "Moduli componibili", "In aula, fino a 10 persone", "Anche in orario serale"].map((t) => (
              <span
                key={t}
                className="font-sans text-sm rounded-full px-4 py-2"
                style={{
                  backgroundColor: "rgba(193,68,14,0.15)",
                  border: "1px solid rgba(193,68,14,0.3)",
                  color: CLAY_LIGHT,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Serata in evidenza */}
          <div
            className="rounded-2xl p-6 sm:p-8 max-w-2xl"
            style={{ backgroundColor: "rgba(236,232,225,0.05)", border: "1.5px solid rgba(217,106,63,0.55)" }}
          >
            <p className="font-sans text-xs font-semibold uppercase mb-2" style={{ letterSpacing: "0.14em", color: CLAY_LIGHT }}>
              Serata di presentazione · gratuita e aperta a tutti
            </p>
            <p className="font-bold text-2xl sm:text-3xl mb-3" style={{ fontFamily: SERIF, color: CREAM }}>
              {SERATA_AI.giorno}, ore {SERATA_AI.ora}
            </p>
            <p className="font-sans text-base leading-relaxed mb-6" style={{ color: "rgba(236,232,225,0.75)" }}>
              Da {SERATA_AI.luogo}, {SERATA_AI.indirizzo}. Ti presentiamo le
              opportunità formative di AI Academy e ti facciamo vedere i nostri
              laboratori.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Bottone href="#serata">Prenota il tuo posto</Bottone>
              <Bottone href="/formazione-impresa/contatto" variante="bordo">Richiedi una proposta</Bottone>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perché ora ──────────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:py-24" style={{ backgroundColor: PAPER }}>
        <div className="max-w-3xl mx-auto">
          <Eyebrow>Perché adesso</Eyebrow>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8" style={{ fontFamily: SERIF, color: "#1c1917" }}>
            Cavalcarla o subirla.
          </h2>
          <div className="flex flex-col gap-5 font-sans text-lg leading-relaxed" style={{ color: "#44403c" }}>
            <p>
              L&apos;intelligenza artificiale è già entrata nella tua azienda: nei
              software che usate, nelle email dei fornitori, nelle offerte dei
              concorrenti. La domanda vera non è più <em>se</em> adottarla, ma{" "}
              <strong style={{ color: "#1c1917" }}>come governarla</strong> prima che
              lo facciano gli altri.
            </p>
            <p>
              Per questo serve una formazione che parta da cosa fate ogni giorno, e
              che lasci alle persone strumenti da usare domani mattina, non teorie
              su cosa succederà tra dieci anni.
            </p>
          </div>
          <p
            className="font-bold text-2xl sm:text-3xl leading-snug mt-10 pl-6"
            style={{ fontFamily: SERIF, color: "#1c1917", borderLeft: `3px solid ${CLAY}` }}
          >
            Il rischio oggi non è sbagliare con l&apos;AI. È restare fermi mentre
            clienti, concorrenti e fornitori la usano già.
          </p>
        </div>
      </section>

      {/* ── Flessibilità ────────────────────────────────────────────── */}
      <section id="flessibilita" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: INK }}>
        <div className="max-w-5xl mx-auto">
          <Eyebrow chiaro>Flessibilità</Eyebrow>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 max-w-3xl" style={{ fontFamily: SERIF, color: CREAM }}>
            Ogni impresa ha la sua AI. Anche la formazione deve averla.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-12 max-w-3xl" style={{ color: "rgba(236,232,225,0.7)" }}>
            AI Academy risponde alle esigenze formative più diverse: dal titolare
            che vuole capire da dove partire al gruppo di lavoro che deve usare
            l&apos;AI ogni giorno. Concordiamo con ogni impresa un percorso dedicato.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {flessibilita.map((f) => (
              <div
                key={f.titolo}
                className="rounded-2xl p-7"
                style={{ backgroundColor: "rgba(236,232,225,0.04)", border: "1px solid rgba(236,232,225,0.12)" }}
              >
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: SERIF, color: CREAM }}>
                  {f.titolo}
                </h3>
                <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.68)" }}>
                  {f.corpo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approccio modulare ──────────────────────────────────────── */}
      <section id="moduli" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: INK, borderTop: "1px solid rgba(236,232,225,0.08)" }}>
        <div className="max-w-5xl mx-auto">
          <Eyebrow chiaro>Approccio modulare</Eyebrow>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 max-w-3xl" style={{ fontFamily: SERIF, color: CREAM }}>
            Capire, usare, governare, costruire.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-12 max-w-3xl" style={{ color: "rgba(236,232,225,0.7)" }}>
            I moduli sono mattoncini: si scelgono e si combinano in base agli
            obiettivi dell&apos;azienda e di chi partecipa. Ognuno lascia qualcosa
            di concreto da portare in ufficio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {moduli.map((m) => (
              <div
                key={m.titolo}
                className="rounded-2xl p-7 flex flex-col"
                style={{ backgroundColor: "rgba(236,232,225,0.04)", border: "1px solid rgba(236,232,225,0.12)" }}
              >
                <p className="font-sans text-xs font-semibold uppercase mb-3" style={{ letterSpacing: "0.14em", color: CLAY_LIGHT }}>
                  {m.fase}
                </p>
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: SERIF, color: CREAM }}>
                  {m.titolo}
                </h3>
                <p className="font-sans text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(236,232,225,0.65)" }}>
                  {m.corpo}
                </p>
                <p className="font-sans text-sm leading-relaxed pl-3" style={{ color: CREAM, borderLeft: `2px solid ${CLAY}` }}>
                  {m.risultato}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Esempio: Concretamente AI ───────────────────────────────── */}
      <section id="esempio" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: PAPER }}>
        <div className="max-w-4xl mx-auto">
          <Eyebrow>Un esempio di percorso</Eyebrow>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4" style={{ fontFamily: SERIF, color: "#1c1917" }}>
            Concretamente AI
          </h2>
          <p className="font-sans text-xl leading-relaxed mb-6" style={{ color: "#44403c" }}>
            Un percorso che trasforma la paura del nuovo in{" "}
            <strong style={{ color: "#1c1917" }}>vantaggio concreto</strong>.
          </p>
          <p className="font-sans text-lg leading-relaxed mb-10" style={{ color: "#44403c" }}>
            <strong style={{ color: "#1c1917" }}>15 ore in 5 incontri da 3 ore</strong>,
            in aula, per titolari, manager e collaboratori chiave: persone che non
            hanno tempo da perdere e vogliono capire cosa possono fare domani
            mattina. Al termine vengono consegnate le presentazioni in PDF.
          </p>

          <ol className="flex flex-col mb-12">
            {programmaEsempio.map((g, i) => (
              <li
                key={g.giorno}
                className="flex gap-5 sm:gap-7 py-6"
                style={{ borderTop: i === 0 ? "none" : "1px solid rgba(28,25,23,0.1)" }}
              >
                <span className="font-bold text-2xl sm:text-3xl leading-none shrink-0 pt-1" style={{ fontFamily: SERIF, color: CLAY, width: "2ch" }}>
                  {g.giorno}
                </span>
                <div>
                  <p className="font-sans text-xs font-semibold uppercase mb-1" style={{ letterSpacing: "0.14em", color: CLAY }}>
                    {g.fase} · 3 ore
                  </p>
                  <h3 className="font-bold text-xl sm:text-2xl mb-2" style={{ fontFamily: SERIF, color: "#1c1917" }}>
                    {g.titolo}
                  </h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "#57534e" }}>
                    {g.corpo}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-7" style={{ backgroundColor: "#fff", border: "1px solid rgba(28,25,23,0.1)" }}>
              <h3 className="font-bold text-xl mb-4" style={{ fontFamily: SERIF, color: "#1c1917" }}>
                Al termine, ogni partecipante:
              </h3>
              <ul className="flex flex-col gap-3">
                {risultati.map((r) => (
                  <li key={r} className="font-sans text-base leading-relaxed pl-4" style={{ color: "#44403c", borderLeft: `2px solid ${CLAY}` }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-7" style={{ backgroundColor: INK }}>
              <p className="font-sans text-xs font-semibold uppercase mb-3" style={{ letterSpacing: "0.14em", color: CLAY_LIGHT }}>
                AI Act · art. 4
              </p>
              <h3 className="font-bold text-xl mb-4" style={{ fontFamily: SERIF, color: CREAM }}>
                Alfabetizzazione in materia di AI.
              </h3>
              <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.75)" }}>
                L&apos;art. 4 del Regolamento (UE) 2024/1689 (AI Act) chiede alle
                imprese che usano sistemi di intelligenza artificiale di garantire
                un livello sufficiente di alfabetizzazione del proprio personale. Il
                percorso è{" "}
                <strong style={{ color: CREAM }}>una misura concreta e documentabile</strong>{" "}
                a sostegno di questo obbligo.
              </p>
            </div>
          </div>

          <p className="font-sans text-base leading-relaxed mt-10" style={{ color: "#57534e" }}>
            Concretamente AI è un punto di partenza, non un pacchetto chiuso:{" "}
            <strong style={{ color: "#1c1917" }}>durata, moduli, calendario e sede si concordano con ogni impresa</strong>,
            in base alle sue esigenze.
          </p>
        </div>
      </section>

      {/* ── Laboratori ──────────────────────────────────────────────── */}
      {/* TODO: aggiungere le foto dei laboratori Mac quando disponibili */}
      <section id="laboratori" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: INK }}>
        <div className="max-w-4xl mx-auto">
          <Eyebrow chiaro>I laboratori di Starting Work</Eyebrow>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6" style={{ fontFamily: SERIF, color: CREAM }}>
            L&apos;AI si impara usandola.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-10" style={{ color: "rgba(236,232,225,0.7)" }}>
            Le lezioni si svolgono nei laboratori attrezzati di Starting Work, a
            Como, con postazioni Mac: si provano gli strumenti in prima persona,
            sui casi della propria azienda.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { titolo: "Laboratori Mac", corpo: "Aule attrezzate dove l'AI non si guarda alla lavagna: si usa." },
              { titolo: "Gruppi piccoli", corpo: "Fino a 10 persone per aula: in dieci c'è confronto, in trenta si ascolta." },
              { titolo: "Rigorosamente in aula", corpo: "Niente lezioni online: si lavora insieme, con il docente accanto." },
            ].map((l) => (
              <div key={l.titolo} className="rounded-2xl p-6" style={{ backgroundColor: "rgba(236,232,225,0.04)", border: "1px solid rgba(236,232,225,0.12)" }}>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: SERIF, color: CREAM }}>{l.titolo}</h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(236,232,225,0.65)" }}>{l.corpo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Serata di presentazione + iscrizione ────────────────────── */}
      <section
        id="serata"
        className="px-5 py-16 sm:py-24 scroll-mt-32"
        style={{ backgroundColor: "#141210", borderTop: `3px solid ${CLAY}` }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Eyebrow chiaro>Serata di presentazione · ingresso gratuito</Eyebrow>
            <h2 className="font-bold text-3xl sm:text-4xl leading-tight mb-6" style={{ fontFamily: SERIF, color: CREAM }}>
              Vieni a conoscerci e a vedere i laboratori.
            </h2>
            <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: "rgba(236,232,225,0.05)", border: "1px solid rgba(236,232,225,0.12)" }}>
              <p className="font-sans text-lg font-semibold mb-1" style={{ color: CREAM }}>
                {SERATA_AI.giorno}
              </p>
              <p className="font-sans text-lg font-semibold mb-3" style={{ color: CLAY_LIGHT }}>
                ore {SERATA_AI.ora}
              </p>
              <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.7)" }}>
                {SERATA_AI.luogo}
                <br />
                {SERATA_AI.indirizzo}
              </p>
            </div>
            <p className="font-sans text-base leading-relaxed mb-6" style={{ color: "rgba(236,232,225,0.7)" }}>
              Aperta a chiunque sia interessato: imprenditori, professionisti,
              dipendenti, curiosi. Porta pure un collega.
            </p>
            <ul className="flex flex-col gap-4">
              {programmaSerata.map((p) => (
                <li key={p.titolo} className="pl-4" style={{ borderLeft: `2px solid ${CLAY}` }}>
                  <p className="font-sans text-base font-semibold" style={{ color: CREAM }}>{p.titolo}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(236,232,225,0.6)" }}>{p.corpo}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: INK, border: "1px solid rgba(236,232,225,0.12)" }}>
              <h3 className="font-bold text-2xl mb-2" style={{ fontFamily: SERIF, color: CREAM }}>
                Prenota il tuo posto
              </h3>
              <p className="font-sans text-sm mb-7" style={{ color: "rgba(236,232,225,0.55)" }}>
                Bastano un minuto e pochi dati: ci servono per organizzare la serata.
              </p>
              <FormSerataAi />
            </div>
          </div>
        </div>
      </section>

      {/* ── Proposta su misura ──────────────────────────────────────── */}
      <section className="px-5 py-16 sm:py-20" style={{ backgroundColor: PAPER }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-bold text-2xl sm:text-3xl leading-tight mb-5" style={{ fontFamily: SERIF, color: "#1c1917" }}>
            Preferisci parlarne subito?
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-8" style={{ color: "#44403c" }}>
            Raccontaci la tua azienda e cosa vorresti ottenere: ti proponiamo un
            percorso formativo dedicato, con durata, moduli e calendario su misura.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Bottone href="/formazione-impresa/contatto">Richiedi una proposta su misura</Bottone>
            <Bottone href="/ai-academy" variante="bordo" tema="chiaro">Il corso AI Academy (30 ore)</Bottone>
          </div>
        </div>
      </section>

      {/* ── Contatti ────────────────────────────────────────────────── */}
      <footer className="px-5 py-14" style={{ backgroundColor: "#000000" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="font-bold text-lg mb-3" style={{ fontFamily: SERIF, color: CREAM }}>
                Starting Work
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Piazzale Monte Santo 4
                <br />
                22100 Como
                <br />
                Ente di formazione accreditato da Regione Lombardia
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="tel:+390314490737" className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                Tel. 031 4490737
              </a>
              <a href="mailto:info@startingwork.it" className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                info@startingwork.it
              </a>
              <Link href="/ai-academy" className="font-sans text-sm mt-2 underline underline-offset-4" style={{ color: CLAY_LIGHT }}>
                ← Torna ad AI Academy
              </Link>
            </div>
          </div>
          <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="font-sans text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              Starting Work Impresa sociale S.r.l. — P.IVA/C.F. 03262210135 ·
              R.E.A. n. 304755 · Cap. Soc. Euro 25.000,00 i.v. · Codice univoco:
              M5UXCR1
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
