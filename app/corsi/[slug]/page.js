import { notFound } from "next/navigation";
import Link from "next/link";
import { corsi, getCorsoBySlug } from "@/app/data/corsi";
import FormIscrizioneConPrompt from "@/app/components/FormIscrizioneConPrompt";

// ─── Componente: banner "fa parte di" ────────────────────────────────────────

function PacchettoBanner({ pacchetttoSlug }) {
  const pacchetto = getCorsoBySlug(pacchetttoSlug);
  if (!pacchetto) return null;
  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3 mb-6"
      style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}
    >
      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="#C96A00" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <div>
        <p className="font-sans font-semibold text-sm" style={{ color: "#9a3412" }}>
          Questo corso fa parte del pacchetto{" "}
          <Link
            href={`/corsi/${pacchetttoSlug}`}
            className="underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            {pacchetto.titolo}
          </Link>
        </p>
        <p className="font-sans text-xs mt-0.5" style={{ color: "#c2410c" }}>
          Iscrivendoti al pacchetto completo accedi a questo e agli altri corsi inclusi.
        </p>
      </div>
    </div>
  );
}

// ─── Componente: card corso incluso ──────────────────────────────────────────

function CorsoIncluso({ slug }) {
  const corso = getCorsoBySlug(slug);
  if (!corso) return null;
  return (
    <Link
      href={`/corsi/${slug}`}
      className="flex items-center gap-3 rounded-xl p-4 transition-all duration-200 hover:shadow-sm group"
      style={{ backgroundColor: "#f9fafb", border: "1.5px solid #e5e7eb" }}
    >
      <div
        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
        style={{ backgroundColor: corso.colore }}
      >
        <span className="font-display font-black text-white text-xs leading-none">
          {corso.titolo.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-sm truncate" style={{ color: "#1a2e5a" }}>
          {corso.titolo}
        </p>
        <p className="font-sans text-xs text-gray-400">{corso.durata}</p>
      </div>
      <svg
        className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  );
}

// ─── Static params (pre-render tutte le pagine dei corsi) ────────────────────

export async function generateStaticParams() {
  return corsi.map((c) => ({ slug: c.slug }));
}

// ─── Metadata dinamica ───────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  // Next.js 16: params è una Promise
  const { slug } = await params;
  const corso = getCorsoBySlug(slug);
  if (!corso) return {};
  return {
    title: `${corso.titolo} – Formazione Como Lago e Valli`,
    description: corso.descrizione,
  };
}

// ─── Componenti server-side ──────────────────────────────────────────────────

function CheckIcon() {
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
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

// ─── Pagina corso ─────────────────────────────────────────────────────────────

export default async function CorsoPage({ params }) {
  // Next.js 16: params è una Promise — va attesa
  const { slug } = await params;
  const corso = getCorsoBySlug(slug);

  if (!corso) notFound();

  return (
    <>
      {/* ── Header corso ────────────────────────────────────────────── */}
      <div style={{ backgroundColor: corso.colore }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-10 lg:pb-16">
          {/* Breadcrumb */}
          <Link
            href="/#corsi"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium mb-6 transition-opacity hover:opacity-75"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti i corsi
          </Link>

          {/* Badge */}
          <span
            className="inline-block font-sans font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "white" }}
          >
            GRATUITO – Programma GOL
          </span>

          {/* Titolo */}
          <h1
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4"
          >
            {corso.titolo}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-5">
            <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.85)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-sans text-sm font-medium">{corso.durata}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.85)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-sans text-sm font-medium">{corso.sede}</span>
            </div>
          </div>

          {/* Descrizione */}
          <p
            className="font-sans text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {corso.descrizione}
          </p>
        </div>
      </div>

      {/* ── Contenuto e form ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* Colonna sinistra: dettagli corso */}
          <div className="lg:col-span-1 flex flex-col gap-7">
            {/* Banner "fa parte di pacchetto" */}
            {corso.parte_di_pacchetto && (
              <PacchettoBanner pacchetttoSlug={corso.parte_di_pacchetto} />
            )}

            {/* Corsi inclusi (solo per fatti-impresa) */}
            {corso.corsi_inclusi?.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}
              >
                <h2
                  className="font-display font-bold text-lg mb-1"
                  style={{ color: "#9a3412" }}
                >
                  Corsi inclusi nel pacchetto
                </h2>
                <p className="font-sans text-xs text-orange-700 mb-4">
                  Iscrivendoti a Fatti Impresa manifesti interesse per tutti e tre i percorsi.
                </p>
                <div className="flex flex-col gap-2">
                  {corso.corsi_inclusi.map((s) => (
                    <CorsoIncluso key={s} slug={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Contenuti */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <h2
                className="font-display font-bold text-lg mb-4"
                style={{ color: "#1a2e5a" }}
              >
                Cosa imparerai
              </h2>
              <ul className="flex flex-col gap-2.5">
                {corso.contenuti.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-sans text-sm text-gray-600 leading-snug"
                  >
                    <span style={{ color: "#2d7a4f" }}>
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Competenze finali */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#f0faf5", border: "1px solid #a7f3d0" }}
            >
              <h2
                className="font-display font-bold text-lg mb-4"
                style={{ color: "#1a2e5a" }}
              >
                Competenze che acquisirai
              </h2>
              <ul className="flex flex-col gap-2.5">
                {corso.competenze_finali.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-sans text-sm text-gray-600 leading-snug"
                  >
                    <span style={{ color: "#2d7a4f" }}>
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Info GOL */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <p className="font-sans text-xs text-blue-700 leading-relaxed">
                <strong>Corso 100% gratuito</strong> finanziato da Regione
                Lombardia e Unione Europea nell'ambito del Programma GOL
                (Garanzia di Occupabilità dei Lavoratori). Per accedere
                occorre essere in possesso dei requisiti di idoneità.
              </p>
            </div>
          </div>

          {/* Colonna destra: form iscrizione */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div className="mb-6">
                <h2
                  className="font-display font-bold text-2xl mb-1"
                  style={{ color: "#1a2e5a" }}
                >
                  {corso.corsi_inclusi?.length > 0
                    ? "Iscriviti al pacchetto"
                    : "Iscriviti al corso"}
                </h2>
                <p className="font-sans text-sm text-gray-500">
                  {corso.corsi_inclusi?.length > 0
                    ? "Compila il form: registriamo il tuo interesse per tutti e tre i corsi del pacchetto. Ti contatteremo entro 24 ore."
                    : "Compila il form e ti contatteremo entro 24 ore per i prossimi passi."}{" "}
                  Il corso è{" "}
                  <strong className="text-gray-700">completamente gratuito</strong>.
                </p>
              </div>
              <FormIscrizioneConPrompt
                corsoPreselezionato={
                  corso.corsi_inclusi?.length > 0
                    ? corso.corsi_inclusi
                    : corso.slug
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
