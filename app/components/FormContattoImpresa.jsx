"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:ring-2";

function inputStyle(hasError) {
  return {
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    "--tw-ring-color": hasError ? "#ef444440" : "#8b000040",
  };
}

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

const INITIAL = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  azienda: "",
  messaggio: "",
  consenso_gdpr: false,
};

export default function FormContattoImpresa() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const topRef = useRef(null);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.cognome.trim()) e.cognome = "Il cognome è obbligatorio";
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) e.email = "Inserisci un'email valida";
    if (!form.telefono.trim()) e.telefono = "Il telefono è obbligatorio";
    if (!form.consenso_gdpr) e.consenso_gdpr = "Il consenso al trattamento dei dati è obbligatorio";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!supabase) {
      setErrors({ submit: "Configurazione database non presente." });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const { error: dbError } = await supabase.from("contatti_impresa").insert({
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        azienda: form.azienda.trim() || null,
        messaggio: form.messaggio.trim() || null,
      });
      if (dbError) throw dbError;
      setSuccess(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Si è verificato un errore durante l'invio. Riprova o contattaci direttamente." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        ref={topRef}
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: "#fff5f5", border: "2px solid #8b0000" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#8b0000" }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-2xl mb-3" style={{ color: "#8b0000" }}>
          Richiesta inviata!
        </h3>
        <p className="font-sans text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
          Abbiamo ricevuto la tua richiesta di contatto. Ti risponderemo entro 24 ore
          per capire come possiamo supportarti al meglio.
        </p>
      </div>
    );
  }

  return (
    <form ref={topRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {errors.submit && (
        <div
          className="rounded-xl p-4 font-sans text-sm"
          style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}
        >
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nome" required error={errors.nome}>
          <input type="text" name="nome" value={form.nome} onChange={handleChange}
            autoComplete="given-name" className={inputClass} style={inputStyle(!!errors.nome)} placeholder="Mario" />
        </FormField>
        <FormField label="Cognome" required error={errors.cognome}>
          <input type="text" name="cognome" value={form.cognome} onChange={handleChange}
            autoComplete="family-name" className={inputClass} style={inputStyle(!!errors.cognome)} placeholder="Rossi" />
        </FormField>
        <FormField label="Email" required error={errors.email}>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            autoComplete="email" className={inputClass} style={inputStyle(!!errors.email)} placeholder="mario.rossi@azienda.it" />
        </FormField>
        <FormField label="Telefono" required error={errors.telefono}>
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
            autoComplete="tel" className={inputClass} style={inputStyle(!!errors.telefono)} placeholder="+39 333 1234567" />
        </FormField>
        <FormField label="Azienda / Organizzazione">
          <input type="text" name="azienda" value={form.azienda} onChange={handleChange}
            className={inputClass} style={inputStyle(false)} placeholder="Rossi S.r.l. (opzionale)" />
        </FormField>
      </div>

      <FormField label="Come possiamo aiutarti?">
        <textarea name="messaggio" value={form.messaggio} onChange={handleChange} rows={4}
          className={inputClass} style={inputStyle(false)}
          placeholder="Descrivi brevemente le tue esigenze formative o le domande che hai…" />
      </FormField>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="consenso_gdpr" checked={form.consenso_gdpr} onChange={handleChange}
            className="mt-1 w-4 h-4 rounded shrink-0" style={{ accentColor: "#8b0000" }} />
          <span className="font-sans text-sm text-gray-700 leading-relaxed">
            Ho letto l&apos;{" "}
            <a href="/privacy-policy" target="_blank" className="underline" style={{ color: "#8b0000" }}>
              informativa sulla privacy
            </a>{" "}
            e acconsento al trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679).{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consenso_gdpr && (
          <p className="font-sans text-red-500 text-xs mt-1 ml-7">{errors.consenso_gdpr}</p>
        )}
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-sans font-semibold text-white rounded-xl transition-all duration-200"
          style={{
            backgroundColor: loading ? "#6b7280" : "#8b0000",
            minHeight: "52px",
            padding: "0 2.5rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                style={{ animation: "spin 0.7s linear infinite" }} />
              Invio in corso…
            </>
          ) : (
            "Invia la richiesta"
          )}
        </button>
        <p className="font-sans text-xs text-gray-400 mt-3">
          I campi contrassegnati con <span className="text-red-500">*</span> sono obbligatori.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
