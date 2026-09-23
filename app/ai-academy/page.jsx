import Link from "next/link";
import { Fraunces } from "next/font/google";

// Identità visiva di AI Academy, ripresa dal sito del corso: fondo quasi nero,
// carta calda, accento terracotta, display serif Fraunces.
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

const SITO_CORSO = "https://sw-aiacademy.duckdns.org/";
const ARTICOLO_PROVINCIA =
  "https://sw-aiacademy.duckdns.org/press/LaProvincia_Articolo_26.png";

export const metadata = {
  title:
    "AI Academy — Corso AI per imprenditori, dirigenti, consulenti · Como",
  description:
    "Un corso di intelligenza artificiale per imprenditori che hanno già attraversato altre rivoluzioni. Non insegna a usare l'AI: insegna a scegliere il campo da gioco. Starting Work, Como.",
};

// ─── Dati ────────────────────────────────────────────────────────────────────

const navSezioni = [
  { label: "Programma e Investimento", href: "#programma" },
  { label: "I coach", href: "#squadra" },
  { label: "Preregistrazione", href: "#preregistrazione" },
  { label: "Area riservata", href: "/ai-academy/area-riservata" },
  { label: "Contatti", href: "#contatti" },
];

const destinatari = [
  {
    titolo: "Per chi guida un'azienda.",
    corpo:
      "Imprenditori, dirigenti, consulenti senior, partite IVA. Gente abituata a decidere, che ora ha davanti un cambiamento di tipo diverso: strutturale, non tecnologico. Si affronta ripensando il proprio lavoro, non rincorrendo l'ennesimo strumento.",
    punti: [
      "Hai esperienza, e proprio per questo senti che il terreno si sta spostando.",
      "Vuoi sapere dove sarà il tuo mestiere fra tre anni, non fra tre mesi.",
      "Sei pronto a rivedere l'azienda, non solo a digitalizzarla.",
    ],
  },
  {
    titolo: "Per chi porta una squadra.",
    corpo:
      "Hai 8–15 persone che devono confrontarsi con l'AI sul serio? Costruiamo un percorso su misura: stesso metodo, contenuti tarati sul tuo settore, sessioni nei tuoi orari — sempre 30 ore complessive, ma distribuite diversamente rispetto alle sette mezze giornate standard.",
    punti: [],
  },
];

const moduli = [
  {
    titolo: "Segnale e rumore.",
    corpo: "Dove siamo davvero, e cosa è solo fumo destinato a diradarsi.",
  },
  {
    titolo: "Tre rivoluzioni fa.",
    corpo:
      "Mac, web, mobile: cosa ci hanno insegnato — e perché stavolta quella lezione ti tradisce.",
  },
  {
    titolo: "Cosa è bolla, cosa è struttura.",
    corpo:
      "Ciò che esplode perché serve, contro ciò che esplode perché c'è capitale per gonfiarlo.",
  },
  {
    titolo: "Dall'ipotesi al prototipo.",
    corpo:
      "Come si pensa un'applicazione AI per la tua azienda: cosa si può fare oggi, e cosa no.",
  },
  {
    titolo: "L'azienda agentica.",
    corpo:
      "Ripensare i ruoli quando il software fa il lavoro cognitivo. Cosa sparisce, cosa nasce.",
  },
  {
    titolo: "Progettare l'azienda agentica.",
    corpo:
      "Come si compongono agenti autonomi in un'organizzazione che funziona: quali processi affidare loro, dove resta la decisione dell'umano, e dove — adesso — si crea il valore.",
  },
  {
    titolo: "La tua azienda agentica.",
    corpo:
      "L'ultima sessione la dedichi a progettare la tua: i tuoi processi, i tuoi agenti. Sintesi finale.",
  },
];

const coperture = [
  {
    profilo:
      "Liberi professionisti, lavoratori autonomi e imprese fino a 9 addetti",
    pubblica: "90%",
    contributo: "10%",
  },
  { profilo: "Imprese da 10 a 50 addetti", pubblica: "70%", contributo: "30%" },
  { profilo: "Imprese da 51 addetti in su", pubblica: "50%", contributo: "50%" },
];

const ammessi = [
  "Lavoratori dipendenti a tempo indeterminato o determinato (full/part-time)",
  "Soci-lavoratori di cooperative",
  "Titolari e soci di micro, piccole, medie e grandi imprese con sede in Lombardia",
  "Titolari di ditte individuali",
  "Lavoratori autonomi e liberi professionisti con domicilio fiscale in Lombardia",
];

const esclusi = [
  "Lavoratori con contratto intermittente o in somministrazione",
  "Tirocinanti e apprendisti con periodo formativo ancora in corso",
  "Collaboratori familiari dell'imprenditore",
  "Amministratori delegati e componenti del CdA",
  "Soggetti assenti per ferie, malattia o aspettativa al momento della formazione",
];

const coach = [
  {
    iniziali: "EP",
    nome: "Enrico Paracchini",
    ruolo: "La regia.",
    ospite: false,
    bio: [
      "Trentacinque anni in marketing e comunicazione, sette aziende fondate dal 1978 in settori diversi — pubblicità, multilevel, rete di winebar in franchising, immobiliare, videogame. Ha visto arrivare il personal computer, il web, il mobile, i social: ogni volta dalla parte di chi decide dove giocare, non di chi insegue lo strumento del momento. Sa riconoscere il tempo che separa una tecnologia che fa rumore da una che cambia davvero come si lavora, e non le confonde.",
      "Da tre anni insegna AI ad altri imprenditori, e la usa quotidianamente in produzione: progetta agenti, integra LLM nei flussi aziendali, costruisce sistemi che girano, non demo. Nel corso tiene la regia: conduce le sessioni e, con Fabio, quelle su organigramma e finanza. E riporta ogni discorso alla stessa domanda: cosa cambia, concretamente, nella tua azienda.",
    ],
    link: [
      { label: "Substack", href: "https://enricoparacchini.substack.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/enricoparacchini/" },
    ],
  },
  {
    iniziali: "MB",
    nome: "Michele Borzatta",
    ruolo: "L'operatore in tempo reale.",
    ospite: false,
    bio: [
      "Imprenditore ispirato dal modello dell'economia civile, socio fondatore e amministratore di Starting Work. Per oltre 25 anni direttore generale di imprese e servizi complessi, oggi consulente senior per la costruzione di modelli organizzativi di gestione e controllo e di sistemi integrati. Una rete relazionale lombarda che attraversa associazioni di categoria, imprese e terzo settore.",
      "Negli ultimi mesi sta usando l'AI in modo intensivo. Ha attivato un team di agenti Claude per i propri progetti, sta migrando l'infrastruttura su server proprio, e lo sta facendo applicando alla propria azienda lo stesso rigore con cui costruisce i modelli organizzativi dei suoi clienti.",
      "Nel corso porta una posizione rara: l'AI vista non dall'esterno, ma da chi la usa ogni giorno sotto vincolo di compliance, di responsabilità verso utenti reali, di sistemi di qualità che vanno mantenuti vivi e di un approccio etico che non è un orpello. Niente euforia, niente catastrofismo. Solo quello che funziona.",
    ],
    link: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/michele-borzatta-5a089149/",
      },
    ],
  },
  {
    iniziali: "FGM",
    nome: "Fabio Gino Merli",
    ruolo: "Lo specchio onesto.",
    ospite: false,
    bio: [
      "Oltre 25 anni come CFO e Direttore Generale in gruppi nazionali e internazionali, nei settori manifatturiero e dei servizi. Ha costruito e ristrutturato funzioni finance, gestito fasi di crescita e discontinuità in contesti complessi. Nel corso porta quello che i manuali non insegnano: la prospettiva di chi ha preso decisioni difficili dall'interno, non di chi le ha osservate dall'esterno. Si avvicina all'AI come si avvicina a qualsiasi strumento — con metodo, senza euforia, valutando cosa cambia davvero nella gestione di un'organizzazione e cosa invece rimane invariato.",
      "È la voce che tiene il corso ancorato alla realtà operativa. Conduce con Enrico le sessioni su amministrazione controllo e governo finanziario.",
    ],
    link: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/fabioginomerli/" },
    ],
  },
  {
    iniziali: "GMF",
    nome: "Gian Maria Fara",
    ruolo: "Il caso limite operativo.",
    ospite: true,
    bio: [
      "Già amministratore di una cooperativa, esperto di finanza e mondo crypto, in particolare DeFi (finanza decentralizzata). Educatore e formatore. Interviene in un modulo dedicato per portare un caso operativo concreto: gli smart contract come laboratorio funzionante di azienda agentica — agenti autonomi che eseguono logica finanziaria senza supervisione umana costante. Non crypto education — cosa funziona, cosa è esploso, cosa imparare.",
    ],
    link: [],
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

function BottonePreregistrazione({ etichetta = "Preregistrati e richiedi il voucher" }) {
  return (
    <Link
      href="/voucher-formazione-continua"
      className="inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-full transition-all duration-200 hover:brightness-110"
      style={{
        backgroundColor: CLAY,
        color: "#fff",
        minHeight: "52px",
        padding: "0 1.9rem",
        fontSize: "16px",
      }}
    >
      {etichetta}
      <Freccia />
    </Link>
  );
}

function BottoneGilberto({ variante = "pieno" }) {
  const pieno = variante === "pieno";
  return (
    <a
      href={SITO_CORSO}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-full transition-all duration-200 hover:brightness-110"
      style={{
        backgroundColor: pieno ? CLAY : "transparent",
        color: pieno ? "#fff" : CREAM,
        border: pieno ? "none" : `1px solid rgba(236,232,225,0.35)`,
        minHeight: "52px",
        padding: "0 1.9rem",
        fontSize: "16px",
      }}
    >
      Parla con Gilberto
      <Freccia />
    </a>
  );
}

// ─── Pagina ──────────────────────────────────────────────────────────────────

export default function AiAcademyPage() {
  return (
    <div className={fraunces.variable} style={{ backgroundColor: INK }}>
      {/* ── Sotto-navigazione della sezione ─────────────────────────── */}
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
          <img
            src="/ai-academy-logo.png"
            alt="AI Academy"
            className="h-7 sm:h-8 w-auto shrink-0"
          />
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
          <Link
            href="/voucher-formazione-continua"
            className="font-sans text-sm font-semibold rounded-full px-4 py-2 shrink-0 transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: CLAY, color: "#fff" }}
          >
            Preregistrati
          </Link>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 py-20 sm:py-28"
        style={{ backgroundColor: INK }}
      >
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
          <Eyebrow chiaro>Starting Work · Como · massimo 10 posti per edizione</Eyebrow>

          <h1
            className="font-bold leading-[1.05] mb-7 text-4xl sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
          >
            Il campo da gioco è cambiato.
          </h1>

          <p
            className="font-sans text-lg sm:text-xl leading-relaxed mb-6 max-w-2xl"
            style={{ color: "rgba(236,232,225,0.75)" }}
          >
            Un corso AI per chi ha già attraversato altre rivoluzioni —
            imprenditori, dirigenti, professionisti — e intuisce che questa non
            si gioca con le stesse regole.
          </p>

          <p className="font-sans text-base mb-9" style={{ color: "rgba(236,232,225,0.5)" }}>
            Aperto anche a dipendenti e partite IVA.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {["Massimo 10 posti per edizione", "Rigorosamente in aula", "30 ore su 7 incontri"].map((t) => (
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

          <div
            className="rounded-2xl p-6 sm:p-7 max-w-2xl"
            style={{
              backgroundColor: "rgba(236,232,225,0.04)",
              border: "1px solid rgba(236,232,225,0.12)",
            }}
          >
            <p className="font-sans text-base leading-relaxed mb-5" style={{ color: "rgba(236,232,225,0.8)" }}>
              Pochi e selezionati, per garantire l&apos;intensità e la qualità
              che solo un gruppo ristretto rende possibili. Prima di scegliere il
              campo, parla con chi lo conosce:{" "}
              <strong style={{ color: CREAM }}>
                Gilberto non ti vende il corso, ti aiuta a capire se serve a te.
              </strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <BottonePreregistrazione />
              <BottoneGilberto variante="bordo" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Il terreno si è mosso ───────────────────────────────────── */}
      <section className="px-5 py-16 sm:py-24" style={{ backgroundColor: PAPER }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#1c1917" }}
          >
            Decidere è sempre stato il tuo mestiere.
          </h2>

          <div className="flex flex-col gap-5 font-sans text-lg leading-relaxed" style={{ color: "#44403c" }}>
            <p>
              Leggere il contesto, scegliere, muovere persone. Lo fai da anni, e
              lo fai bene.
            </p>
            <p>
              Poi, negli ultimi diciotto mesi, si è mosso{" "}
              <strong style={{ color: "#1c1917" }}>il terreno</strong>. Non gli
              strumenti: il terreno. Quello con cui lavori ormai lo definisce
              l&apos;Intelligenza Artificiale — e cambia ogni dodici settimane.
              Più in fretta di quanto un&apos;azienda sappia adattarsi.
            </p>
            <p>
              E qui c&apos;è <strong style={{ color: "#1c1917" }}>la trappola</strong>.
              La stessa esperienza che ti ha sempre protetto, questa volta
              rischia di rallentarti: le rivoluzioni che hai attraversato ti
              hanno insegnato una regola — arriva lo strumento nuovo, lo impari,
              sopravvivi. Questa volta non tiene.
            </p>
          </div>

          <p
            className="font-bold text-2xl sm:text-3xl leading-snug my-10 pl-6"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              color: "#1c1917",
              borderLeft: `3px solid ${CLAY}`,
            }}
          >
            Saper usare uno strumento era il mestiere di ieri. Oggi lo strumento
            lo costruisci tu.
          </p>

          <div className="flex flex-col gap-5 font-sans text-lg leading-relaxed" style={{ color: "#44403c" }}>
            <p>
              Agenti AI costruiti per scopi specifici. È questo che si impara
              qui. E non in teoria: qui non studi un caso da manuale, lavori sul
              tuo business. Esci con la mappa della tua impresa ridisegnata
              intorno all&apos;AI e con il metodo per costruirla.
            </p>
            <p style={{ color: "#1c1917", fontWeight: 600 }}>
              Non è una tecnologia in più da imparare. È un altro modo di
              lavorare.
            </p>
          </div>
        </div>
      </section>

      {/* ── A chi si rivolge ────────────────────────────────────────── */}
      <section id="a-chi" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: INK }}>
        <div className="max-w-5xl mx-auto">
          <Eyebrow chiaro>A chi si rivolge</Eyebrow>
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 max-w-3xl"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
          >
            Per chi vuole attraversare il cambiamento, per non esserne travolto.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-4 max-w-3xl" style={{ color: "rgba(236,232,225,0.7)" }}>
            È un cambiamento epocale, e arriva comunque. La differenza tra chi lo
            attraversa e chi ne viene travolto non è l&apos;esperienza — quella,
            da sola, può perfino rallentarti. È{" "}
            <strong style={{ color: CREAM }}>conoscenza</strong>, è{" "}
            <strong style={{ color: CREAM }}>metodo</strong>. E averli per tempo.
          </p>
          <p className="font-sans text-base mb-12 max-w-3xl" style={{ color: "rgba(236,232,225,0.5)" }}>
            Due percorsi, lo stesso metodo. Uno per chi decide da solo, uno per
            chi porta con sé la sua squadra.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinatari.map((d) => (
              <div
                key={d.titolo}
                className="rounded-2xl p-7 sm:p-8 flex flex-col"
                style={{
                  backgroundColor: "rgba(236,232,225,0.04)",
                  border: "1px solid rgba(236,232,225,0.12)",
                }}
              >
                <h3
                  className="font-bold text-xl sm:text-2xl mb-4"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
                >
                  {d.titolo}
                </h3>
                <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.68)" }}>
                  {d.corpo}
                </p>
                {d.punti.length > 0 && (
                  <ul className="flex flex-col gap-3 mt-6">
                    {d.punti.map((p) => (
                      <li
                        key={p}
                        className="font-sans text-sm leading-relaxed pl-4"
                        style={{ color: "rgba(236,232,225,0.8)", borderLeft: `2px solid ${CLAY}` }}
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programma ───────────────────────────────────────────────── */}
      <section id="programma" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: INK }}>
        <div className="max-w-4xl mx-auto">
          <Eyebrow chiaro>Il programma</Eyebrow>
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
          >
            Sette incontri. Una traiettoria.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-3" style={{ color: "rgba(236,232,225,0.7)" }}>
            <strong style={{ color: CREAM }}>30 ore d&apos;aula distribuite su
            sette incontri</strong>, in mezze giornate. Si parte dalla mappa del
            fenomeno e si arriva a progettare qualcosa di tuo: ogni tappa poggia
            sulla precedente.
          </p>
          <p className="font-sans text-base mb-12" style={{ color: "rgba(236,232,225,0.5)" }}>
            Due mezze giornate a settimana — non un seminario di tre giorni. Tra
            una sessione e l&apos;altra provi in azienda, e torni con domande
            vere.
          </p>

          {/* Le tappe sono numerate perché l'ordine è parte del metodo */}
          <ol className="flex flex-col">
            {moduli.map((m, i) => (
              <li
                key={m.titolo}
                className="flex gap-5 sm:gap-7 py-6"
                style={{ borderTop: i === 0 ? "none" : "1px solid rgba(236,232,225,0.1)" }}
              >
                <span
                  className="font-bold text-2xl sm:text-3xl leading-none shrink-0 pt-1"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CLAY_LIGHT, width: "2ch" }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3
                    className="font-bold text-xl sm:text-2xl mb-2"
                    style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
                  >
                    {m.titolo}
                  </h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.65)" }}>
                    {m.corpo}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Investimento */}
          <div
            className="rounded-2xl p-7 sm:p-9 mt-14"
            style={{ backgroundColor: "rgba(236,232,225,0.05)", border: `1px solid rgba(193,68,14,0.35)` }}
          >
            <h3
              className="font-bold text-2xl sm:text-3xl mb-4"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
            >
              Investimento.
            </h3>
            <p className="font-sans text-3xl sm:text-4xl font-bold mb-4" style={{ color: CLAY_LIGHT }}>
              1.500 € <span className="text-lg font-normal">a partecipante</span>
            </p>
            <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.72)" }}>
              Comprende le <strong style={{ color: CREAM }}>30 ore d&apos;aula
              distribuite su sette incontri</strong>, i
              materiali, la <strong style={{ color: CREAM }}>call individuale di 60 minuti</strong>{" "}
              con un coach e l&apos;attestato di partecipazione Starting Work,
              accreditato dalla Regione Lombardia. Tutto incluso.
            </p>
          </div>

          {/* Voucher */}
          <div className="mt-8">
            <Eyebrow chiaro>Voucher Formazione Continua — Regione Lombardia</Eyebrow>
            <p className="font-sans text-base leading-relaxed mb-8" style={{ color: "rgba(236,232,225,0.68)" }}>
              Finanziato dal Programma Regionale Lombardia FSE+ 2021-2027
              (Obiettivo ESO 4.4), il voucher consente a lavoratori e imprese di
              finanziare percorsi di formazione continua selezionabili da un
              catalogo regionale di offerte accreditate.
            </p>

            <p className="font-sans text-sm font-semibold uppercase mb-4" style={{ letterSpacing: "0.1em", color: "rgba(236,232,225,0.5)" }}>
              Quota pubblica e cofinanziamento
            </p>
            <div className="flex flex-col gap-2.5 mb-10">
              {coperture.map((c) => (
                <div
                  key={c.profilo}
                  className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ backgroundColor: "rgba(236,232,225,0.04)", border: "1px solid rgba(236,232,225,0.1)" }}
                >
                  <span className="font-sans text-sm leading-snug" style={{ color: "rgba(236,232,225,0.75)" }}>
                    {c.profilo}
                  </span>
                  <span className="font-sans text-sm shrink-0 flex gap-4">
                    <span style={{ color: CLAY_LIGHT, fontWeight: 700 }}>
                      Quota pubblica {c.pubblica}
                    </span>
                    <span style={{ color: "rgba(236,232,225,0.5)" }}>
                      Tuo contributo {c.contributo}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <p className="font-sans text-sm font-semibold uppercase mb-5" style={{ letterSpacing: "0.1em", color: "rgba(236,232,225,0.5)" }}>
              Chi può accedere
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <p className="font-sans font-semibold text-sm mb-3" style={{ color: CREAM }}>
                  Destinatari della formazione
                </p>
                <ul className="flex flex-col gap-2.5">
                  {ammessi.map((a) => (
                    <li key={a} className="font-sans text-sm leading-snug flex gap-2.5" style={{ color: "rgba(236,232,225,0.7)" }}>
                      <span style={{ color: "#5fae7d" }} aria-hidden="true">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-sans font-semibold text-sm mb-3" style={{ color: CREAM }}>
                  Sono esclusi
                </p>
                <ul className="flex flex-col gap-2.5">
                  {esclusi.map((e) => (
                    <li key={e} className="font-sans text-sm leading-snug flex gap-2.5" style={{ color: "rgba(236,232,225,0.55)" }}>
                      <span style={{ color: "#c96a6a" }} aria-hidden="true">✗</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Come funziona il voucher */}
            <div className="mb-10">
              <p className="font-sans text-sm font-semibold uppercase mb-5" style={{ letterSpacing: "0.1em", color: "rgba(236,232,225,0.5)" }}>
                Come funziona il voucher, passo per passo
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { n: "1", t: "Manifesta l'interesse", d: "L'azienda si preregistra per il corso: raccogliamo insieme i dati necessari e verifichiamo la posizione dell'impresa e dei partecipanti." },
                  { n: "2", t: "Verifica i requisiti", d: "Prima di richiedere il voucher controlla che azienda, partecipanti e capienza rientrino nella misura. Se tutto è in ordine si passa alla domanda." },
                  { n: "3", t: "Richiedi il voucher", d: "L'azienda presenta la domanda a sportello sul portale Bandi e Servizi di Regione Lombardia, indicando AI Academy come percorso a catalogo." },
                  { n: "4", t: "Frequenta il corso", d: "I partecipanti seguono il percorso in aula (almeno 75% delle ore). Le presenze si registrano a ogni incontro." },
                  { n: "5", t: "Paga la fattura", d: "L'azienda salda la fattura emessa da Starting Work per il corso frequentato. Il pagamento va documentato con tracciabilità." },
                  { n: "6", t: "Incassa il rimborso", d: "Con la fattura pagata e la quietanza, l'azienda rendiconta a Regione Lombardia: la quota pubblica del voucher viene erogata a rimborso." },
                ].map((s) => (
                  <div key={s.n} className="rounded-xl p-5" style={{ backgroundColor: "rgba(236,232,225,0.04)", border: "1px solid rgba(236,232,225,0.1)" }}>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-bold text-2xl" style={{ color: CLAY_LIGHT, fontFamily: "var(--font-fraunces), Georgia, serif" }}>{s.n}</span>
                      <p className="font-sans font-semibold text-sm" style={{ color: CREAM }}>{s.t}</p>
                    </div>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(236,232,225,0.65)" }}>{s.d}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-6 sm:p-7" style={{ backgroundColor: "rgba(95,174,125,0.08)", border: "1px solid rgba(95,174,125,0.25)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xl leading-none shrink-0" style={{ color: "#5fae7d" }} aria-hidden="true">✓</span>
                  <p className="font-sans font-semibold text-base" style={{ color: CREAM }}>
                    Se al momento della richiesta ci sono ancora risorse disponibili e l'azienda ha verificato di rispettare tutti i requisiti, Regione Lombardia riconosce quanto previsto.
                  </p>
                </div>
                <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: "rgba(236,232,225,0.75)" }}>
                  Il voucher non è un concorso: è una misura a sportello con criteri oggettivi.
                  Rispettati i requisiti e presentata la domanda con capienza ancora disponibile,
                  il contributo è dovuto.
                </p>
                <p className="font-sans text-sm font-semibold mb-3" style={{ color: CREAM }}>
                  Requisiti da verificare prima della domanda
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Ogni partecipante ha un rapporto di lavoro ammissibile (dipendente indeterminato o determinato, socio-lavoratore di cooperativa, titolare o socio d'impresa, autonomo o professionista con domicilio fiscale in Lombardia).",
                    "Nessun partecipante ha politiche attive incompatibili in corso.",
                    "L'azienda non ha superato il tetto annuo di € 50.000 e nessun collaboratore ha superato € 2.000 nell'anno solare.",
                    "L'impresa è profilata sul portale Bandi e Servizi con SPID/CIE/CNS del legale rappresentante o del delegato.",
                    "La domanda viene presentata a corso già caricato a catalogo e con almeno 72 ore di anticipo sull'avvio.",
                    "Documentazione pronta: Allegato A.1 (Domanda), A.2.a (De minimis), A.5 (Privacy) e, se applicabile, A.3 (Delega); bollo pagoPA da 16 €; documenti dei destinatari (COB, contratti, cedolini, iscrizioni INPS).",
                  ].map((r) => (
                    <li key={r} className="font-sans text-sm leading-snug flex gap-2.5" style={{ color: "rgba(236,232,225,0.75)" }}>
                      <span style={{ color: "#5fae7d" }} aria-hidden="true">✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-xs mt-5 leading-relaxed" style={{ color: "rgba(236,232,225,0.55)" }}>
                  Ti accompagniamo passo passo: nella{" "}
                  <Link href="/ai-academy/area-riservata" className="underline underline-offset-2 font-semibold" style={{ color: CLAY_LIGHT }}>
                    guida in area riservata
                  </Link>{" "}
                  trovi la checklist operativa completa e i modelli da usare.
                </p>
              </div>

              {/* Riferimenti normativi */}
              <div className="mt-6 rounded-2xl p-6 sm:p-7" style={{ backgroundColor: "rgba(236,232,225,0.03)", border: "1px solid rgba(236,232,225,0.08)" }}>
                <p className="font-sans text-sm font-semibold uppercase mb-4" style={{ letterSpacing: "0.1em", color: "rgba(236,232,225,0.5)" }}>
                  Riferimenti normativi
                </p>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm font-sans">
                  {[
                    {
                      k: "Avviso pubblico",
                      v: "Decreto Regione Lombardia n. 8809 del 1° luglio 2026 — Avviso Formazione Continua Fase VII.",
                    },
                    {
                      k: "Programma di finanziamento",
                      v: "Programma Regionale FSE+ 2021-2027 di Regione Lombardia — Priorità 4 «Occupazione», Obiettivo Specifico ESO 4.4.",
                    },
                    {
                      k: "Fonte europea",
                      v: "Regolamento (UE) 2021/1057 del Parlamento europeo e del Consiglio del 24 giugno 2021 (Fondo sociale europeo Plus — FSE+).",
                    },
                    {
                      k: "Regime di aiuto",
                      v: "Aiuti «de minimis» ex Regolamento (UE) 2023/2831 della Commissione del 13 dicembre 2023.",
                    },
                    {
                      k: "Modalità di presentazione",
                      v: "Procedura valutativa a sportello — art. 5, comma 3, del D.lgs. 31 marzo 1998, n. 123.",
                    },
                    {
                      k: "Catalogo dell'offerta formativa",
                      v: "Catalogo Formazione Continua 2026 di Regione Lombardia — AI Academy è iscritta con codice 17257.",
                    },
                    {
                      k: "Portale per la domanda",
                      v: "Bandi e Servizi di Regione Lombardia — bandi.regione.lombardia.it — accesso con SPID, CIE o CNS.",
                    },
                    {
                      k: "Accreditamento dell'ente",
                      v: "Starting Work — operatore accreditato ai servizi di formazione da Regione Lombardia (sezione B, Albo n. 1363 del 20 luglio 2023).",
                    },
                  ].map((r) => (
                    <div key={r.k}>
                      <dt className="font-semibold mb-1" style={{ color: CREAM }}>{r.k}</dt>
                      <dd style={{ color: "rgba(236,232,225,0.65)" }}>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Preregistrazione: è il punto di conversione della pagina */}
            <div
              id="preregistrazione"
              className="rounded-2xl p-7 sm:p-9 scroll-mt-32"
              style={{ backgroundColor: CLAY, border: `1px solid ${CLAY_LIGHT}` }}
            >
              <h3
                className="font-bold text-2xl sm:text-3xl mb-4"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#fff" }}
              >
                Prenota per essere tra i primi.
              </h3>
              <p className="font-sans text-base leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.85)" }}>
                Vuoi partecipare al corso e finanziarlo con il voucher
                Formazione Continua? Compila la preregistrazione: registri
                l&apos;azienda e i partecipanti, e ti seguiamo noi nella
                richiesta del voucher a Regione Lombardia. I posti sono al
                massimo dieci per edizione.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  href="/voucher-formazione-continua"
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-full transition-all duration-200 hover:brightness-105"
                  style={{ backgroundColor: "#fff", color: CLAY, minHeight: "52px", padding: "0 1.9rem" }}
                >
                  Preregistrati
                  <Freccia />
                </Link>
                <BottoneGilberto variante="bordo" />
              </div>
              <p className="font-sans text-sm mt-6" style={{ color: "rgba(255,255,255,0.8)" }}>
                Ti sei già registrato?{" "}
                <Link
                  href="/ai-academy/area-riservata"
                  className="underline underline-offset-4 font-semibold"
                  style={{ color: "#fff" }}
                >
                  Entra nell&apos;area riservata
                </Link>{" "}
                e trovi la guida passo passo per richiedere il voucher.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── I coach ─────────────────────────────────────────────────── */}
      <section id="squadra" className="px-5 py-16 sm:py-24 scroll-mt-32" style={{ backgroundColor: PAPER }}>
        <div className="max-w-4xl mx-auto">
          <Eyebrow>I coach</Eyebrow>
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#1c1917" }}
          >
            Quattro voci complementari, per un corso potenziato.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-3" style={{ color: "#44403c" }}>
            Non ci siamo messi insieme per il corso: ci conosciamo da anni e il
            tema lo viviamo ogni giorno, ognuno dal suo angolo. È proprio questa
            la ricchezza: qualunque sia il tuo punto di partenza, c&apos;è almeno
            una di queste posizioni in cui ti riconoscerai, e da lì capirai dove
            vuoi arrivare.
          </p>
          <p className="font-sans text-base mb-12" style={{ color: "#78716c" }}>
            Dell&apos;AI non parliamo da fuori. La usiamo, ognuno a un livello
            diverso.
          </p>

          <div className="flex flex-col gap-10">
            {coach.map((c) => (
              <article key={c.nome} className="flex flex-col sm:flex-row gap-6">
                <div
                  className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: INK }}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CLAY_LIGHT }}
                  >
                    {c.iniziali}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3
                      className="font-bold text-xl sm:text-2xl"
                      style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#1c1917" }}
                    >
                      {c.nome}
                    </h3>
                    {c.ospite && (
                      <span
                        className="font-sans text-xs font-semibold uppercase rounded-full px-3 py-1"
                        style={{ letterSpacing: "0.1em", backgroundColor: "rgba(193,68,14,0.12)", color: CLAY }}
                      >
                        ospite
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm font-semibold mb-4" style={{ color: CLAY }}>
                    {c.ruolo}
                  </p>
                  <div className="flex flex-col gap-3">
                    {c.bio.map((p, i) => (
                      <p key={i} className="font-sans text-base leading-relaxed" style={{ color: "#44403c" }}>
                        {p}
                      </p>
                    ))}
                  </div>
                  {c.link.length > 0 && (
                    <div className="flex gap-4 mt-4">
                      {c.link.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                          style={{ color: CLAY }}
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gilberto ────────────────────────────────────────────────── */}
      <section id="gilberto" className="px-5 py-16 sm:py-24 text-center scroll-mt-32" style={{ backgroundColor: INK }}>
        <div className="max-w-2xl mx-auto">
          <Eyebrow chiaro>Un agente, non un chatbot</Eyebrow>
          <h2
            className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-7"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
          >
            Gilberto conosce il campo.
          </h2>
          <div className="flex flex-col gap-5 font-sans text-base sm:text-lg leading-relaxed mb-9" style={{ color: "rgba(236,232,225,0.7)" }}>
            <p>
              Gilberto è un agente AI: conosce il corso, i coach, le date, i
              contenuti. Soprattutto conosce il terreno — e ti dice con
              franchezza se AI Academy è il campo giusto per te, o se conviene
              prima sentirci via email.
            </p>
            <p>
              Chiedigli quello che vuoi, anche le cose che non hai voglia di
              chiedere a una persona.{" "}
              <strong style={{ color: CREAM }}>Nessuna pressione</strong>: se la
              conversazione porta da qualche parte, prende il tuo contatto e ti
              scriviamo noi.
            </p>
            <p>
              Un dettaglio non secondario: Gilberto non è un chatbot da brochure,
              è un agente costruito per lavorare davvero — lo stesso tipo di cosa
              che imparerai a progettare nel corso.{" "}
              <strong style={{ color: CREAM }}>
                Parlarci è già un assaggio del metodo.
              </strong>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BottoneGilberto />
            <BottonePreregistrazione etichetta="Preregistrati al corso" />
          </div>
        </div>
      </section>

      {/* ── Starting Work ───────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:py-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-bold text-2xl sm:text-3xl leading-tight mb-5"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: "#1c1917" }}
          >
            AI Academy è un corso di Starting Work.
          </h2>
          <p className="font-sans text-lg leading-relaxed mb-7" style={{ color: "#44403c" }}>
            Starting Work è un Istituto Superiore di formazione accreditato
            presso la Regione Lombardia.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <a
              href="https://www.startingwork.it/chi-siamo/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: CLAY }}
            >
              Scopri di più su Starting Work →
            </a>
            <a
              href={ARTICOLO_PROVINCIA}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-base transition-opacity hover:opacity-70"
              style={{ color: "#78716c" }}
            >
              Ne ha parlato La Provincia di Como. Leggi l&apos;articolo →
            </a>
          </div>
        </div>
      </section>

      {/* ── Contatti ────────────────────────────────────────────────── */}
      <footer id="contatti" className="px-5 py-14 scroll-mt-32" style={{ backgroundColor: "#000000" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <p
                className="font-bold text-lg mb-3"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
              >
                Starting Work
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Piazzale Montesanto 4
                <br />
                22100 Como
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+390314490737"
                className="font-sans text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Tel. 031 4490737
              </a>
              <a
                href="mailto:info@startingwork.it"
                className="font-sans text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                info@startingwork.it
              </a>
              <Link
                href="/"
                className="font-sans text-sm mt-2 underline underline-offset-4"
                style={{ color: CLAY_LIGHT }}
              >
                ← Torna a Formazione Como Lago e Valli
              </Link>
            </div>
          </div>

          <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="font-sans text-xs leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              Starting Work Impresa sociale S.r.l. — P.IVA/C.F. 03262210135 ·
              R.E.A. n. 304755 · Cap. Soc. Euro 25.000,00 i.v. · Codice univoco:
              M5UXCR1
            </p>
            <p className="font-sans text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} AI Academy · Progetto Enrico
              Paracchini + Starting Work
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
