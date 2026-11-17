import Link from "next/link";
import FormSerataOpen from "@/app/components/FormSerataOpen";
import { SERATA_AI, TESTI_SERATA } from "@/app/lib/serataAi";

// Pagina della serata AI Academy Open (giovedì 26 novembre).
// Linea grafica aia-* (app/aia.css). È la pagina linkata dagli inviti email:
// /ai-academy/serata#prenota porta direttamente al modulo.

export const metadata = {
  title: `AI Academy Open — Serata gratuita sull'AI · ${SERATA_AI.dataBreve} · Como`,
  description: `${SERATA_AI.giorno} alle ${SERATA_AI.ora} da ${SERATA_AI.luogo} a Como: una serata gratuita per capire cosa può fare l'AI per il tuo lavoro e cosa chiede l'AI Act. Posti limitati, prenotazione obbligatoria.`,
  alternates: { canonical: "/ai-academy/serata" },
};

const programma = [
  { ora: "18:00", colore: "viola", titolo: "Si entra.", testo: "Accoglienza e posti in aula." },
  {
    ora: "18:15",
    colore: "magenta",
    titolo: "Quello che ti preoccupa.",
    testo:
      "Dal telefono, in forma anonima, scrivi cosa ti preoccupa dell'AI. Le domande arrivano sullo schermo e i docenti rispondono davanti a tutti. Nessuna domanda è fuori luogo.",
  },
  {
    ora: "18:50",
    colore: "rosso",
    titolo: "L'art. 4 in dieci minuti.",
    testo: "Cosa chiede l'AI Act alle imprese sulla formazione del personale e come si documenta.",
  },
  {
    ora: "19:00",
    colore: "arancio",
    titolo: "I docenti e il metodo.",
    testo: "Visita ai laboratori e dialogo con chi insegna: il metodo lo scopri parlandoci.",
  },
  { ora: "19:30", colore: "oro", titolo: "Aperitivo.", testo: "Le conversazioni migliori cominciano qui." },
];

const docenti = [
  {
    iniziali: "SA",
    colore: "viola",
    nome: "Stefano Alborghetti",
    ruolo: "Presidente e socio fondatore di Starting Work",
    bio: "Ha fondato Starting Work, l’ente di formazione accreditato da Regione Lombardia che ospita AI Academy. Guida un istituto che forma giovani, imprese e lavoratori in cerca di ricollocazione, con un indirizzo storico in grafica, multimedia, comunicazione e marketing. Per lui l’intelligenza artificiale è il passaggio naturale di quel percorso.",
    citazione:
      "«Ci teniamo che il tessuto imprenditoriale del territorio non arrivi in ritardo e che le competenze restino a chi lavora ogni giorno nelle nostre aziende.»",
  },
  {
    iniziali: "EP",
    colore: "magenta",
    nome: "Enrico Paracchini",
    ruolo: "Ideatore dei percorsi di AI Academy, docente",
    bio: "Oltre trent’anni tra marketing, comunicazione e sviluppo d’impresa, e diverse aziende fondate in settori diversi. Usa l’intelligenza artificiale ogni giorno e da anni la insegna a imprenditori e professionisti. Ha ideato i percorsi di AI Academy con Michele e Fabio. In aula lavora sul cambio di prospettiva, prima che sugli strumenti.",
    citazione:
      "«Il nostro non è un messaggio da entusiasti né da catastrofisti: si tratta di conoscere per scegliere.»",
  },
  {
    iniziali: "MB",
    colore: "rosso",
    nome: "Michele Borzatta",
    ruolo: "Socio fondatore di Starting Work, docente",
    bio: "Specialista di sistemi organizzativi, ha fondato Starting Work insieme a Stefano Alborghetti. Usa l’intelligenza artificiale ogni giorno e ha già messo al lavoro i primi agenti. Ha ideato i percorsi di AI Academy con Enrico e Fabio. In aula porta il punto di vista di chi l’intelligenza artificiale la fa entrare in un’organizzazione.",
    citazione:
      "«Tutti cercano di correre con o dietro l’intelligenza artificiale, ma in pochi hanno le scarpe e molti corrono scalzi.»",
  },
  {
    iniziali: "FM",
    colore: "arancio",
    nome: "Fabio Gino Merli",
    ruolo: "Ex CFO e direttore generale, docente",
    bio: "Ha passato molti anni come CFO in grandi gruppi multinazionali, fino alla direzione generale. Ha ideato i percorsi di AI Academy con Enrico e Michele, e in aula insegna gestione economico-finanziaria e controllo di gestione con l’intelligenza artificiale. Fa le domande che farebbe un imprenditore: quelle concrete.",
    citazione:
      "«Il controllo di gestione è uno dei terreni dove l’intelligenza artificiale, se la si conosce, può fare la differenza.»",
  },
];

const colore = (nome) => ({ "--aia-colore": `var(--aia-${nome})` });

export default function SerataAiAcademyOpen() {
  return (
    <main className="aia-pagina">
      <section className="aia-sezione aia-sfondo aia-apertura">
        <div className="aia-contenitore">
          <Link href="/ai-academy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="aia-logo" src="/ai-academy-logo.png" alt="AI Academy" width={380} height={100} />
          </Link>
          <p className="aia-occhiello">{TESTI_SERATA.occhiello}</p>
          <h1 className="aia-titolo">{TESTI_SERATA.titolo}</h1>
          <div className="aia-barra" aria-hidden="true" />
          <p className="aia-sottotitolo">{TESTI_SERATA.frase}</p>
          <p className="aia-sottotitolo-2">Un aperitivo per incontrare la squadra e i programmi.</p>
          <div className="aia-azioni">
            <a className="aia-pulsante" href="#prenota">Prenota il tuo posto</a>
            <span className="aia-badge">{TESTI_SERATA.dressCode}</span>
          </div>
          <p className="aia-nota">
            Non serve sapere niente. Serve solo la voglia di capire. Anche se l&apos;AI un po&apos; ti spaventa.
          </p>
        </div>
      </section>

      <div className="aia-filo" aria-hidden="true" />

      <section className="aia-sezione">
        <div className="aia-contenitore aia-due-colonne">
          <h2 className="aia-titolo-sezione aia-su-chiaro">Chi sta decidendo, da te?</h2>
          <div className="aia-su-chiaro" style={{ color: "var(--aia-testo)" }}>
            <p className="aia-testo">
              Nella tua azienda qualcuno usa già l&apos;AI. Per una mail, un&apos;offerta, un riassunto.{" "}
              <strong>Nessuno l&apos;ha deciso: è successo.</strong>
            </p>
            <p className="aia-testo">
              Con quali documenti? Con quali regole? Con quali risultati? Se non lo sai, non è un problema di
              tecnologia. È che <strong>l&apos;AI la stanno usando tutti, tranne chi decide.</strong>
            </p>
            <p className="aia-testo">
              Questa serata è per chi non vuole restare a guardare. Non ti spieghiamo l&apos;intelligenza
              artificiale: <strong>ne parliamo insieme, come facciamo in aula.</strong> Poi tiri tu le conclusioni.
            </p>
          </div>
        </div>
      </section>

      <div className="aia-onda" aria-hidden="true">
        <div />
      </div>

      <section className="aia-sezione aia-sfondo-notte">
        <div className="aia-contenitore">
          <h2 className="aia-titolo-sezione">
            Novanta minuti,
            <br />
            zero slide da subire.
          </h2>
          <ol className="aia-programma">
            {programma.map((p) => (
              <li key={p.ora}>
                <span className="aia-programma__ora">{p.ora}</span>
                <div className="aia-programma__corpo" style={colore(p.colore)}>
                  <p className="aia-programma__titolo">{p.titolo}</p>
                  <p className="aia-programma__testo">{p.testo}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="aia-sezione">
        <div className="aia-contenitore">
          <h2 className="aia-titolo-sezione aia-su-chiaro">
            Due cose, anche se
            <br />
            non ci rivediamo più.
          </h2>
          <ul className="aia-punti">
            <li className="aia-punto" style={colore("viola")}>
              <span className="aia-punto__numero">1</span>
              <strong>Un&apos;idea precisa</strong> di cosa l&apos;AI può fare oggi per il tuo lavoro, e di cosa non
              può fare.
            </li>
            <li className="aia-punto" style={colore("rosso")}>
              <span className="aia-punto__numero">2</span>
              <strong>Una risposta chiara</strong> su cosa ti chiede la normativa, senza allarmismi e senza legalese.
            </li>
          </ul>
        </div>
      </section>

      <section className="aia-sezione aia-sfondo-blu">
        <div className="aia-contenitore aia-due-colonne aia-due-colonne--centro">
          <h2 className="aia-titolo-sezione">Non conta il ruolo. Conta la voglia di capire.</h2>
          <div>
            <p className="aia-testo">
              Imprenditori, manager, consulenti, professionisti, collaboratori. E chi non ha un titolo sul biglietto
              da visita, ma ha capito che qualcosa sta cambiando. L&apos;unico requisito è la curiosità.
            </p>
            <p className="aia-testo">
              <strong>Porta qualcuno con te.</strong> In due si vede di più, e il giorno dopo c&apos;è qualcuno con
              cui parlarne.
            </p>
          </div>
        </div>
      </section>

      <section className="aia-sezione">
        <div className="aia-contenitore">
          <h2 className="aia-titolo-sezione aia-su-chiaro">In aula, non sul palco.</h2>
          <ul className="aia-schede">
            {docenti.map((d) => (
              <li key={d.nome} className="aia-scheda" style={colore(d.colore)}>
                <div className="aia-scheda__testa">
                  <div className="aia-scheda__foto" aria-hidden="true">{d.iniziali}</div>
                  <div>
                    <p className="aia-scheda__nome">{d.nome}</p>
                    <p className="aia-scheda__ruolo">{d.ruolo}</p>
                  </div>
                </div>
                <p className="aia-scheda__bio">{d.bio}</p>
                <blockquote className="aia-scheda__citazione">{d.citazione}</blockquote>
              </li>
            ))}
          </ul>
          <div className="aia-promessa" style={{ marginTop: "6rem" }}>
            <h2 className="aia-titolo-sezione">Non è una televendita.</h2>
            <p className="aia-testo">
              Alla fine ti diremo come lavoriamo con le imprese. <strong>Cinque minuti, cronometrati.</strong> Il
              resto della serata è tuo.
            </p>
          </div>
        </div>
      </section>

      <section id="prenota" className="aia-sezione aia-sfondo" style={{ scrollMarginTop: "60px" }}>
        <div className="aia-contenitore aia-due-colonne aia-due-colonne--modulo">
          <div>
            <h2 className="aia-titolo-sezione">Posti limitati. Le nostre aule sono piccole per scelta.</h2>
            <div className="aia-barra" aria-hidden="true" style={{ maxWidth: "24rem" }} />
            <p className="aia-testo" style={{ marginTop: "2.25rem" }}>
              Lavoriamo in gruppi ridotti perché è l&apos;unico modo in cui la formazione funziona. Vale anche per
              questa serata.
            </p>
          </div>
          <div className="aia-riquadro-modulo">
            <FormSerataOpen />
          </div>
        </div>
      </section>

      <section className="aia-sezione">
        <div className="aia-contenitore">
          <div className="aia-barra aia-barra--corta" aria-hidden="true" style={{ marginTop: 0, marginBottom: "2.5rem" }} />
          <div className="aia-su-chiaro" style={{ color: "var(--aia-testo)" }}>
            <p className="aia-testo">
              <strong>
                {SERATA_AI.giorno}, dalle {SERATA_AI.ora} alle {SERATA_AI.oraFine}, poi aperitivo.
              </strong>{" "}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Starting+Work+Piazzale+Monte+Santo+4+Como"
                target="_blank"
                rel="noopener noreferrer"
              >
                Starting Work, Piazzale Monte Santo 4, Como.
              </a>{" "}
              Ingresso gratuito con prenotazione. Dress code: tante domande, le più scomode.
            </p>
          </div>
        </div>
      </section>

      <footer className="aia-footer">
        <div className="aia-contenitore">
          <p className="aia-footer__nome">Starting Work</p>
          <p style={{ margin: 0 }}>
            Piazzale Monte Santo 4
            <br />
            22100 Como
          </p>
          <p style={{ margin: "0.75rem 0 0" }}>
            <a href="tel:+390314490737">Tel. 031 4490737</a>
            <br />
            <a href="mailto:info@startingwork.it">info@startingwork.it</a>
          </p>
          <p className="aia-footer__piccolo">
            Starting Work Impresa sociale S.r.l.
            <br />
            P.IVA/C.F. 03262210135 · R.E.A. n. 304755 · Cap. Soc. Euro 25.000,00 i.v. · Codice univoco: M5UXCR1
          </p>
          <p className="aia-footer__piccolo" style={{ marginTop: "2rem" }}>
            © 2026 AI Academy · Progetto Enrico Paracchini + Starting Work
          </p>
        </div>
      </footer>
    </main>
  );
}
