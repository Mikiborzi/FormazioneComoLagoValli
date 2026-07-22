import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import HydrationBeacon from "./components/HydrationBeacon";

// Scritto in ES5: non passa dal compilatore, quindi deve poter girare anche sul
// browser che non riesce ad avviare il bundle principale.
const CONTROLLO_AVVIO = `(function(){
  var mostrato = false;
  function mostra(){
    if (mostrato) return;
    if (document.documentElement.getAttribute('data-hydrated') === '1') return;
    var el = document.getElementById('avviso-browser');
    if (!el) return;
    el.style.display = 'block';
    mostrato = true;
  }
  window.addEventListener('error', function(){ setTimeout(mostra, 1500); }, true);
  setTimeout(mostra, 8000);
})();`;

const AVVISO_BROWSER = (
  <>
    Questo sito non è riuscito ad avviarsi sul tuo browser: i pulsanti e i moduli
    di iscrizione potrebbero non rispondere. Aggiorna il browser (Safari 16 o
    successivi, oppure Chrome o Firefox aggiornati) o contattaci: scrivi a{" "}
    <a href="mailto:como@mestierilombardia.it" style={{ color: "#7a3b00", fontWeight: 700 }}>
      como@mestierilombardia.it
    </a>{" "}
    o chiama lo{" "}
    <a href="tel:+390318123796" style={{ color: "#7a3b00", fontWeight: 700 }}>
      031 8123796
    </a>
    : completiamo noi l&apos;iscrizione con te.
  </>
);

const stileAvviso = {
  background: "#fef3c7",
  borderBottom: "2px solid #f59e0b",
  color: "#7a3b00",
  padding: "12px 16px",
  fontSize: "15px",
  lineHeight: 1.5,
  textAlign: "center",
};

const playfairDisplay = Playfair_Display({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  verification: {
    google: "GjLAX1NWAvDUR51ZzWsNQwJsZFAQBCoP0oNoz_TjxjY",
  },
  title:
    "Formazione Como Lago e Valli – Formazione Continua · voucher Regione Lombardia",
  description:
    "Corsi di formazione finanziati dai voucher di Regione Lombardia per la Formazione Continua (FSE+ 2021-2027). Per imprese, professionisti e lavoratori autonomi che vogliono formare i propri collaboratori. Ente accreditato: i nostri corsi sono nel catalogo regionale. Sportello domande dal 13 luglio 2026.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="it"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <div style={stileAvviso}>{AVVISO_BROWSER}</div>
        </noscript>
        <div id="avviso-browser" style={{ ...stileAvviso, display: "none" }}>
          {AVVISO_BROWSER}
        </div>
        <script dangerouslySetInnerHTML={{ __html: CONTROLLO_AVVIO }} />
        <HydrationBeacon />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
