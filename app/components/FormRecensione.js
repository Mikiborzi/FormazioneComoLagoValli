"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import { corsi } from "@/app/data/corsi";

const ANNI = ["2026", "2025", "2024", "2023", "2022"];

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Valutazione">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} ${star === 1 ? "stella" : "stelle"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
        >
          <svg
            className="w-8 h-8"
            fill={(hovered || value) >= star ? "#c8941a" : "#e5e7eb"}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
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

function FieldError({ msg }) {
  return msg ? (
    <p className="font-sans text-red-500 text-xs mt-0.5">{msg}</p>
  ) : null;
}

export default function FormRecensione() {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    corso_slug: "",
    anno: "",
    valutazione: 0,
    testo: "",
    consenso_gdpr: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleStars = useCallback((val) => {
    setForm((prev) => ({ ...prev, valutazione: val }));
    setErrors((prev) => ({ ...prev, valutazione: undefined }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.cognome.trim()) e.cognome = "Il cognome è obbligatorio";
    if (!form.corso_slug) e.corso_slug = "Seleziona il corso frequentato";
    if (!form.anno) e.anno = "Seleziona l'anno di frequenza";
    if (!form.valutazione) e.valutazione = "Seleziona una valutazione";
    if (!form.testo.trim() || form.testo.trim().length < 20)
      e.testo = "Scrivi almeno 20 caratteri";
    if (!form.consenso_gdpr) e.consenso_gdpr = "Il consenso è obbligatorio";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!supabase) {
      setErrors({ submit: "Configurazione database non presente." });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const corso = corsi.find((c) => c.slug === form.corso_slug);
      const { error } = await supabase.from("recensioni").insert({
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        corso: corso?.titolo ?? form.corso_slug,
        corso_slug: form.corso_slug,
        anno: parseInt(form.anno, 10),
        valutazione: form.valutazione,
        testo: form.testo.trim(),
        visibile: true,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error("Errore Supabase:", err);
      const msg = err?.message ?? err?.details ?? JSON.stringify(err);
      setErrors({ submit: `Errore: ${msg}` });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: "#f0faf5", border: "2px solid #2d7a4f" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#2d7a4f" }}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "#2d7a4f" }}>
          Grazie per la tua recensione!
        </h3>
        <p className="font-sans text-gray-600 text-sm">
          Sarà pubblicata a breve dopo una breve verifica.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.submit && (
        <div
          className="rounded-xl p-4 font-sans text-sm"
          style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}
        >
          {errors.submit}
        </div>
      )}

      {/* Nome / Cognome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle(!!errors.nome)}
            placeholder="Mario"
          />
          <FieldError msg={errors.nome} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
            Cognome <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cognome"
            value={form.cognome}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle(!!errors.cognome)}
            placeholder="Rossi"
          />
          <FieldError msg={errors.cognome} />
        </div>
      </div>

      {/* Corso / Anno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
            Corso frequentato <span className="text-red-500">*</span>
          </label>
          <select
            name="corso_slug"
            value={form.corso_slug}
            onChange={handleChange}
            className={inputClass}
            style={{ ...inputStyle(!!errors.corso_slug), cursor: "pointer" }}
          >
            <option value="">Seleziona il corso…</option>
            {corsi.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.titolo}{c.livello ? ` (${c.livello})` : ""}
              </option>
            ))}
          </select>
          <FieldError msg={errors.corso_slug} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
            Anno di frequenza <span className="text-red-500">*</span>
          </label>
          <select
            name="anno"
            value={form.anno}
            onChange={handleChange}
            className={inputClass}
            style={{ ...inputStyle(!!errors.anno), cursor: "pointer" }}
          >
            <option value="">Seleziona l'anno…</option>
            {ANNI.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <FieldError msg={errors.anno} />
        </div>
      </div>

      {/* Stelle */}
      <div className="flex flex-col gap-1">
        <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
          Valutazione <span className="text-red-500">*</span>
        </label>
        <StarPicker value={form.valutazione} onChange={handleStars} />
        <FieldError msg={errors.valutazione} />
      </div>

      {/* Testo */}
      <div className="flex flex-col gap-1">
        <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
          La tua recensione <span className="text-red-500">*</span>
        </label>
        <textarea
          name="testo"
          value={form.testo}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          style={{ ...inputStyle(!!errors.testo), resize: "vertical" }}
          placeholder="Racconta la tua esperienza con il corso (min. 20 caratteri)…"
        />
        <div className="flex justify-between items-center">
          <FieldError msg={errors.testo} />
          <span className="font-sans text-xs text-gray-400 ml-auto">
            {form.testo.trim().length}/20 min
          </span>
        </div>
      </div>

      {/* GDPR */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consenso_gdpr"
            checked={form.consenso_gdpr}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded shrink-0"
            style={{ accentColor: "#1a2e5a" }}
          />
          <span className="font-sans text-sm text-gray-700 leading-relaxed">
            Acconsento al trattamento dei miei dati personali ai sensi del GDPR per la pubblicazione
            della recensione. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consenso_gdpr && (
          <p className="font-sans text-red-500 text-xs mt-1 ml-7">{errors.consenso_gdpr}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-sans font-semibold text-white rounded-xl transition-all duration-200"
        style={{
          backgroundColor: loading ? "#6b7280" : "#1a2e5a",
          minHeight: "48px",
          padding: "0 2rem",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <span
              className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
              style={{ animation: "spin 0.7s linear infinite" }}
            />
            Invio in corso…
          </>
        ) : (
          "Invia recensione"
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
