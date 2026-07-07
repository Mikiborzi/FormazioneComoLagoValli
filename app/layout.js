import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

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
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
