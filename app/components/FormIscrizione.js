"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { checkIdoneitaGol } from "@/app/lib/idoneitaGol";
import { corsi } from "@/app/data/corsi";

// ─── Costanti ────────────────────────────────────────────────────────────────

const CF_REGEX = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_OPTIONS = [
  { value: "disoccupato", label: "Sono disoccupato/a" },
  { value: "inoccupato", label: "Non ho mai lavorato (inoccupato/a)" },
  { value: "studente_universitario", label: "Sono studente universitario/a" },
  { value: "studente_accademia", label: "Sono studente di accademia" },
  { value: "occupato", label: "Sono occupato/a con contratto di lavoro" },
  { value: "imprenditore", label: "Sono titolare d'impresa" },
];

const SLUGS_LINGUE = new Set([
  "inglese-base", "inglese-intermedio", "business-english",
  "tedesco-base", "tedesco-intermedio",
  "francese-base", "francese-intermedio", "francese-avanzato",
  "spagnolo-base", "spagnolo-intermedio", "spagnolo-avanzato",
]);

const COME_SAPUTO_OPTIONS = [
  "Passaparola",
  "Facebook",
  "Instagram",
  "Volantino",
  "Centro per l'Impiego",
  "Altro",
];

const SLUG_GIARDINAGGIO = "giardinaggio-base";

const INITIAL_FORM = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  codice_fiscale: "",
  data_nascita: "",
  comune_residenza: "",
  cap_residenza: "",
  provincia_residenza: "",
  nazione_residenza: "Italia",
  indirizzo: "",
  comune_domicilio: "",
  indirizzo_domicilio: "",
  cap_domicilio: "",
  provincia_domicilio: "",
  nazione_domicilio: "",
  status: "",
  come_saputo: "",
  sedi_preferite: [],
  consenso_gdpr: false,
  newsletter: false,
};

// ─── Sotto-componenti UI ─────────────────────────────────────────────────────

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

function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-sans text-red-500 text-xs mt-0.5">{error}</p>
      )}
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

// ─── Flusso di qualificazione post-registrazione (solo idonei GOL) ───────────

function QualificationFlow({ iscrizioneId }) {
  // step: 'd1' | 'd1_si' | 'cpi_no' | 'd2' | 'd2_si' | 'final_a' | 'final_b'
  const [step, setStep] = useState("d1");
  const [cpiInput, setCpiInput] = useState("");
  const [enteInput, setEnteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const scrollTop = () =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const updateIscrizione = async (fields) => {
    if (!supabase || !iscrizioneId) return;
    await supabase.from("iscrizioni").update(fields).eq("id", iscrizioneId);
  };

  const handleCpiSi = () => {
    setStep("d1_si");
    scrollTop();
  };

  const handleCpiNo = async () => {
    setLoading(true);
    await updateIscrizione({ iscritto_cpi: false });
    setLoading(false);
    setStep("cpi_no");
    scrollTop();
  };

  const handleCpiSiConfirm = async () => {
    if (!cpiInput.trim()) return;
    setLoading(true);
    await updateIscrizione({ iscritto_cpi: true, cpi_riferimento: cpiInput.trim() });
    setLoading(false);
    setStep("d2");
    scrollTop();
  };

  const handleGolSi = () => {
    setStep("d2_si");
    scrollTop();
  };

  const handleGolNo = async () => {
    setLoading(true);
    await updateIscrizione({ gol_attivo: false });
    setLoading(false);
    setStep("final_b");
    scrollTop();
  };

  const handleGolSiConfirm = async () => {
    if (!enteInput.trim()) return;
    setLoading(true);
    await updateIscrizione({ gol_attivo: true, ente_gol: enteInput.trim() });
    setLoading(false);
    setStep("final_a");
    scrollTop();
  };

  const siStyle = {
    backgroundColor: "#2d7a4f",
    color: "white",
  };
  const noStyle = {
    borderColor: "#1a2e5a",
    color: "#1a2e5a",
  };
  const btnBase =
    "flex-1 font-sans font-semibold rounded-xl py-4 text-base transition-all duration-200 disabled:opacity-60";
  const inputFieldClass =
    "w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:ring-2 mb-4";

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {/* ── Messaggio iniziale ─────────────────────────────────────── */}
      <div
        className="rounded-2xl p-7 sm:p-8 text-center"
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
        <h3 className="font-display font-bold text-2xl mb-3" style={{ color: "#2d7a4f" }}>
          Grazie per il tuo interesse e per esserti preregistrato!
        </h3>
        <p className="font-sans text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
          La tua richiesta è stata registrata. Il corso partirà non appena
          raggiungeremo il numero minimo di iscritti previsto — ti contatteremo
          non appena sarà possibile attivarlo.
        </p>
      </div>

      {/* ── Domanda 1: CPI ────────────────────────────────────────── */}
      {step === "d1" && (
        <div
          className="rounded-2xl p-6 sm:p-7"
          style={{ border: "1.5px solid #e2e8f0" }}
        >
          <p
            className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#2d7a4f" }}
          >
            Una cosa importante
          </p>
          <h4
            className="font-display font-bold text-xl sm:text-2xl mb-6"
            style={{ color: "#1a2e5a" }}
          >
            Sei già iscritto/a al Centro per l&apos;Impiego?
          </h4>
          <div className="flex gap-3">
            <button
              onClick={handleCpiSi}
              disabled={loading}
              className={btnBase}
              style={siStyle}
            >
              Sì
            </button>
            <button
              onClick={handleCpiNo}
              disabled={loading}
              className={`${btnBase} border-2`}
              style={noStyle}
            >
              {loading ? "Salvataggio…" : "No"}
            </button>
          </div>
        </div>
      )}

      {/* ── CPI: risposta Sì → input nome CPI ────────────────────── */}
      {step === "d1_si" && (
        <div
          className="rounded-2xl p-6 sm:p-7"
          style={{ border: "1.5px solid #e2e8f0" }}
        >
          <p
            className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#2d7a4f" }}
          >
            Ottimo!
          </p>
          <h4
            className="font-display font-bold text-xl mb-4"
            style={{ color: "#1a2e5a" }}
          >
            Indica quale CPI
          </h4>
          <input
            type="text"
            value={cpiInput}
            onChange={(e) => setCpiInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCpiSiConfirm()}
            placeholder="es. CPI Menaggio, CPI Como…"
            className={inputFieldClass}
            style={{ borderColor: "#d1d5db", "--tw-ring-color": "#1a2e5a40" }}
            autoFocus
          />
          <button
            onClick={handleCpiSiConfirm}
            disabled={loading || !cpiInput.trim()}
            className="w-full font-sans font-semibold text-white rounded-xl py-3.5 transition-all duration-200"
            style={{
              backgroundColor: loading || !cpiInput.trim() ? "#6b7280" : "#1a2e5a",
              cursor: loading || !cpiInput.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Salvataggio…" : "Continua"}
          </button>
        </div>
      )}

      {/* ── CPI: risposta No → messaggio informativo ──────────────── */}
      {step === "cpi_no" && (
        <div
          className="rounded-2xl p-6 sm:p-7"
          style={{ backgroundColor: "#fffbeb", border: "1.5px solid #fbbf24" }}
        >
          <p
            className="font-sans font-bold text-base mb-3"
            style={{ color: "#92400e" }}
          >
            Per accedere al Programma GOL devi prima iscriverti al CPI
          </p>
          <p
            className="font-sans text-sm leading-relaxed mb-5"
            style={{ color: "#78350f" }}
          >
            Per poter accedere al Programma GOL e beneficiare della gratuità
            del corso, è necessario essere iscritti al Centro per l&apos;Impiego
            di riferimento per il tuo comune. Passa allo sportello CPI più
            vicino per completare l&apos;iscrizione — ti ci vorrà poco.
          </p>
          <div
            className="rounded-xl p-4 mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid #fde68a" }}
          >
            <p
              className="font-sans text-sm font-semibold mb-2"
              style={{ color: "#92400e" }}
            >
              Contatti CPI
            </p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "#78350f" }}>
              CPI Menaggio: <strong>+39 031 82 55 705</strong>
              <br />
              CPI Como: <strong>+39 031 82 55 703</strong>
            </p>
          </div>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "#78350f" }}>
            Una volta iscritto/a al CPI, torna qui: ti seguiremo direttamente noi.
          </p>
        </div>
      )}

      {/* ── Domanda 2: GOL attivo ──────────────────────────────────── */}
      {step === "d2" && (
        <div
          className="rounded-2xl p-6 sm:p-7"
          style={{ border: "1.5px solid #e2e8f0" }}
        >
          <p
            className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#2d7a4f" }}
          >
            Quasi finito
          </p>
          <h4
            className="font-display font-bold text-xl sm:text-2xl mb-6"
            style={{ color: "#1a2e5a" }}
          >
            Hai già attivo un Programma GOL?
          </h4>
          <div className="flex gap-3">
            <button
              onClick={handleGolSi}
              disabled={loading}
              className={btnBase}
              style={siStyle}
            >
              Sì
            </button>
            <button
              onClick={handleGolNo}
              disabled={loading}
              className={`${btnBase} border-2`}
              style={noStyle}
            >
              {loading ? "Salvataggio…" : "No"}
            </button>
          </div>
        </div>
      )}

      {/* ── GOL: risposta Sì → input ente ────────────────────────── */}
      {step === "d2_si" && (
        <div
          className="rounded-2xl p-6 sm:p-7"
          style={{ border: "1.5px solid #e2e8f0" }}
        >
          <p
            className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#2d7a4f" }}
          >
            Perfetto
          </p>
          <h4
            className="font-display font-bold text-xl mb-4"
            style={{ color: "#1a2e5a" }}
          >
            Con quale ente hai attivato il programma?
          </h4>
          <input
            type="text"
            value={enteInput}
            onChange={(e) => setEnteInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGolSiConfirm()}
            placeholder="es. Mestieri Lombardia, Afol…"
            className={inputFieldClass}
            style={{ borderColor: "#d1d5db", "--tw-ring-color": "#1a2e5a40" }}
            autoFocus
          />
          <button
            onClick={handleGolSiConfirm}
            disabled={loading || !enteInput.trim()}
            className="w-full font-sans font-semibold text-white rounded-xl py-3.5 transition-all duration-200"
            style={{
              backgroundColor: loading || !enteInput.trim() ? "#6b7280" : "#1a2e5a",
              cursor: loading || !enteInput.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Salvataggio…" : "Invia"}
          </button>
        </div>
      )}

      {/* ── Finale A: GOL già attivo ───────────────────────────────── */}
      {step === "final_a" && (
        <div
          className="rounded-2xl p-6 sm:p-7 text-center"
          style={{ backgroundColor: "#f0faf5", border: "1.5px solid #a7f3d0" }}
        >
          <p
            className="font-display font-bold text-lg mb-2"
            style={{ color: "#2d7a4f" }}
          >
            Perfetto! Hai già tutto in ordine.
          </p>
          <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
            Ti contatteremo presto per coordinare il percorso con il tuo ente e
            definire insieme i prossimi passi.
          </p>
        </div>
      )}

      {/* ── Finale B: GOL non ancora attivo ───────────────────────── */}
      {step === "final_b" && (
        <div
          className="rounded-2xl p-6 sm:p-7 text-center"
          style={{ backgroundColor: "#f0faf5", border: "1.5px solid #a7f3d0" }}
        >
          <p
            className="font-display font-bold text-lg mb-2"
            style={{ color: "#2d7a4f" }}
          >
            Ottimo!
          </p>
          <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
            Ti contatteremo per fissare un appuntamento e attivare insieme il
            tuo percorso GOL — ci pensiamo noi a guidarti in ogni passaggio.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Componente principale ───────────────────────────────────────────────────

export default function FormIscrizione({ corsoPreselezionato = null, onSuccess = null }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedCourses, setSelectedCourses] = useState(() => {
    if (!corsoPreselezionato) return [];
    return Array.isArray(corsoPreselezionato) ? corsoPreselezionato : [corsoPreselezionato];
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // 'success' | 'non_idoneo' | 'error'
  const [iscrizioneId, setIscrizioneId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const topRef = useRef(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleCF = useCallback((e) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, codice_fiscale: val }));
    setErrors((prev) => ({ ...prev, codice_fiscale: undefined }));
  }, []);

  const toggleCourse = useCallback((slug) => {
    setSelectedCourses((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      return [...prev, slug];
    });
    setErrors((prev) => ({ ...prev, corsi: undefined }));
  }, []);

  const toggleSede = useCallback((value) => {
    setFormData((prev) => {
      const current = prev.sedi_preferite;
      const next = current.includes(value)
        ? current.filter((s) => s !== value)
        : [...current, value];
      return { ...prev, sedi_preferite: next };
    });
    setErrors((prev) => ({ ...prev, sedi_preferite: undefined }));
  }, []);

  // Quando i corsi selezionati cambiano, rimuovi le sedi non più disponibili
  useEffect(() => {
    const soloGiardinaggio =
      selectedCourses.length > 0 &&
      selectedCourses.every((s) => s === SLUG_GIARDINAGGIO);
    const haLingua = selectedCourses.some((s) => SLUGS_LINGUE.has(s));
    const valid = new Set([
      ...(soloGiardinaggio ? [] : ["como"]),
      "tremezzina",
      ...(haLingua ? ["online"] : []),
    ]);
    setFormData((prev) => ({
      ...prev,
      sedi_preferite: prev.sedi_preferite.filter((s) => valid.has(s)),
    }));
  }, [selectedCourses]);

  // ─── Drag & Drop ───────────────────────────────────────────────────────────

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (e, index) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === index) {
        setDragIndex(null);
        setDragOverIndex(null);
        return;
      }
      setSelectedCourses((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(index, 0, moved);
        return next;
      });
      setDragIndex(null);
      setDragOverIndex(null);
    },
    [dragIndex]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  // ─── Validazione ───────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!formData.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!formData.cognome.trim()) e.cognome = "Il cognome è obbligatorio";
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email))
      e.email = "Inserisci un'email valida";
    if (!formData.telefono.trim()) e.telefono = "Il telefono è obbligatorio";
    if (!CF_REGEX.test(formData.codice_fiscale))
      e.codice_fiscale = "Codice fiscale non valido (es. RSSMRA85T10F205Z)";
    if (!formData.data_nascita)
      e.data_nascita = "La data di nascita è obbligatoria";
    if (!formData.comune_residenza.trim())
      e.comune_residenza = "Il comune di residenza è obbligatorio";
    if (!formData.indirizzo.trim()) e.indirizzo = "L'indirizzo è obbligatorio";
    if (!formData.status) e.status = "Seleziona la tua situazione lavorativa";
    if (selectedCourses.length === 0)
      e.corsi = "Seleziona almeno un corso di interesse";
    if (formData.sedi_preferite.length === 0)
      e.sedi_preferite = "Seleziona almeno una sede";
    if (!formData.consenso_gdpr)
      e.consenso_gdpr = "Il consenso al trattamento dei dati è obbligatorio";
    return e;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

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
          "Configurazione database non presente. Aggiungi le variabili NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY al file .env.local.",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { idoneo } = checkIdoneitaGol(formData.status);

      const { data: inserted, error: dbError } = await supabase
        .from("iscrizioni")
        .insert({
          nome: formData.nome.trim(),
          cognome: formData.cognome.trim(),
          email: formData.email.trim().toLowerCase(),
          telefono: formData.telefono.trim(),
          codice_fiscale: formData.codice_fiscale,
          data_nascita: formData.data_nascita,
          comune_residenza: formData.comune_residenza.trim(),
          cap_residenza: formData.cap_residenza.trim() || null,
          provincia_residenza: formData.provincia_residenza.trim() || null,
          nazione_residenza: formData.nazione_residenza.trim() || "Italia",
          indirizzo: formData.indirizzo.trim(),
          comune_domicilio: formData.comune_domicilio.trim() || null,
          indirizzo_domicilio: formData.indirizzo_domicilio.trim() || null,
          cap_domicilio: formData.cap_domicilio.trim() || null,
          provincia_domicilio: formData.provincia_domicilio.trim() || null,
          nazione_domicilio: formData.nazione_domicilio.trim() || null,
          status: formData.status,
          idoneo_gol: idoneo,
          corsi_interesse: selectedCourses,
          priorita_corsi: selectedCourses,
          come_saputo: formData.come_saputo || null,
          newsletter: formData.newsletter,
          sedi_preferite: formData.sedi_preferite,
          modalita_online: formData.sedi_preferite.includes("online"),
          stato: idoneo ? "nuovo" : "non_idoneo",
        })
        .select("id")
        .single();

      if (dbError) throw dbError;
      if (inserted?.id) setIscrizioneId(inserted.id);

      if (formData.newsletter) {
        await supabase.from("newsletter").upsert(
          { email: formData.email.trim().toLowerCase(), nome: formData.nome.trim(), attivo: true },
          { onConflict: "email", ignoreDuplicates: false }
        );
      }

      // Fire-and-forget: incrementa contatore interesse per ogni corso selezionato
      (async () => {
        for (const slug of selectedCourses) {
          const { data } = await supabase
            .from("corsi_interesse")
            .select("contatore")
            .eq("corso_slug", slug)
            .maybeSingle();
          if (data) {
            supabase
              .from("corsi_interesse")
              .update({ contatore: (data.contatore || 0) + 1, updated_at: new Date().toISOString() })
              .eq("corso_slug", slug);
          } else {
            supabase.from("corsi_interesse").insert({ corso_slug: slug, contatore: 1 });
          }
        }
      })();

      setSubmitResult(idoneo ? "success" : "non_idoneo");
      if (idoneo && onSuccess) onSuccess(formData.email.trim().toLowerCase());
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error("Form submit error:", err);
      setErrors({
        submit:
          "Si è verificato un errore durante l'invio. Riprova tra qualche minuto o contattaci direttamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Risultato post-submit ─────────────────────────────────────────────────

  if (submitResult === "success") {
    return (
      <div ref={topRef} className="flex flex-col gap-5">
        <QualificationFlow iscrizioneId={iscrizioneId} />
      </div>
    );
  }

  if (submitResult === "non_idoneo") {
    return (
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
        <h3 className="font-display font-bold text-2xl mb-3" style={{ color: "#2d7a4f" }}>
          Grazie per esserti registrato
        </h3>
        <p className="font-sans text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
          I corsi GOL sono riservati a chi non ha un contratto di lavoro attivo, ma questo non significa che non possiamo aiutarti. Ti contatteremo per capire la tua situazione e proporti percorsi formativi alternativi pensati per te.
        </p>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────────

  return (
    <form
      ref={topRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-8"
    >
      {/* Errore globale */}
      {errors.submit && (
        <div
          className="rounded-xl p-4 font-sans text-sm"
          style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}
        >
          {errors.submit}
        </div>
      )}

      {/* ── SEZIONE 1: Anagrafica ─────────────────────────────────────── */}
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

          <FormField
            label="Codice Fiscale"
            required
            error={errors.codice_fiscale}
          >
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

          <FormField
            label="Data di nascita"
            required
            error={errors.data_nascita}
          >
            <input
              type="date"
              name="data_nascita"
              value={formData.data_nascita}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(!!errors.data_nascita)}
            />
          </FormField>

          <FormField label="Indirizzo di residenza" required error={errors.indirizzo}>
            <input
              type="text"
              name="indirizzo"
              value={formData.indirizzo}
              onChange={handleChange}
              autoComplete="street-address"
              className={inputClass}
              style={inputStyle(!!errors.indirizzo)}
              placeholder="Via Roma 1"
            />
          </FormField>

          <FormField label="CAP residenza">
            <input
              type="text"
              name="cap_residenza"
              value={formData.cap_residenza}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="22100"
              maxLength={5}
            />
          </FormField>

          <FormField label="Comune di residenza" required error={errors.comune_residenza}>
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

          <FormField label="Provincia residenza">
            <input
              type="text"
              name="provincia_residenza"
              value={formData.provincia_residenza}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="CO"
              maxLength={2}
            />
          </FormField>

          <FormField label="Nazione residenza">
            <input
              type="text"
              name="nazione_residenza"
              value={formData.nazione_residenza}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="Italia"
            />
          </FormField>

          <FormField label="Indirizzo domicilio">
            <input
              type="text"
              name="indirizzo_domicilio"
              value={formData.indirizzo_domicilio || ""}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="Via Roma 1 (se diverso dalla residenza)"
            />
          </FormField>

          <FormField label="CAP domicilio">
            <input
              type="text"
              name="cap_domicilio"
              value={formData.cap_domicilio}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="22100 (opzionale)"
              maxLength={5}
            />
          </FormField>

          <FormField label="Comune di domicilio">
            <input
              type="text"
              name="comune_domicilio"
              value={formData.comune_domicilio}
              onChange={handleChange}
              autoComplete="address-level2"
              className={inputClass}
              style={inputStyle(false)}
              placeholder="Como (opzionale)"
            />
          </FormField>

          <FormField label="Provincia domicilio">
            <input
              type="text"
              name="provincia_domicilio"
              value={formData.provincia_domicilio}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="CO"
              maxLength={2}
            />
          </FormField>

          <FormField label="Nazione domicilio">
            <input
              type="text"
              name="nazione_domicilio"
              value={formData.nazione_domicilio}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle(false)}
              placeholder="Italia (opzionale)"
            />
          </FormField>
        </div>
      </section>

      {/* ── SEZIONE 2: Profilo ────────────────────────────────────────── */}
      <section>
        <SectionTitle>2. Situazione lavorativa</SectionTitle>
        <div className="max-w-md">
          <FormField
            label="Qual è la tua situazione attuale?"
            required
            error={errors.status}
          >
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              style={{ ...inputStyle(!!errors.status), cursor: "pointer" }}
            >
              <option value="">Seleziona…</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </section>

      {/* ── SEZIONE 3: Interessi ──────────────────────────────────────── */}
      <section>
        <SectionTitle>3. Corsi di interesse</SectionTitle>

        {/* Checkbox corsi */}
        <div>
          <p className="font-sans text-sm text-gray-500 mb-3">
            Seleziona uno o più corsi. Potrai poi ordinare le tue preferenze.{" "}
            <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {corsi.map((corso) => {
              const checked = selectedCourses.includes(corso.slug);
              return (
                <label
                  key={corso.slug}
                  className="flex items-start gap-3 rounded-xl p-3 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: checked ? "#f0f4f8" : "#f9fafb",
                    border: `1.5px solid ${checked ? "#1a2e5a" : "#e5e7eb"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCourse(corso.slug)}
                    className="mt-0.5 shrink-0 w-4 h-4 rounded"
                    style={{ accentColor: "#1a2e5a" }}
                  />
                  <div>
                    <span
                      className="font-sans font-semibold text-sm block"
                      style={{ color: "#1a2e5a" }}
                    >
                      {corso.titolo}
                    </span>
                    <span className="font-sans text-xs text-gray-400">
                      {corso.durata} · {corso.sede}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.corsi && (
            <p className="font-sans text-red-500 text-xs mt-2">{errors.corsi}</p>
          )}
        </div>

        {/* Drag-to-reorder priorità */}
        {selectedCourses.length > 1 && (
          <div className="mt-6">
            <p className="font-sans font-semibold text-sm mb-2" style={{ color: "#1a2e5a" }}>
              La tua priorità
              <span className="font-normal text-gray-400 ml-2">
                (trascina per riordinare — 1 = prima scelta)
              </span>
            </p>
            <p className="font-sans text-xs text-gray-400 mb-3 sm:hidden">
              Su mobile: l&apos;ordine di selezione determina la priorità.
            </p>
            <ol className="flex flex-col gap-2">
              {selectedCourses.map((slug, index) => {
                const corso = corsi.find((c) => c.slug === slug);
                if (!corso) return null;
                const isDragging = dragIndex === index;
                const isDragOver = dragOverIndex === index && dragIndex !== index;
                return (
                  <li
                    key={slug}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 select-none transition-all"
                    style={{
                      backgroundColor: isDragOver ? "#e8f0fe" : "#f9fafb",
                      border: `1.5px solid ${isDragOver ? "#1a2e5a" : "#e5e7eb"}`,
                      opacity: isDragging ? 0.5 : 1,
                      cursor: "grab",
                    }}
                  >
                    {/* Handle */}
                    <span
                      className="text-gray-400 shrink-0 select-none hidden sm:block"
                      title="Trascina per riordinare"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM7 8a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm-6 6a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                    {/* Numero priorità */}
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white font-sans font-bold text-xs shrink-0"
                      style={{ backgroundColor: "#1a2e5a" }}
                    >
                      {index + 1}
                    </span>
                    {/* Nome corso */}
                    <span className="font-sans text-sm font-medium flex-1" style={{ color: "#1a2e5a" }}>
                      {corso.titolo}
                    </span>
                    {/* Rimuovi */}
                    <button
                      type="button"
                      onClick={() => toggleCourse(slug)}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                      aria-label={`Rimuovi ${corso.titolo}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Come saputo */}
        <div className="mt-5 max-w-xs">
          <FormField label="Come hai saputo di noi?">
            <select
              name="come_saputo"
              value={formData.come_saputo}
              onChange={handleChange}
              className={inputClass}
              style={{ ...inputStyle(false), cursor: "pointer" }}
            >
              <option value="">Seleziona (opzionale)</option>
              {COME_SAPUTO_OPTIONS.map((opt) => (
                <option key={opt} value={opt.toLowerCase().replace(/\s+/g, "_")}>
                  {opt}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </section>

      {/* ── SEZIONE 4: Sede preferita ────────────────────────────────── */}
      <section>
        <SectionTitle>4. Sede preferita</SectionTitle>
        {(() => {
          const soloGiardinaggio =
            selectedCourses.length > 0 &&
            selectedCourses.every((s) => s === SLUG_GIARDINAGGIO);
          const haLingua = selectedCourses.some((s) => SLUGS_LINGUE.has(s));
          const sediOptions = [
            ...(soloGiardinaggio
              ? []
              : [{ value: "como", label: "Como", desc: "c/o Starting Work, Piazzale Monte Santo 4" }]),
            { value: "tremezzina", label: "Tremezzina", desc: "c/o Coop. Azalea" },
            ...(haLingua
              ? [{ value: "online", label: "Online", desc: "disponibile solo per i corsi di lingue" }]
              : []),
          ];
          return (
            <div className="flex flex-col gap-3">
              <p className="font-sans text-sm text-gray-500">
                Seleziona la sede in cui preferiresti frequentare il corso.{" "}
                <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-col gap-2">
                {sediOptions.map((sede) => {
                  const checked = formData.sedi_preferite.includes(sede.value);
                  return (
                    <label
                      key={sede.value}
                      className="flex items-start gap-3 rounded-xl p-4 cursor-pointer transition-colors"
                      style={{
                        backgroundColor: checked ? "#f0f4f8" : "#f9fafb",
                        border: `1.5px solid ${checked ? "#1a2e5a" : "#e5e7eb"}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSede(sede.value)}
                        className="mt-0.5 w-4 h-4 rounded shrink-0"
                        style={{ accentColor: "#1a2e5a" }}
                      />
                      <div>
                        <span
                          className="font-sans font-semibold text-sm block"
                          style={{ color: "#1a2e5a" }}
                        >
                          {sede.label}
                        </span>
                        <span className="font-sans text-xs text-gray-400">{sede.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.sedi_preferite && (
                <p className="font-sans text-red-500 text-xs mt-1">{errors.sedi_preferite}</p>
              )}
            </div>
          );
        })()}
      </section>

      {/* ── SEZIONE 5: Consensi ───────────────────────────────────────── */}
      <section>
        <SectionTitle>5. Privacy e consensi</SectionTitle>
        <div className="flex flex-col gap-4">
          {/* GDPR obbligatorio */}
          <div>
            <label
              className="flex items-start gap-3 cursor-pointer"
            >
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
                <a
                  href="#"
                  className="underline"
                  style={{ color: "#1a2e5a" }}
                >
                  informativa sulla privacy
                </a>{" "}
                e acconsento al trattamento dei miei dati personali ai sensi
                del GDPR (Reg. UE 2016/679) per la gestione della mia
                iscrizione ai corsi GOL.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consenso_gdpr && (
              <p className="font-sans text-red-500 text-xs mt-1 ml-7">
                {errors.consenso_gdpr}
              </p>
            )}
          </div>

          {/* Newsletter opzionale */}
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
              Desidero ricevere aggiornamenti sui nuovi corsi e le attività di
              Mestieri Lombardia – Starting Work (opzionale, disiscrizione
              sempre possibile).
            </span>
          </label>
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────────────────── */}
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
            "Invia la richiesta di iscrizione"
          )}
        </button>

        <p className="font-sans text-xs text-gray-400 mt-3">
          I campi contrassegnati con{" "}
          <span className="text-red-500">*</span> sono obbligatori.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
