import Link from "next/link";
import QuoteCarousel from "./components/QuoteCarousel";
import MobileNav from "./components/MobileNav";
import NavbarAuth from "./components/NavbarAuth";
import { supabase } from "@/app/lib/supabase";

// ─── Data ────────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Home", href: "#" },
  { label: "Come Funziona", href: "#come-funziona" },
  { label: "I Corsi", href: "#corsi" },
  { label: "Testimonianze", href: "#testimonianze" },
  { label: "Proponi un Corso", href: "/proponi-corso" },
  { label: "Contatti", href: "#contatti" },
];

const courses = [
  {
    slug: "business-up",
    title: "Business UP!",
    hours: "50h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #0f766e 0%, #059669 100%)",
    abbr: "BU",
    desc: "Potenzia le tue competenze commerciali, economiche e imprenditoriali per fare il salto di qualità.",
  },
  {
    slug: "digital-marketing-ai",
    title: "Digital Marketing & AI",
    hours: "40h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)",
    abbr: "DM",
    desc: "Strumenti digitali, social media e intelligenza artificiale: le competenze che il mercato del lavoro chiede oggi.",
  },
  {
    slug: "giardinaggio-base",
    title: "Giardinaggio Base",
    hours: "50h",
    locations: "Solo Tremezzina",
    gradient: "linear-gradient(135deg, #15803d 0%, #65a30d 100%)",
    abbr: "GB",
    desc: "Tecniche di cura del verde, manutenzione del giardino e del paesaggio lacustre del Lario.",
  },
  {
    slug: "addetto-cucina",
    title: "Addetto di Cucina",
    hours: "50h + HACCP",
    locations: "Tremezzina",
    gradient: "linear-gradient(135deg, #c2410c 0%, #d97706 100%)",
    abbr: "AC",
    desc: "Preparazione, cottura e sicurezza alimentare: entra nel mondo della ristorazione con basi solide.",
  },
  {
    slug: "centralinista-receptionist",
    title: "Centralinista e Receptionist",
    hours: "40h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #0369a1 0%, #0891b2 100%)",
    abbr: "CR",
    desc: "Gestione accoglienza, telefonia e front office per strutture ricettive, hotel e aziende del territorio.",
  },
  {
    slug: "inglese-base",
    title: "Inglese Base",
    hours: "50h",
    locations: "Tremezzina + Como + Online",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)",
    abbr: "EN",
    desc: "Livello A1/A2 — Per chi parte da zero. Comunicazione quotidiana, grammatica essenziale, vocabolario base.",
  },
  {
    slug: "inglese-intermedio",
    title: "Inglese Intermedio",
    hours: "50h",
    locations: "Tremezzina + Como + Online",
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #6366f1 100%)",
    abbr: "EN",
    desc: "Livello B1/B2 — Per chi ha già una base. Conversazione professionale e strutture avanzate.",
  },
  {
    slug: "business-english",
    title: "Business English",
    hours: "50h",
    locations: "Tremezzina + Como + Online",
    gradient: "linear-gradient(135deg, #0a4a3a 0%, #1a6a5a 100%)",
    abbr: "BE",
    desc: "Livello B2/C1 — Inglese professionale avanzato. Parte del pacchetto Fatti Impresa.",
  },
  {
    slug: "tedesco-base",
    title: "Tedesco Base",
    hours: "50h",
    locations: "Tremezzina + Online",
    gradient: "linear-gradient(135deg, #3d1a5a 0%, #6d3a8a 100%)",
    abbr: "DE",
    desc: "Livello A1/A2 — Per chi parte da zero. Fondamentale per il turismo sul Lago di Como.",
  },
  {
    slug: "tedesco-intermedio",
    title: "Tedesco Intermedio",
    hours: "50h",
    locations: "Tremezzina + Online",
    gradient: "linear-gradient(135deg, #4d2a6a 0%, #9f1239 100%)",
    abbr: "DE",
    desc: "Livello B1/B2 — Conversazione professionale, clientela svizzero-tedesca e austriaca.",
  },
  {
    slug: "informatica-base",
    title: "Informatica Base",
    hours: "50h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #1a4a7a 0%, #2563eb 100%)",
    abbr: "IB",
    desc: "Per chi parte da zero. Sistema operativo, internet, email, Word, Excel, PowerPoint e sicurezza informatica base.",
  },
  {
    slug: "informatica-intermedio",
    title: "Informatica Intermedio",
    hours: "50h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #0a3a6a 0%, #1a4a9a 100%)",
    abbr: "II",
    desc: "Excel avanzato, Google Workspace, Microsoft 365, Teams e strumenti di collaborazione digitale per il lavoro.",
  },
  {
    slug: "intelligenza-artificiale",
    title: "Intelligenza Artificiale",
    hours: "40h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #2a1a6a 0%, #7c3aed 100%)",
    abbr: "AI",
    desc: "ChatGPT, Claude, Midjourney e strumenti AI pratici per lavorare meglio e più velocemente ogni giorno.",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    hours: "50h",
    locations: "Tremezzina + Como",
    gradient: "linear-gradient(135deg, #1a6a3a 0%, #16a34a 100%)",
    abbr: "MK",
    desc: "Social media, SEO, Google Ads, Meta Ads, email marketing e analytics: il percorso completo per il marketing digitale.",
  },
];

const reasons = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "È gratuito. Ma non è gratis.",
    body: "Ogni corso è finanziato da Regione Lombardia e dall'Unione Europea attraverso il Programma GOL. Nessuna tassa d'iscrizione, nessun costo nascosto. È un investimento pubblico sulla tua crescita — e vale la pena non sprecarlo.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Competenze reali, radicate nel territorio.",
    body: "I corsi non sono astratti: sono progettati attorno alle reali esigenze del mercato del lavoro di Como, del Lago e delle Valli. Giardinaggio sul Lario, ristorazione locale, accoglienza turistica — quello che impari qui, lo usi qui.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Non sei solo: ti affianchiamo dall'inizio.",
    body: "Mestieri Lombardia – Starting Work è con te prima, durante e dopo il corso: orientamento, supporto all'iscrizione, tutoraggio e accompagnamento al lavoro. Non ti lasciamo con un attestato in mano senza sapere cosa farne.",
  },
];

const testimonials = [
  {
    name: "Giulia T.",
    age: "34 anni, Como",
    course: "Digital Marketing & AI",
    stars: 5,
    text: "Non avevo mai lavorato nel digitale, venivo da anni in famiglia. Questo corso mi ha rimessa in pista in sei settimane. Oggi lavoro per un'agenzia locale.",
  },
  {
    name: "Marco R.",
    age: "28 anni, Menaggio",
    course: "Addetto di Cucina",
    stars: 5,
    text: "Ho fatto il corso mentre cercavo lavoro. Prima ancora di finirlo mi hanno già chiamato per un'estate al lago. Non poteva andare meglio.",
  },
  {
    name: "Fatima A.",
    age: "42 anni, Tremezzina",
    course: "Inglese – Intermedio",
    stars: 5,
    text: "Avevo bisogno di migliorare l'inglese per il lavoro in hotel. Corso pratico, insegnanti pazienti, e finalmente non mi spavento più con i turisti stranieri.",
  },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stelle su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5"
          fill={i < count ? "#c8941a" : "#e5e7eb"}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      className="sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: "#1a2e5a", height: "60px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#c8941a" }}
            >
              <span className="text-white font-display font-bold text-xs leading-none">
                FC
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-display font-bold text-base">
                Formazione
              </div>
              <div
                className="font-sans font-medium text-xs uppercase tracking-widest"
                style={{ color: "#c8941a" }}
              >
                Como Lago e Valli
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/75 hover:text-white font-sans text-sm transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth buttons */}
          <NavbarAuth />
          {/* Mobile nav */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center"
      style={{
        backgroundColor: "#1a2e5a",
        minHeight: "calc(100vh - 60px)",
      }}
      aria-labelledby="hero-heading"
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "#c8941a" }}
        />
        <div
          className="absolute bottom-16 left-1/3 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: "#2d7a4f" }}
        />
        <div
          className="absolute top-1/2 -left-16 w-72 h-72 rounded-full opacity-[0.07]"
          style={{ backgroundColor: "#c8941a" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-sans font-medium mb-6"
            style={{
              backgroundColor: "rgba(200,148,26,0.15)",
              color: "#c8941a",
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "#c8941a" }}
            />
            Programma GOL – Regione Lombardia / Unione Europea
          </div>

          <h1
            id="hero-heading"
            className="font-display font-bold leading-tight mb-5 text-4xl sm:text-5xl lg:text-6xl"
            style={{ color: "#ffffff" }}
          >
            Corsi gratuiti per costruire il tuo futuro
          </h1>

          <p
            className="font-sans text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Finanziati da Regione Lombardia e Unione Europea. Per chi non
            lavora e vuole cambiare.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#corsi"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-white rounded-xl transition-all duration-200 hover:brightness-110 hover:scale-105 shadow-lg text-base"
              style={{
                backgroundColor: "#c8941a",
                minHeight: "52px",
                padding: "0 2rem",
              }}
            >
              Scopri i corsi
              <ArrowRight />
            </a>
            <a
              href="#come-funziona"
              className="inline-flex items-center justify-center font-sans font-semibold text-white rounded-xl transition-all duration-200 border text-base"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.3)",
                minHeight: "52px",
                padding: "0 2rem",
              }}
            >
              Come funziona
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section id="corsi" className="py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <p
            className="font-sans font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "#2d7a4f" }}
          >
            Tutti finanziati dal Programma GOL
          </p>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: "#1a2e5a" }}
          >
            I nostri corsi
          </h2>
          <p className="font-sans text-gray-500 text-lg max-w-2xl mx-auto">
            Scegli quello che fa per te. Ogni corso è gratuito, certificato e
            pensato per il mercato del lavoro locale.
          </p>
        </div>

        {/* ── Pacchetto completo: Fatti Impresa ───────────────────────── */}
        <div className="mb-8">
          <article
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ background: "linear-gradient(135deg, #C96A00 0%, #a05200 100%)" }}
          >
            <div className="relative p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Watermark */}
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-black text-white/10 select-none leading-none hidden lg:block"
                style={{ fontSize: "9rem" }}
                aria-hidden="true"
              >
                FI
              </span>

              <div className="flex-1 relative z-10">
                {/* Badge */}
                <span
                  className="inline-block font-sans font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
                  style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "white" }}
                >
                  PACCHETTO COMPLETO · 140h
                </span>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight mb-3">
                  Fatti Impresa
                </h3>

                <p className="font-sans text-white/85 text-base leading-relaxed mb-4 max-w-2xl">
                  Tre corsi in uno:{" "}
                  <strong className="text-white">Business UP!</strong> +{" "}
                  <strong className="text-white">Digital Marketing & AI</strong> +{" "}
                  <strong className="text-white">Business English</strong>.
                  Il percorso completo per chi vuole costruire o gestire un&apos;impresa.
                </p>

                <div className="flex flex-wrap gap-3 text-white/75 font-sans text-sm mb-6">
                  <span className="flex items-center gap-1.5">
                    <ClockIcon />
                    140 ore totali
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LocationIcon />
                    Tremezzina + Como
                  </span>
                </div>

                <Link
                  href="/corsi/fatti-impresa"
                  className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110 hover:scale-105"
                  style={{ backgroundColor: "white", color: "#C96A00" }}
                >
                  Scopri il pacchetto
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* ── Griglia corsi singoli ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <article
              key={course.slug}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Colored card header */}
              <div
                className="h-40 flex items-end justify-start p-5 relative overflow-hidden"
                style={{ background: course.gradient }}
              >
                <span
                  className="absolute -right-2 -top-2 font-display font-black text-white/10 select-none leading-none"
                  style={{ fontSize: "6rem" }}
                  aria-hidden="true"
                >
                  {course.abbr}
                </span>
                <span
                  className="relative z-10 font-sans font-bold text-xs uppercase tracking-wider text-white px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                >
                  GRATUITO
                </span>
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="font-display font-bold text-lg leading-tight mb-2"
                  style={{ color: "#1a2e5a" }}
                >
                  {course.title}
                </h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                  {course.desc}
                </p>
                <div className="flex flex-col gap-1.5 mb-5">
                  <div className="flex items-center gap-2 text-gray-400 font-sans text-sm">
                    <ClockIcon />
                    <span>{course.hours}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-400 font-sans text-sm">
                    <LocationIcon />
                    <span className="leading-snug">{course.locations}</span>
                  </div>
                </div>
                <Link
                  href={`/corsi/${course.slug}`}
                  className="block text-center font-sans font-semibold text-sm text-white py-2.5 rounded-xl transition-colors duration-200 hover:brightness-110"
                  style={{ backgroundColor: "#1a2e5a" }}
                >
                  Approfondisci — Sono interessato
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/proponi-corso"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium underline underline-offset-4"
            style={{ color: "#2d7a4f" }}
          >
            Non trovi quello che cerchi? Proponi un corso
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section
      id="come-funziona"
      className="py-10 lg:py-16"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <p
            className="font-sans font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "#2d7a4f" }}
          >
            Perché vale la pena
          </p>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl"
            style={{ color: "#1a2e5a" }}
          >
            Tre buoni motivi per iniziare oggi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: "rgba(45,122,79,0.1)",
                  color: "#2d7a4f",
                }}
              >
                {reason.icon}
              </div>
              <h3
                className="font-display font-bold text-xl mb-3 leading-tight"
                style={{ color: "#1a2e5a" }}
              >
                {reason.title}
              </h3>
              <p className="font-sans text-gray-500 text-base leading-relaxed">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsPreview() {
  return (
    <section id="testimonianze" className="py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p
            className="font-sans font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "#2d7a4f" }}
          >
            Chi l&apos;ha già fatto
          </p>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: "#1a2e5a" }}
          >
            Le loro parole
          </h2>
          <p className="font-sans text-gray-500 text-lg max-w-xl mx-auto">
            Persone reali, percorsi reali. Ecco cosa dicono chi ha già
            frequentato i nostri corsi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="bg-white rounded-2xl p-7 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4 border border-gray-100"
            >
              <StarRating count={t.stars} />
              <p className="font-sans text-gray-600 text-base leading-relaxed flex-1 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer>
                <cite className="not-italic">
                  <span
                    className="font-sans font-semibold block"
                    style={{ color: "#1a2e5a" }}
                  >
                    {t.name}
                  </span>
                  <span className="font-sans text-gray-400 text-sm">
                    {t.age} &middot; {t.course}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/testimonianze"
            className="inline-flex items-center gap-2 font-sans font-semibold text-base px-6 py-3 rounded-xl border-2 transition-all duration-200 hover:text-white hover:border-transparent"
            style={{
              color: "#1a2e5a",
              borderColor: "#1a2e5a",
            }}
          >
            Leggi tutte le testimonianze
            <ArrowRight />
          </Link>
          <Link
            href="/testimonianze"
            className="inline-flex items-center gap-2 font-sans font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "#c8941a", color: "white" }}
          >
            Lascia la tua recensione
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

async function ProponCorsoSection() {
  let categorie = [];

  if (supabase) {
    const { data } = await supabase
      .from("categorie_formative")
      .select("id, titolo, contatore")
      .eq("attiva", true)
      .order("ordine")
      .limit(5);
    if (data) categorie = data;
  }

  const topPercorsi = [...categorie]
    .sort((a, b) => (b.contatore || 0) - (a.contatore || 0))
    .slice(0, 3);

  return (
    <section id="proponi" className="py-10 lg:py-16" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <p
            className="font-sans font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "#2d7a4f" }}
          >
            Aiutaci a costruire il calendario
          </p>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ color: "#1a2e5a" }}
          >
            Non trovi quello che cerchi?
          </h2>
          <p className="font-sans text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Dicci cosa vorresti imparare. Se raccogliamo abbastanza richieste,
            organizziamo il corso per te.
          </p>
          <a
            href="/proponi-corso"
            className="inline-flex items-center gap-2 font-sans font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "#1a2e5a", color: "white" }}
          >
            Dicci cosa cerchi
            <ArrowRight />
          </a>
        </div>

        {categorie.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {categorie.map((cat) => (
              <div
                key={cat.titolo}
                className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <p
                  className="font-sans font-semibold text-sm mb-2"
                  style={{ color: "#1a2e5a" }}
                >
                  {cat.titolo}
                </p>
                <span
                  className="inline-block font-sans font-bold text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(45,122,79,0.1)", color: "#2d7a4f" }}
                >
                  {cat.contatore || 0} {cat.contatore === 1 ? "richiesta" : "richieste"}
                </span>
              </div>
            ))}
          </div>
        )}

        {topPercorsi.length > 0 && (
          <div>
            <p
              className="font-sans font-semibold text-sm text-center uppercase tracking-widest mb-5"
              style={{ color: "#92400e" }}
            >
              I percorsi più richiesti
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto">
              {topPercorsi.map((cat, i) => (
                <div
                  key={cat.titolo}
                  className="flex-1 bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm"
                  style={{ border: "1px solid #fed7aa" }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 text-white"
                    style={{ backgroundColor: "#c8941a" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-sans font-semibold text-sm"
                      style={{ color: "#1a2e5a" }}
                    >
                      {cat.titolo}
                    </p>
                    <span
                      className="font-sans text-xs font-bold"
                      style={{ color: "#c8941a" }}
                    >
                      {cat.contatore || 0} {cat.contatore === 1 ? "richiesta" : "richieste"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const contacts = [
    {
      label: "CPI Menaggio",
      value: "+39 031 82 55 705",
      href: "tel:+390318255705",
    },
    {
      label: "CPI Como",
      value: "+39 031 82 55 703",
      href: "tel:+390318255703",
    },
    {
      label: "Mestieri Lombardia",
      value: "+39 031 81 23 796",
      href: "tel:+390318123796",
    },
    {
      label: "Email",
      value: "como@mestierilombardia.it",
      href: "mailto:como@mestierilombardia.it",
    },
  ];

  const logos = [
    { abbr: "UE", full: "Unione Europea\nNextGenerationEU" },
    { abbr: "AN", full: "ANPAL\nAgenzia Nazionale\nPolitiche Attive" },
    { abbr: "ML", full: "Ministero\ndel Lavoro" },
    { abbr: "RL", full: "Regione\nLombardia" },
    { abbr: "GOL", full: "Garanzia di\nOccupabilità\ndei Lavoratori" },
    { abbr: "MS", full: "Mestieri\nLombardia\nStarting Work" },
  ];

  return (
    <footer
      id="contatti"
      className="text-white"
      style={{ backgroundColor: "#1a2e5a" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#c8941a" }}
              >
                <span className="text-white font-display font-bold">FC</span>
              </div>
              <div>
                <div className="text-white font-display font-bold text-lg">
                  Formazione
                </div>
                <div
                  className="font-sans text-xs uppercase tracking-widest"
                  style={{ color: "#c8941a" }}
                >
                  Como Lago e Valli
                </div>
              </div>
            </div>
            <p className="font-sans text-white/60 text-sm leading-relaxed">
              Un progetto di Mestieri Lombardia – Starting Work, nell&apos;ambito
              del Programma GOL finanziato da Regione Lombardia e
              dall&apos;Unione Europea.
            </p>
          </div>

          {/* Contacts */}
          <div>
            <h3
              className="font-display font-bold text-lg mb-5"
              style={{ color: "#c8941a" }}
            >
              Contatti
            </h3>
            <ul className="space-y-4">
              {contacts.map((c) => (
                <li key={c.label}>
                  <span className="font-sans text-white/50 text-xs uppercase tracking-wider block mb-0.5">
                    {c.label}
                  </span>
                  <a
                    href={c.href}
                    className="font-sans text-white/85 hover:text-white text-sm transition-colors"
                  >
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="font-display font-bold text-lg mb-5"
              style={{ color: "#c8941a" }}
            >
              Navigazione
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-sans text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Institutional logos */}
        <div
          className="mt-14 pt-10 border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-6 text-center">
            Con il sostegno di
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {logos.map((logo) => (
              <div
                key={logo.abbr}
                className="flex flex-col items-center justify-center rounded-xl p-3 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  width: "6rem",
                  minHeight: "5rem",
                }}
                title={logo.full.replace(/\n/g, " ")}
              >
                <span
                  className="font-display font-black text-sm leading-none mb-1"
                  style={{ color: "#c8941a" }}
                >
                  {logo.abbr}
                </span>
                <span
                  className="font-sans text-white/50 leading-tight whitespace-pre-line"
                  style={{ fontSize: "0.625rem" }}
                >
                  {logo.full}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Mestieri Lombardia – Starting
            Work. Tutti i diritti riservati.
          </p>
          <div className="flex gap-5">
            <a
              href="#"
              className="font-sans text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-sans text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Note Legali
            </a>
            <a
              href="#"
              className="font-sans text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CoursesSection />
        <ProponCorsoSection />
        <QuoteCarousel />
        <WhySection />
        <TestimonialsPreview />
      </main>
      <Footer />
    </>
  );
}
