"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

// ─── Costanti ─────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_OPTIONS = [
  { value: "disoccupato", label: "Sono disoccupato/a" },
  { value: "inoccupato", label: "Non ho mai lavorato (inoccupato/a)" },
  { value: "studente_universitario", label: "Sono studente universitario/a" },
  { value: "studente_accademia", label: "Sono studente di accademia" },
  { value: "occupato", label: "Sono occupato/a con contratto di lavoro" },
  { value: "imprenditore", label: "Sono titolare d'impresa" },
];

const INITIAL_FORM = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  codice_fiscale: "",
  comune_residenza: "",
  status: "",
  categoria_id: "",
  categoria_nome: "",
  descrizione: "",
  consenso_gdpr: false,
  newsletter: false,
};

// ─── UI helpers ───────────────────────────────────────────────────────────────

function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="font-sans text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mb-5">
      <h3
        className="font-display font-bold text-lg pb-2 border-b"
        style={{ color: "#1a2e5a", borderColor: "#e2e8f0" }}
      >
        {children}
      </h3>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:ring-2";

function inputStyle(hasError) {
  return {
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    "--tw-ring-color": hasError ? "#ef444440" : "#1a2e5a40",
  };
}

// ─── Componente form ──────────────────────────────────────────────────────────

export default function ProponCorsoForm({ categorieIniziali = [] }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "categoria_id") {
      const cat = categorieIniziali.find((c) => String(c.id) === value);
      setFormData((prev) => ({
        ...prev,
        categoria_id: value,
        categoria_nome: cat ? cat.titolo : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCF = (e) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, codice_fiscale: val }));
    setErrors((prev) => ({ ...prev, codice_fiscale: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!formData.cognome.trim()) e.cognome = "Il cognome è obbligatorio";
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email))
      e.email = "Inserisci un'email valida";
    if (!formData.telefono.trim()) e.telefono = "Il telefono è obbligatorio";
    if (!formData.categoria_id) e.categoria_id = "Seleziona una categoria";
    if (!formData.descrizione.trim())
      e.descrizione = "Descrivi il percorso che cerchi";
    if (!formData.consenso_gdpr)
      e.consenso_gdpr = "Il consenso al trattamento dei dati è obbligatorio";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!supabase) {
      setErrors({
        submit:
          "Configurazione database non presente. Aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY al file .env.local.",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("[proponi-corso] Invio desiderio formativo:", formData.categoria_nome);

      const { error: dbError } = await supabase.from("desideri_formativi").insert({
        nome: formData.nome.trim(),
        cognome: formData.cognome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        codice_fiscale: formData.codice_fiscale || null,
        comune_residenza: formData.comune_residenza.trim() || null,
        status: formData.status || null,
        categoria_id: formData.categoria_id,
        categoria_nome: formData.categoria_nome,
        descrizione: formData.descrizione.trim(),
        newsletter: formData.newsletter,
      });

      if (dbError) {
        console.error("[proponi-corso] Errore insert desideri_formativi:", dbError);
        throw dbError;
      }

      if (formData.newsletter) {
        await supabase.from("newsletter").upsert(
          {
            email: formData.email.trim().toLowerCase(),
            nome: formData.nome.trim(),
            attivo: true,
          },
          { onConflict: "email", ignoreDuplicates: false }
        );
      }

      // Fire-and-forget: incrementa contatore categoria
      (async () => {
        const { data, error: readErr } = await supabase
          .from("categorie_formative")
          .select("contatore")
          .eq("id", formData.categoria_id)
          .maybeSingle();
        if (readErr) {
          console.error("[proponi-corso] Errore lettura contatore:", readErr);
          return;
        }
        if (data) {
          supabase
            .from("categorie_formative")
            .update({ contatore: (data.contatore || 0) + 1 })
            .eq("id", formData.categoria_id);
        }
      })();

      setSubmitted(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error("[proponi-corso] Errore submit:", err);
      setErrors({
        submit:
          "Si è verificato un errore durante l'invio. Riprova tra qualche minuto o contattaci direttamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#1a2e5a" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium mb-6 transition-opacity hover:opacity-75"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna alla home
          </Link>

          <span
            className="inline-block font-sans font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "rgba(200,148,26,0.2)", color: "#c8941a" }}
          >
            Costruiamo il calendario insieme
          </span>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Non trovi quello che cerchi?
          </h1>
          <p
            className="font-sans text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Dicci cosa vorresti imparare. Se raccogliamo abbastanza richieste,
            organizziamo il corso e ti contatteremo per primo.
          </p>
        </div>
      </div>

      {/* ── Form / Successo ───────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {submitted ? (
          <div
            ref={topRef}
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: "#f0faf5", border: "2px solid #2d7a4f" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "#2d7a4f" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl mb-3" style={{ color: "#2d7a4f" }}>
              Grazie!
            </h2>
            <p className="font-sans text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
              Abbiamo registrato il tuo interesse. Se raggiungiamo abbastanza
              richieste per questo percorso, organizzeremo il corso e ti
              contatteremo per primo.
            </p>
          </div>
        ) : (
          <div
            ref={topRef}
            className="rounded-2xl p-6 sm:p-8"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="mb-6">
              <h2 className="font-display font-bold text-2xl mb-1" style={{ color: "#1a2e5a" }}>
                Proponi il tuo percorso
              </h2>
              <p className="font-sans text-sm text-gray-500">
                Compila il form e ti faremo sapere se e quando organizziamo il corso.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
              {errors.submit && (
                <div
                  className="rounded-xl p-4 font-sans text-sm"
                  style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}
                >
                  {errors.submit}
                </div>
              )}

              {/* ── Anagrafica ──────────────────────────────────────── */}
              <section>
                <SectionTitle>1. Dati anagrafici</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Nome" required error={errors.nome}>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      autoComplete="given-name"
                      className={inputClass}
                      style={inputStyle(!!errors.nome)}
                      placeholder="Mario"
                    />
                  </FormField>

                  <FormField label="Cognome" required error={errors.cognome}>
                    <input
                      type="text"
                      name="cognome"
                      value={formData.cognome}
                      onChange={handleChange}
                      autoComplete="family-name"
                      className={inputClass}
                      style={inputStyle(!!errors.cognome)}
                      placeholder="Rossi"
                    />
                  </FormField>

                  <FormField label="Email" required error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={inputClass}
                      style={inputStyle(!!errors.email)}
                      placeholder="mario.rossi@email.it"
                    />
                  </FormField>

                  <FormField label="Telefono" required error={errors.telefono}>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      autoComplete="tel"
                      className={inputClass}
                      style={inputStyle(!!errors.telefono)}
                      placeholder="+39 333 1234567"
                    />
                  </FormField>

                  <FormField label="Codice Fiscale" error={errors.codice_fiscale}>
                    <input
                      type="text"
                      name="codice_fiscale"
                      value={formData.codice_fiscale}
                      onChange={handleCF}
                      maxLength={16}
                      className={inputClass}
                      style={{ ...inputStyle(!!errors.codice_fiscale), fontFamily: "monospace" }}
                      placeholder="RSSMRA85T10F205Z"
                    />
                  </FormField>

                  <FormField label="Comune di residenza" error={errors.comune_residenza}>
                    <input
                      type="text"
                      name="comune_residenza"
                      value={formData.comune_residenza}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      className={inputClass}
                      style={inputStyle(!!errors.comune_residenza)}
                      placeholder="Como"
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Situazione lavorativa" error={errors.status}>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClass}
                        style={{ ...inputStyle(!!errors.status), cursor: "pointer" }}
                      >
                        <option value="">Seleziona (opzionale)</option>
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>
              </section>

              {/* ── Desiderio formativo ──────────────────────────── */}
              <section>
                <SectionTitle>2. Desiderio formativo</SectionTitle>
                <div className="flex flex-col gap-4">
                  <FormField
                    label="Categoria di interesse"
                    required
                    error={errors.categoria_id}
                  >
                    <select
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleChange}
                      className={inputClass}
                      style={{ ...inputStyle(!!errors.categoria_id), cursor: "pointer" }}
                    >
                      <option value="">Seleziona una categoria…</option>
                      {categorieIniziali.length === 0 ? (
                        <option disabled value="">
                          Nessuna categoria disponibile
                        </option>
                      ) : (
                        categorieIniziali.map((cat) => (
                          <option key={cat.id} value={String(cat.id)}>
                            {cat.titolo}
                          </option>
                        ))
                      )}
                    </select>
                    {categorieIniziali.length === 0 && (
                      <p className="font-sans text-xs text-amber-600 mt-1">
                        Nessuna categoria trovata. Controlla che la tabella{" "}
                        <code className="bg-amber-50 px-1 rounded">categorie_formative</code> esista
                        e abbia record con <code className="bg-amber-50 px-1 rounded">attiva = true</code>.
                      </p>
                    )}
                  </FormField>

                  <FormField
                    label="Descrivi il percorso che cerchi"
                    required
                    error={errors.descrizione}
                  >
                    <textarea
                      name="descrizione"
                      value={formData.descrizione}
                      onChange={handleChange}
                      rows={4}
                      className={inputClass}
                      style={{ ...inputStyle(!!errors.descrizione), resize: "vertical" }}
                      placeholder="Descrivi liberamente cosa vorresti imparare, a che livello, se hai preferenze sulle modalità (in presenza, online)…"
                    />
                  </FormField>
                </div>
              </section>

              {/* ── Consensi ────────────────────────────────────── */}
              <section>
                <SectionTitle>3. Privacy e consensi</SectionTitle>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consenso_gdpr"
                        checked={formData.consenso_gdpr}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded shrink-0"
                        style={{ accentColor: "#1a2e5a" }}
                      />
                      <span className="font-sans text-sm text-gray-700 leading-relaxed">
                        Ho letto l&apos;{" "}
                        <a href="#" className="underline" style={{ color: "#1a2e5a" }}>
                          informativa sulla privacy
                        </a>{" "}
                        e acconsento al trattamento dei miei dati personali ai sensi
                        del GDPR (Reg. UE 2016/679).{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.consenso_gdpr && (
                      <p className="font-sans text-red-500 text-xs mt-1 ml-7">
                        {errors.consenso_gdpr}
                      </p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded shrink-0"
                      style={{ accentColor: "#1a2e5a" }}
                    />
                    <span className="font-sans text-sm text-gray-700 leading-relaxed">
                      Desidero ricevere aggiornamenti sui nuovi corsi e le attività
                      di Mestieri Lombardia – Starting Work (opzionale).
                    </span>
                  </label>
                </div>
              </section>

              {/* ── Submit ──────────────────────────────────────── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-sans font-semibold text-white rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: loading ? "#6b7280" : "#1a2e5a",
                    minHeight: "52px",
                    padding: "0 2.5rem",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                        style={{ animation: "spin 0.7s linear infinite" }}
                      />
                      Invio in corso…
                    </>
                  ) : (
                    "Invia la mia proposta"
                  )}
                </button>

                <p className="font-sans text-xs text-gray-400 mt-3">
                  I campi contrassegnati con <span className="text-red-500">*</span> sono
                  obbligatori.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
