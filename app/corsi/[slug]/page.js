import { notFound } from "next/navigation";
import Link from "next/link";
import { corsi, getCorsoBySlug } from "@/app/data/corsi";
import FormIscrizioneConPrompt from "@/app/components/FormIscrizioneConPrompt";

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
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="inline-block font-sans font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "white" }}
            >
              GRATUITO – Dote Inserimento Lavorativo
            </span>
            {corso.cluster && (
              <span
                className="inline-block font-sans font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#1a2e5a" }}
              >
                DIL Cluster {corso.cluster}
              </span>
            )}
          </div>

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

            {/* Info DIL */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <p className="font-sans text-xs text-blue-700 leading-relaxed">
                <strong>Corso 100% gratuito</strong> finanziato da Regione
                Lombardia e Unione Europea nell&apos;ambito della{" "}
                <strong>Dote Inserimento Lavorativo (DIL)</strong>, la misura
                che dal 1° luglio 2026 sostituisce il Programma GOL. Riservato
                a persone disoccupate residenti o domiciliate in Lombardia,
                senza limiti di età. Il monte ore finanziabile dipende dal
                cluster assegnato in fase di presa in carico: 16 ore per il
                Cluster 1, fino a 40 ore per gli altri. Si può attivare una
                sola dote.
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
                  Iscriviti al corso
                </h2>
                <p className="font-sans text-sm text-gray-500">
                  Compila il form e ti contatteremo entro 24 ore per i prossimi
                  passi. Il corso è{" "}
                  <strong className="text-gray-700">completamente gratuito</strong>{" "}
                  con la Dote Inserimento Lavorativo.
                </p>
              </div>
              <FormIscrizioneConPrompt corsoPreselezionato={corso.slug} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
