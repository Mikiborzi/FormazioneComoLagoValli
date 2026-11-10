"use client";

import { useEffect, useState } from "react";
import { SERATA_AI, INTERESSI_SERATA } from "@/app/lib/serataAi";

// Modulo di iscrizione alla serata di presentazione AI Academy.
// Pensato per fondo scuro (palette AI Academy). Invia a /api/serata-ai.

const CREAM = "#ece8e1";
const CLAY = "#c1440e";
const CLAY_LIGHT = "#d96a3f";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  azienda: "",
  ruolo: "",
  num_persone: "1",
  interessi: [],
  messaggio: "",
  consenso_privacy: false,
  consenso_marketing: false,
  sito_web: "", // trappola anti-bot
};

const inputClass =
  "w-full rounded-xl px-4 py-3 font-sans text-base outline-none transition-colors";

function inputStyle(errore) {
  return {
    backgroundColor: "rgba(236,232,225,0.06)",
    border: `1px solid ${errore ? "#f87171" : "rgba(236,232,225,0.2)"}`,
    color: CREAM,
  };
}

function Campo({ id, label, obbligatorio, errore, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-sm font-medium" style={{ color: "rgba(236,232,225,0.8)" }}>
        {label}
        {obbligatorio && <span style={{ color: CLAY_LIGHT }}> *</span>}
      </label>
      {children}
      {errore && <p className="font-sans text-xs" style={{ color: "#fca5a5" }}>{errore}</p>}
    </div>
  );
}

export default function FormSerataAi() {
  const [form, setForm] = useState(INITIAL);
  const [errori, setErrori] = useState({});
  const [invio, setInvio] = useState(false);
  const [esito, setEsito] = useState(null); // null | 'ok' | 'gia' | 'chiuso' | 'esauriti'
  const [erroreServer, setErroreServer] = useState("");
  // Posti ancora liberi secondo il server (null = non ancora noto).
  const [postiResidui, setPostiResidui] = useState(null);

  // All'apertura chiediamo al server se ci sono ancora posti: a posti
  // esauriti (o a iscrizioni scadute) il modulo non viene mostrato.
  useEffect(() => {
    let annullato = false;
    fetch("/api/serata-ai", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((stato) => {
        if (annullato || !stato) return;
        if (!stato.aperte) {
          setEsito(stato.motivo === "esauriti" ? "esauriti" : "chiuso");
          return;
        }
        setPostiResidui(stato.postiResidui);
      })
      .catch(() => {}); // senza risposta il modulo resta utilizzabile: decide il server all'invio
    return () => {
      annullato = true;
    };
  }, []);

  // Il menu "quante persone" non offre più posti di quelli rimasti.
  const maxPersone = postiResidui == null ? 5 : Math.max(1, Math.min(5, postiResidui));
  useEffect(() => {
    if (Number(form.num_persone) > maxPersone) {
      setForm((f) => ({ ...f, num_persone: String(maxPersone) }));
    }
  }, [maxPersone, form.num_persone]);

  function aggiorna(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errori[name]) setErrori((er) => ({ ...er, [name]: undefined }));
  }

  function toggleInteresse(key) {
    setForm((f) => ({
      ...f,
      interessi: f.interessi.includes(key)
        ? f.interessi.filter((k) => k !== key)
        : [...f.interessi, key],
    }));
  }

  function valida() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Inserisci il nome";
    if (!form.cognome.trim()) e.cognome = "Inserisci il cognome";
    if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Inserisci un'email valida";
    if (!form.consenso_privacy) e.consenso_privacy = "Il consenso è necessario per registrare l'iscrizione";
    return e;
  }

  async function invia(e) {
    e.preventDefault();
    setErroreServer("");
    const e2 = valida();
    setErrori(e2);
    if (Object.keys(e2).length > 0) return;

    setInvio(true);
    try {
      const res = await fetch("/api/serata-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 410) {
        setEsito("chiuso");
      } else if (res.status === 409 && data.postiEsauriti) {
        setEsito("esauriti");
      } else if (res.status === 409 && typeof data.postiResidui === "number") {
        // Posti insufficienti per il numero richiesto: aggiorniamo il menu.
        setPostiResidui(data.postiResidui);
        setErroreServer(data.error);
      } else if (!res.ok) {
        setErroreServer(data.error || "Qualcosa è andato storto. Riprova o chiamaci.");
      } else {
        setEsito(data.giaIscritto ? "gia" : "ok");
      }
    } catch {
      setErroreServer("Connessione non riuscita. Riprova tra poco o chiamaci allo 031 4490737.");
    } finally {
      setInvio(false);
    }
  }

  if (esito) {
    const testi = {
      ok: {
        titolo: `Sei in lista. Ci vediamo il ${SERATA_AI.dataBreve}!`,
        corpo: `Ti aspettiamo ${SERATA_AI.giorno.toLowerCase()} alle ${SERATA_AI.ora} da ${SERATA_AI.luogo}, ${SERATA_AI.indirizzo}. Se hai bisogno di qualcosa prima della serata, ci trovi allo 031 4490737.`,
      },
      gia: {
        titolo: "Risulti già iscritto.",
        corpo: "Con questa email c'è già un'iscrizione alla serata: non serve altro. Se vuoi cambiare qualcosa (per esempio il numero di persone) chiamaci allo 031 4490737.",
      },
      chiuso: {
        titolo: "Le iscrizioni online sono chiuse.",
        corpo: "Per informazioni sulla serata o sui prossimi appuntamenti chiamaci allo 031 4490737 o scrivi a info@startingwork.it.",
      },
      esauriti: {
        titolo: "Posti esauriti.",
        corpo: "Tutti i posti per la serata sono stati prenotati. Per informazioni o per essere ricontattato sui prossimi appuntamenti chiama Starting Work allo 031 4490737 o scrivi a info@startingwork.it.",
      },
    }[esito];
    return (
      <div
        role="status"
        className="rounded-2xl p-7 sm:p-9"
        style={{ backgroundColor: "rgba(193,68,14,0.12)", border: `1px solid rgba(217,106,63,0.5)` }}
      >
        <p
          className="font-bold text-2xl mb-3"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: CREAM }}
        >
          {testi.titolo}
        </p>
        <p className="font-sans text-base leading-relaxed" style={{ color: "rgba(236,232,225,0.75)" }}>
          {testi.corpo}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={invia} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Campo id="serata-nome" label="Nome" obbligatorio errore={errori.nome}>
          <input id="serata-nome" name="nome" value={form.nome} onChange={aggiorna} autoComplete="given-name"
            className={inputClass} style={inputStyle(errori.nome)} />
        </Campo>
        <Campo id="serata-cognome" label="Cognome" obbligatorio errore={errori.cognome}>
          <input id="serata-cognome" name="cognome" value={form.cognome} onChange={aggiorna} autoComplete="family-name"
            className={inputClass} style={inputStyle(errori.cognome)} />
        </Campo>
        <Campo id="serata-email" label="Email" obbligatorio errore={errori.email}>
          <input id="serata-email" name="email" type="email" value={form.email} onChange={aggiorna} autoComplete="email"
            className={inputClass} style={inputStyle(errori.email)} />
        </Campo>
        <Campo id="serata-telefono" label="Telefono">
          <input id="serata-telefono" name="telefono" type="tel" value={form.telefono} onChange={aggiorna} autoComplete="tel"
            className={inputClass} style={inputStyle(false)} />
        </Campo>
        <Campo id="serata-azienda" label="Azienda o studio">
          <input id="serata-azienda" name="azienda" value={form.azienda} onChange={aggiorna} autoComplete="organization"
            className={inputClass} style={inputStyle(false)} />
        </Campo>
        <Campo id="serata-ruolo" label="Ruolo">
          <input id="serata-ruolo" name="ruolo" value={form.ruolo} onChange={aggiorna} autoComplete="organization-title"
            placeholder="es. titolare, responsabile ufficio…" className={inputClass} style={inputStyle(false)} />
        </Campo>
      </div>

      <Campo id="serata-persone" label="Quante persone verranno, te compreso?">
        <select id="serata-persone" name="num_persone" value={form.num_persone} onChange={aggiorna}
          className={inputClass} style={{ ...inputStyle(false), maxWidth: "10rem" }}>
          {Array.from({ length: maxPersone }, (_, i) => String(i + 1)).map((n) => (
            <option key={n} value={n} style={{ color: "#0b0b0c" }}>{n}</option>
          ))}
        </select>
      </Campo>

      <fieldset>
        <legend className="font-sans text-sm font-medium mb-3" style={{ color: "rgba(236,232,225,0.8)" }}>
          Cosa ti interessa di più? <span style={{ color: "rgba(236,232,225,0.45)" }}>(facoltativo)</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INTERESSI_SERATA.map((i) => (
            <label key={i.key} className="flex items-start gap-3 font-sans text-sm cursor-pointer rounded-lg px-3 py-2"
              style={{ color: "rgba(236,232,225,0.75)", backgroundColor: "rgba(236,232,225,0.03)" }}>
              <input type="checkbox" checked={form.interessi.includes(i.key)} onChange={() => toggleInteresse(i.key)}
                className="mt-0.5 shrink-0" style={{ accentColor: CLAY }} />
              {i.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Campo id="serata-messaggio" label="Una domanda o un'esigenza da anticiparci?">
        <textarea id="serata-messaggio" name="messaggio" rows={3} value={form.messaggio} onChange={aggiorna}
          className={inputClass} style={inputStyle(false)} />
      </Campo>

      {/* Trappola anti-bot: nascosta alle persone e ai lettori di schermo */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label>
          Sito web
          <input name="sito_web" tabIndex={-1} autoComplete="off" value={form.sito_web} onChange={aggiorna} />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-3 font-sans text-sm cursor-pointer" style={{ color: "rgba(236,232,225,0.7)" }}>
          <input type="checkbox" name="consenso_privacy" checked={form.consenso_privacy} onChange={aggiorna}
            className="mt-1 shrink-0" style={{ accentColor: CLAY }} />
          <span>
            Ho letto l&apos;
            <a href="/privacy-policy" target="_blank" className="underline" style={{ color: CLAY_LIGHT }}>
              informativa sulla privacy
            </a>{" "}
            e acconsento al trattamento dei miei dati per l&apos;organizzazione della serata. *
          </span>
        </label>
        {errori.consenso_privacy && (
          <p className="font-sans text-xs mt-1 ml-7" style={{ color: "#fca5a5" }}>{errori.consenso_privacy}</p>
        )}
      </div>

      {/* Consenso marketing: facoltativo e separato dal consenso privacy */}
      <label className="flex items-start gap-3 font-sans text-sm cursor-pointer" style={{ color: "rgba(236,232,225,0.7)" }}>
        <input type="checkbox" name="consenso_marketing" checked={form.consenso_marketing} onChange={aggiorna}
          className="mt-1 shrink-0" style={{ accentColor: CLAY }} />
        <span>
          Acconsento a ricevere da Starting Work proposte formative e comunicazioni sulle prossime iniziative.{" "}
          <span style={{ color: "rgba(236,232,225,0.45)" }}>(facoltativo)</span>
        </span>
      </label>

      {erroreServer && (
        <p role="alert" className="font-sans text-sm rounded-lg px-4 py-3"
          style={{ color: "#fecaca", backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}>
          {erroreServer}
        </p>
      )}

      <button type="submit" disabled={invio}
        className="inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-full transition-all duration-200 hover:brightness-110 self-start"
        style={{ backgroundColor: CLAY, color: "#fff", minHeight: "52px", padding: "0 2rem", fontSize: "16px", opacity: invio ? 0.6 : 1 }}>
        {invio ? "Invio in corso…" : "Prenota il mio posto"}
      </button>
      <p className="font-sans text-xs" style={{ color: "rgba(236,232,225,0.45)" }}>
        La serata è gratuita. Non riceverai email automatiche: se serve, ti contattiamo noi.
      </p>
    </form>
  );
}
