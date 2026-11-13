"use client";

import { useEffect, useState } from "react";
import { SERATA_AI } from "@/app/lib/serataAi";

// Modulo di iscrizione alla serata AI Academy Open (pagina /ai-academy/serata).
// Stile del kit AI Academy (classi aia-modulo in app/aia-stile.css): va messo
// dentro un riquadro bianco (aia-riquadro-modulo). Invia a /api/serata-ai.
// I temi di interesse (colonna `interessi`) non si chiedono più: la pagina di
// riferimento non li ha; il tab admin mostra ancora quelli delle prime iscrizioni.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  azienda: "",
  ruolo: "",
  num_persone: "1",
  messaggio: "",
  consenso_privacy: false,
  consenso_marketing: false,
  sito_web: "", // trappola anti-bot
};

function Campo({ id, label, facoltativo, errore, children }) {
  return (
    <div className="aia-modulo__campo">
      <label htmlFor={id} className="aia-modulo__etichetta">
        {label}
        {facoltativo && <span> (facoltativo)</span>}
      </label>
      {children}
      {errore && <p className="aia-modulo__errore">{errore}</p>}
    </div>
  );
}

function classeInput(errore) {
  return errore ? "aia-modulo__input aia-modulo__input--errore" : "aia-modulo__input";
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

  function valida() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Inserisci il nome";
    if (!form.cognome.trim()) e.cognome = "Inserisci il cognome";
    if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Inserisci un'email valida";
    if (!form.azienda.trim()) e.azienda = "Indica l'azienda per cui lavori o la tua professione";
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
      <div role="status" className="aia-modulo aia-modulo__esito">
        <div className="aia-barra aia-barra--corta" aria-hidden="true" style={{ marginTop: 0, marginBottom: "1.5rem" }} />
        <p className="aia-modulo__esito-titolo">{testi.titolo}</p>
        <p className="aia-modulo__aiuto" style={{ fontSize: "1.05rem" }}>{testi.corpo}</p>
      </div>
    );
  }

  return (
    <form onSubmit={invia} noValidate className="aia-modulo aia-modulo__griglia">
      <div className="aia-modulo__griglia aia-modulo__griglia--2">
        <Campo id="serata-nome" label="Nome" errore={errori.nome}>
          <input id="serata-nome" name="nome" value={form.nome} onChange={aggiorna} autoComplete="given-name"
            className={classeInput(errori.nome)} />
        </Campo>
        <Campo id="serata-cognome" label="Cognome" errore={errori.cognome}>
          <input id="serata-cognome" name="cognome" value={form.cognome} onChange={aggiorna} autoComplete="family-name"
            className={classeInput(errori.cognome)} />
        </Campo>
        <Campo id="serata-email" label="Email" errore={errori.email}>
          <input id="serata-email" name="email" type="email" value={form.email} onChange={aggiorna} autoComplete="email"
            className={classeInput(errori.email)} />
        </Campo>
        <Campo id="serata-telefono" label="Telefono" facoltativo>
          <input id="serata-telefono" name="telefono" type="tel" value={form.telefono} onChange={aggiorna} autoComplete="tel"
            className={classeInput(false)} />
        </Campo>
        <Campo id="serata-azienda" label="Azienda o professione" errore={errori.azienda}>
          <input id="serata-azienda" name="azienda" value={form.azienda} onChange={aggiorna} autoComplete="organization"
            placeholder="Es. Rossi Srl, oppure libero professionista – architetto"
            className={classeInput(errori.azienda)} />
        </Campo>
        <Campo id="serata-ruolo" label="Ruolo" facoltativo>
          <input id="serata-ruolo" name="ruolo" value={form.ruolo} onChange={aggiorna} autoComplete="organization-title"
            className={classeInput(false)} />
        </Campo>
        <Campo id="serata-persone" label="Quante persone siete?">
          <select id="serata-persone" name="num_persone" value={form.num_persone} onChange={aggiorna}
            className={classeInput(false)}>
            {Array.from({ length: maxPersone }, (_, i) => String(i + 1)).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo id="serata-messaggio" label="La domanda più scomoda che porterai">
        <textarea id="serata-messaggio" name="messaggio" rows={4} value={form.messaggio} onChange={aggiorna}
          className={classeInput(false)} />
        <p className="aia-modulo__aiuto">Facoltativa. La useremo in forma anonima per rompere il ghiaccio.</p>
      </Campo>

      {/* Trappola anti-bot: nascosta alle persone e ai lettori di schermo */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label>
          Sito web
          <input name="sito_web" tabIndex={-1} autoComplete="off" value={form.sito_web} onChange={aggiorna} />
        </label>
      </div>

      <div>
        <label className="aia-modulo__consenso">
          <input type="checkbox" name="consenso_privacy" checked={form.consenso_privacy} onChange={aggiorna} />
          <span>
            Consenso al{" "}
            <a href="/privacy-policy" target="_blank">trattamento dei dati</a>{" "}
            per l&apos;organizzazione della serata
          </span>
        </label>
        {errori.consenso_privacy && (
          <p className="aia-modulo__errore" style={{ marginLeft: "2.25rem" }}>{errori.consenso_privacy}</p>
        )}
      </div>

      {/* Consenso marketing: facoltativo e separato dal consenso privacy */}
      <label className="aia-modulo__consenso">
        <input type="checkbox" name="consenso_marketing" checked={form.consenso_marketing} onChange={aggiorna} />
        <span>
          Consenso a ricevere comunicazioni e proposte formative da Starting Work <span>(facoltativo)</span>
        </span>
      </label>

      {erroreServer && (
        <p role="alert" className="aia-modulo__avviso">{erroreServer}</p>
      )}

      <div>
        <button type="submit" disabled={invio} className="aia-pulsante aia-pulsante--blu">
          {invio ? "Invio in corso…" : "Prenota il mio posto"}
        </button>
        <p className="aia-modulo__aiuto" style={{ marginTop: "1.25rem" }}>
          Se cambi programma, avvisaci: liberi un posto per qualcun altro.
        </p>
      </div>
    </form>
  );
}
