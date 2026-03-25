import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Formazione Como Lago e Valli – Corsi gratuiti GOL",
  description:
    "Corsi di formazione gratuiti finanziati da Regione Lombardia e Unione Europea tramite il Programma GOL. Per disoccupati, inoccupati, casalinghe e studenti nella provincia di Como.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="it"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
