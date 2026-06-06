"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIVA_REGEX = /^[0-9]{11}$/;

const PERCORSI = [
  { label: "AI Academy — Intelligenza Artificiale", disponibile: true },
  { label: "Trasformazione Digitale", disponibile: false },
  { label: "Sostenibilità e Transizione Ecologica", disponibile: false },
  { label: "Leadership e Soft Skill", disponibile: false },
  { label: "Lingue per il Business", disponibile: false },
];

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:ring-2";

function inputStyle(hasError) {
  return {
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    "--tw-ring-color": hasError ? "#ef444440" : "#8b000040",
  };
}

function SectionTitle({ children }) {
  return (
    <div className="mb-5">
      <h3 className="font-display font-bold text-lg pb-2 border-b" style={{ color: "#1a2e5a", borderColor: "#e2e8f0" }}>
        {children}
      </h3>
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="font-sans text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

const INITIAL = {
  nome: "", cognome: "", email: "", telefono: "",
  ragione_sociale: "", partita_iva: "", codice_fiscale_azienda: "",
  indirizzo_fatturazione: "", cap_fatturazione: "", citta_fatturazione: "",
  provincia_fatturazione: "", percorso_interesse: "", note: "",
  consenso_gdpr: false, newsletter: false,
};

// Upsert anagrafica unificata — sovrascrive solo i campi non vuoti
async function upsertContatto(email, fields) {
  if (!supabase) return null;
  const update = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== null && v !== undefined && String(v).trim() !== "") update[k] = v;
  }
  const { data } = await supabase
    .from("contatti")
    .upsert({ email, ...update }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .maybeSingle();
  return data?.id ?? null;
}

async function logInterazione(contatto_id, canale, tipo, oggetto, dati) {
  if (!supabase || !contatto_id) return;
  await supabase.from("interazioni").insert({ contatto_id, canale, tipo, oggetto, dati });
}

export default function FormIscrizioneImpresa() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contattoTrovato, setContattoTrovato] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const topRef = useRef(null);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Auto-fill: cerca per email nel DB unificato
  const handleEmailBlur = useCallback(async (e) => {
    const email = e.target.value.toLowerCase().trim();
    if (!EMAIL_REGEX.test(email)) return;
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/lookup-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data) {
        setContattoTrovato(true);
        setForm((prev) => ({
          ...prev,
          nome:                  data.nome                || prev.nome,
          cognome:               data.cognome             || prev.cognome,
          telefono:              data.telefono            || prev.telefono,
          ragione_sociale:       data.ragione_sociale     || prev.ragione_sociale,
          partita_iva:           data.partita_iva         || prev.partita_iva,
          codice_fiscale_azienda: data.codice_fiscale     || prev.codice_fiscale_azienda,
          indirizzo_fatturazione: data.indirizzo          || prev.indirizzo_fatturazione,
          cap_fatturazione:      data.cap                 || prev.cap_fatturazione,
          citta_fatturazione:    data.citta               || prev.citta_fatturazione,
          provincia_fatturazione: data.provincia          || prev.provincia_fatturazione,
        }));
      } else {
        setContattoTrovato(false);
      }
    } catch {
      setContattoTrovato(false);
    } finally {
      setLookupLoading(false);
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.cognome.trim()) e.cognome = "Il cognome è obbligatorio";
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) e.email = "Inserisci un'email valida";
    if (!form.telefono.trim()) e.telefono = "Il telefono è obbligatorio";
    if (!form.ragione_sociale.trim()) e.ragione_sociale = "Inserisci ragione sociale o nome";
    if (form.partita_iva && !PIVA_REGEX.test(form.partita_iva.replace(/\s/g, ""))) e.partita_iva = "P.IVA non valida (11 cifre)";
    if (!form.indirizzo_fatturazione.trim()) e.indirizzo_fatturazione = "Indirizzo obbligatorio";
    if (!form.citta_fatturazione.trim()) e.citta_fatturazione = "Città obbligatoria";
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
    if (!supabase) { setErrors({ submit: "Configurazione database non presente." }); return; }

    setLoading(true);
    setErrors({});
    try {
      const email = form.email.trim().toLowerCase();

      // 1. Upsert anagrafica unificata
      const contatto_id = await upsertContatto(email, {
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        telefono: form.telefono.trim(),
        ragione_sociale: form.ragione_sociale.trim(),
        partita_iva: form.partita_iva.trim() || null,
        codice_fiscale: form.codice_fiscale_azienda.trim() || null,
        indirizzo: form.indirizzo_fatturazione.trim(),
        cap: form.cap_fatturazione.trim() || null,
        citta: form.citta_fatturazione.trim(),
        provincia: form.provincia_fatturazione.trim() || null,
        newsletter: form.newsletter,
      });

      // 2. Iscrizione dettagliata
      const { error: dbError } = await supabase.from("iscrizioni_impresa").insert({
        contatto_id,
        nome: form.nome.trim(), cognome: form.cognome.trim(),
        email, telefono: form.telefono.trim(),
        ragione_sociale: form.ragione_sociale.trim(),
        partita_iva: form.partita_iva.trim() || null,
        codice_fiscale_azienda: form.codice_fiscale_azienda.trim() || null,
        indirizzo_fatturazione: form.indirizzo_fatturazione.trim(),
        cap_fatturazione: form.cap_fatturazione.trim() || null,
        citta_fatturazione: form.citta_fatturazione.trim(),
        provincia_fatturazione: form.provincia_fatturazione.trim() || null,
        percorso_interesse: form.percorso_interesse || null,
        note: form.note.trim() || null,
        newsletter: form.newsletter,
      });
      if (dbError) throw dbError;

      // 3. Log interazione
      await logInterazione(contatto_id, "impresa_iscrizione", "iscrizione", form.percorso_interesse || "Formazione Impresa", {
        ragione_sociale: form.ragione_sociale.trim(),
        percorso: form.percorso_interesse,
      });

      if (form.newsletter) {
        await supabase.from("newsletter").upsert(
          { email, nome: form.nome.trim(), attivo: true },
          { onConflict: "email", ignoreDuplicates: false }
        );
      }

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
      <div ref={topRef} className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#fff5f5", border: "2px solid #8b0000" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#8b0000" }}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-2xl mb-3" style={{ color: "#8b0000" }}>Iscrizione ricevuta!</h3>
        <p className="font-sans text-gray-600 text-base leading-relaxed max-w-lg mx-auto">
          Abbiamo registrato la tua richiesta. Ti contatteremo entro 24 ore per confermare i dettagli di iscrizione e il percorso di pagamento.
        </p>
      </div>
    );
  }

  return (
    <form ref={topRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {errors.submit && (
        <div className="rounded-xl p-4 font-sans text-sm" style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}>
          {errors.submit}
        </div>
      )}

      {/* 1. Dati personali */}
      <section>
        <SectionTitle>1. Dati personali</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Email" required error={errors.email}>
            <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleEmailBlur}
              autoComplete="email" className={inputClass} style={inputStyle(!!errors.email)} placeholder="mario.rossi@azienda.it" />
          </FormField>
          <div className="flex items-end pb-0.5">
            {lookupLoading && (
              <span className="font-sans text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent inline-block" style={{ animation: "spin 0.7s linear infinite" }} />
                Ricerca in archivio…
              </span>
            )}
            {!lookupLoading && contattoTrovato && (
              <span className="font-sans text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#f0fdf4", color: "#065f46", border: "1px solid #a7f3d0" }}>
                ✓ Dati trovati — campi precompilati
              </span>
            )}
          </div>
          <FormField label="Nome" required error={errors.nome}>
            <input type="text" name="nome" value={form.nome} onChange={handleChange}
              autoComplete="given-name" className={inputClass} style={inputStyle(!!errors.nome)} placeholder="Mario" />
          </FormField>
          <FormField label="Cognome" required error={errors.cognome}>
            <input type="text" name="cognome" value={form.cognome} onChange={handleChange}
              autoComplete="family-name" className={inputClass} style={inputStyle(!!errors.cognome)} placeholder="Rossi" />
          </FormField>
          <FormField label="Telefono" required error={errors.telefono}>
            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
              autoComplete="tel" className={inputClass} style={inputStyle(!!errors.telefono)} placeholder="+39 333 1234567" />
          </FormField>
        </div>
      </section>

      {/* 2. Dati azienda / fatturazione */}
      <section>
        <SectionTitle>2. Dati azienda e fatturazione</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Ragione sociale / Nome e Cognome" required error={errors.ragione_sociale}>
            <input type="text" name="ragione_sociale" value={form.ragione_sociale} onChange={handleChange}
              className={inputClass} style={inputStyle(!!errors.ragione_sociale)} placeholder="Rossi S.r.l. oppure Mario Rossi" />
          </FormField>
          <FormField label="Partita IVA" error={errors.partita_iva}>
            <input type="text" name="partita_iva" value={form.partita_iva} onChange={handleChange}
              maxLength={11} className={inputClass} style={{ ...inputStyle(!!errors.partita_iva), fontFamily: "monospace" }} placeholder="12345678901" />
          </FormField>
          <FormField label="Codice Fiscale (azienda o persona fisica)">
            <input type="text" name="codice_fiscale_azienda" value={form.codice_fiscale_azienda} onChange={handleChange}
              maxLength={16} className={inputClass} style={{ ...inputStyle(false), fontFamily: "monospace" }} placeholder="RSSMRA85T10F205Z" />
          </FormField>
          <FormField label="Indirizzo di fatturazione" required error={errors.indirizzo_fatturazione}>
            <input type="text" name="indirizzo_fatturazione" value={form.indirizzo_fatturazione} onChange={handleChange}
              className={inputClass} style={inputStyle(!!errors.indirizzo_fatturazione)} placeholder="Via Roma 1" />
          </FormField>
          <FormField label="CAP">
            <input type="text" name="cap_fatturazione" value={form.cap_fatturazione} onChange={handleChange}
              maxLength={5} className={inputClass} style={inputStyle(false)} placeholder="22100" />
          </FormField>
          <FormField label="Città" required error={errors.citta_fatturazione}>
            <input type="text" name="citta_fatturazione" value={form.citta_fatturazione} onChange={handleChange}
              className={inputClass} style={inputStyle(!!errors.citta_fatturazione)} placeholder="Como" />
          </FormField>
          <FormField label="Provincia">
            <input type="text" name="provincia_fatturazione" value={form.provincia_fatturazione} onChange={handleChange}
              maxLength={2} className={inputClass} style={inputStyle(false)} placeholder="CO" />
          </FormField>
        </div>
      </section>

      {/* 3. Percorso */}
      <section>
        <SectionTitle>3. Percorso di interesse</SectionTitle>
        <div className="max-w-md">
          <FormField label="A quale percorso sei interessato?">
            <select name="percorso_interesse" value={form.percorso_interesse} onChange={handleChange}
              className={inputClass} style={{ ...inputStyle(false), cursor: "pointer" }}>
              <option value="">Seleziona (opzionale)</option>
              {PERCORSI.map((p) => (
                <option key={p.label} value={p.label} disabled={!p.disponibile}>
                  {p.disponibile ? p.label : `${p.label} — prossimamente`}
                </option>
              ))}
            </select>
          </FormField>
          <p className="font-sans text-xs mt-2" style={{ color: "#92400e" }}>
            Gli altri percorsi sono in fase di definizione e saranno disponibili prossimamente.
          </p>
        </div>
        <div className="mt-4">
          <FormField label="Note aggiuntive">
            <textarea name="note" value={form.note} onChange={handleChange} rows={3}
              className={inputClass} style={inputStyle(false)} placeholder="Eventuali informazioni utili per gestire la tua iscrizione…" />
          </FormField>
        </div>
      </section>

      {/* 4. Privacy */}
      <section>
        <SectionTitle>4. Privacy e consensi</SectionTitle>
        <div className="flex flex-col gap-4">
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="consenso_gdpr" checked={form.consenso_gdpr} onChange={handleChange}
                className="mt-1 w-4 h-4 rounded shrink-0" style={{ accentColor: "#8b0000" }} />
              <span className="font-sans text-sm text-gray-700 leading-relaxed">
                Ho letto l&apos;{" "}
                <a href="/privacy-policy" target="_blank" className="underline" style={{ color: "#8b0000" }}>informativa sulla privacy</a>{" "}
                e acconsento al trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679) per la gestione della mia iscrizione.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consenso_gdpr && <p className="font-sans text-red-500 text-xs mt-1 ml-7">{errors.consenso_gdpr}</p>}
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handleChange}
              className="mt-1 w-4 h-4 rounded shrink-0" style={{ accentColor: "#8b0000" }} />
            <span className="font-sans text-sm text-gray-700 leading-relaxed">
              Desidero ricevere aggiornamenti sui percorsi formativi e le opportunità di Formazione Impresa (opzionale).
            </span>
          </label>
        </div>
      </section>

      <div className="pt-2">
        <button type="submit" disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-sans font-semibold text-white rounded-xl transition-all duration-200"
          style={{ backgroundColor: loading ? "#6b7280" : "#8b0000", minHeight: "52px", padding: "0 2.5rem", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? (
            <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" style={{ animation: "spin 0.7s linear infinite" }} />Invio in corso…</>
          ) : "Invia la richiesta di iscrizione"}
        </button>
        <p className="font-sans text-xs text-gray-400 mt-3">I campi contrassegnati con <span className="text-red-500">*</span> sono obbligatori.</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
