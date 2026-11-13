import Link from 'next/link'
import MobileNav from './MobileNav'
import NavbarAuth from './NavbarAuth'
import { PAGINA_SERATA, SERATA_AI, TESTI_SERATA } from '@/app/lib/serataAi'

const navItems = [
  { label: "Home", href: "/" },
  { label: "Chi Siamo", href: "/#chi-siamo" },
  { label: "Come Funziona", href: "/#come-funziona" },
  { label: "I Corsi", href: "/#corsi" },
  { label: "AI Academy", href: "/ai-academy" },
  { label: "Cerca Lavoro", href: "/servizi-lavoro" },
  { label: "Proponi un Corso", href: "/proponi-corso" },
  { label: "Contatti", href: "/#contatti" },
  { label: "Testimonianze", href: "/testimonianze" },
]

export default function SiteHeader() {
  return (
    <>
      {/* Barra della serata AI Academy Open, nello stile del kit AI Academy (app/aia-stile.css) */}
      <div className="w-full" style={{ backgroundColor: "var(--aia-blu)", fontFamily: "var(--aia-font)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`${PAGINA_SERATA}#prenota`}
            className="flex items-center justify-center py-2 text-center text-white text-xs sm:text-sm leading-tight"
          >
            <span>
              <strong style={{ fontWeight: 700 }}>AI Academy Open</strong>
              {" · "}{SERATA_AI.giornoSenzaAnno.toLowerCase()}, ore {SERATA_AI.ora}{" · "}{SERATA_AI.luogo}, Como{" · "}Ingresso gratuito{" · "}
              <strong style={{ fontWeight: 700, color: "var(--aia-giallo)", whiteSpace: "nowrap" }}>
                {TESTI_SERATA.pulsante} →
              </strong>
            </span>
          </Link>
        </div>
        <div className="aia-filo" aria-hidden="true" style={{ height: "3px" }} />
      </div>
      <header
        className="sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: "#1a2e5a", height: "60px" }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#c8941a" }}
            >
              <span className="text-white font-display font-bold text-xs leading-none">FC</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-display font-bold text-base">Formazione</div>
              <div className="font-sans font-medium text-xs uppercase tracking-widest" style={{ color: "#c8941a" }}>
                Como Lago e Valli
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/75 hover:text-white font-sans text-sm transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <NavbarAuth />
          <MobileNav />
        </div>
      </div>
      </header>
    </>
  )
}
