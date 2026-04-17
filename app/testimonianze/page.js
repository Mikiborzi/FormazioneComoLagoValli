import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import FormGradimento from "@/app/components/FormGradimento";

// Forza rendering dinamico ad ogni richiesta — necessario per leggere
// recensioni fresche da Supabase senza caching statico.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimonianze – Formazione Como Lago e Valli",
  description:
    "Leggi le recensioni di chi ha già frequentato i nostri corsi GOL gratuiti e lascia la tua.",
};

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stelle su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
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

async function getRecensioni() {
  if (!supabase) {
    console.error("getRecensioni: supabase client è null — controlla le variabili d'ambiente");
    return [];
  }
  const { data, error } = await supabase
    .from("recensioni")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getRecensioni errore Supabase:", JSON.stringify(error));
    return [];
  }
  return data ?? [];
}

export default async function TestimonanzePage() {
  const recensioni = await getRecensioni();

  return (
    <>
      {/* Header */}
      <div style={{ backgroundColor: "#1a2e5a" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <Link
            href="/#testimonianze"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium mb-6 transition-opacity hover:opacity-75"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna alla home
          </Link>
          <p
            className="font-sans font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "#c8941a" }}
          >
            Chi l&apos;ha già fatto
          </p>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-3"
          >
            Testimonianze
          </h1>
          <p className="font-sans text-base leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.75)" }}>
            Persone reali, percorsi reali. Ecco cosa dicono chi ha già frequentato i nostri corsi GOL
            gratuiti a Como, Tremezzina e online.
          </p>
        </div>
      </div>

      {/* Griglia recensioni — visibile solo se presenti */}
      {recensioni.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recensioni.map((r) => (
              <blockquote
                key={r.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3 border border-gray-100"
              >
                <StarRating count={r.valutazione} />
                <p className="font-sans text-gray-600 text-sm leading-relaxed flex-1 italic">
                  &ldquo;{r.testo}&rdquo;
                </p>
                <footer>
                  <cite className="not-italic">
                    <span className="font-sans font-semibold block text-sm" style={{ color: "#1a2e5a" }}>
                      {r.nome} {r.cognome}
                    </span>
                    <span className="font-sans text-gray-400 text-xs">
                      {r.corso_titolo ?? r.corso_slug} &middot; {r.anno}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Form multi-step gradimento */}
      <FormGradimento />
    </>
  );
}
