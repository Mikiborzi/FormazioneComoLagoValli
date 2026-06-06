"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIPOLOGIE = [
  { value: "dipendente",           label: "Lavoratore dipendente" },
  { value: "imprenditore",         label: "Imprenditore / Titolare d'azienda" },
  { value: "libero_professionista",label: "Libero professionista / Autonomo" },
  { value: "consulente",           label: "Consulente" },
  { value: "altro",                label: "Altro" },
];

const inputClass =
  "w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:ring-2";

function inputStyle(hasError) {
  return {
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    "--tw-ring-color": hasError ? "#ef444440" : "#92400e40",
  };
}

const INITIAL = {
  nome: "", cognome: "", email: "", telefono: "",
  tipologia: "", azienda: "", consenso_gdpr: false,
};

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

export default function FormListaAttesaVoucher() {
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
          nome:     data.nome             || prev.nome,
          cognome:  data.cognome          || prev.cognome,
          telefono: data.telefono         || prev.telefono,
          azienda:  data.ragione_sociale  || data.azienda || prev.azienda,
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
    if (!form.consenso_gdpr) e.consenso_gdpr = "Il consenso è obbligatorio";
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

      const contatto_id = await upsertContatto(email, {
        nome: form.nome.trim(),
        cognome: form.cognome.trim(),
        telefono: form.telefono.trim() || null,
        azienda: form.azienda.trim() || null,
      });

      await supabase.from("interazioni").insert({
        contatto_id,
        canale: "voucher_attesa",
        tipo: "interesse",
        oggetto: "Lista attesa — Voucher Formazione Continua Regione Lombardia",
        dati: {
          tipologia: form.tipologia || null,
          azienda: form.azienda.trim() || null,
        },
      });

      setSuccess(true);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Si è verificato un errore. Riprova o scrivici a como@mestierilombardia.it" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div ref={topRef} className="rounded-2xl p-8 text-center" style={{ backgroundColor: "white", border: "2px solid #fcd34d" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#92400e" }}>
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-xl mb-2" style={{ color: "#92400e" }}>
          Sei in lista!
        </h3>
        <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
          Ti contatteremo non appena l&apos;avviso attuativo di Regione Lombardia sarà pubblicato
          e i percorsi saranno inseribili nel catalogo voucher.
        </p>
      </div>
    );
  }

  return (
    <form ref={topRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.submit && (
        <div className="rounded-xl p-4 font-sans text-sm" style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5" }}>
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email prima — attiva il lookup */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleEmailBlur}
              autoComplete="email" className={inputClass} style={inputStyle(!!errors.email)} placeholder="mario.rossi@azienda.it" />
            {errors.email && <p className="font-sans text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="flex items-end pb-1">
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
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>Nome <span className="text-red-500">*</span></label>
          <input type="text" name="nome" value={form.nome} onChange={handleChange}
            autoComplete="given-name" className={inputClass} style={inputStyle(!!errors.nome)} placeholder="Mario" />
          {errors.nome && <p className="font-sans text-red-500 text-xs">{errors.nome}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>Cognome <span className="text-red-500">*</span></label>
          <input type="text" name="cognome" value={form.cognome} onChange={handleChange}
            autoComplete="family-name" className={inputClass} style={inputStyle(!!errors.cognome)} placeholder="Rossi" />
          {errors.cognome && <p className="font-sans text-red-500 text-xs">{errors.cognome}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>Telefono</label>
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
            autoComplete="tel" className={inputClass} style={inputStyle(false)} placeholder="+39 333 1234567 (opzionale)" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>Tipologia</label>
          <select name="tipologia" value={form.tipologia} onChange={handleChange}
            className={inputClass} style={{ ...inputStyle(false), cursor: "pointer" }}>
            <option value="">Seleziona (opzionale)</option>
            {TIPOLOGIE.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="font-sans font-medium text-sm" style={{ color: "#374151" }}>Azienda / Organizzazione</label>
          <input type="text" name="azienda" value={form.azienda} onChange={handleChange}
            className={inputClass} style={inputStyle(false)} placeholder="Nome azienda (opzionale)" />
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="consenso_gdpr" checked={form.consenso_gdpr} onChange={handleChange}
            className="mt-1 w-4 h-4 rounded shrink-0" style={{ accentColor: "#92400e" }} />
          <span className="font-sans text-sm text-gray-700 leading-relaxed">
            Ho letto l&apos;{" "}
            <a href="/privacy-policy" target="_blank" className="underline" style={{ color: "#92400e" }}>informativa sulla privacy</a>{" "}
            e acconsento al trattamento dei miei dati personali per ricevere aggiornamenti sul voucher.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consenso_gdpr && <p className="font-sans text-red-500 text-xs mt-1 ml-7">{errors.consenso_gdpr}</p>}
      </div>

      <div>
        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-2 font-sans font-semibold rounded-xl transition-all duration-200"
          style={{ backgroundColor: loading ? "#6b7280" : "#92400e", color: "white", minHeight: "48px", padding: "0 2rem", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? (
            <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" style={{ animation: "spin 0.7s linear infinite" }} />Invio…</>
          ) : "Avvisami quando il voucher è attivo →"}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
