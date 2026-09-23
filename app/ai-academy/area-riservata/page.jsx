"use client";

import { useState } from "react";
import Link from "next/link";

// I contenuti della guida NON sono importati qui: arrivano dall'API solo dopo
// la verifica delle credenziali. Importarli renderebbe la sezione riservata
// solo in apparenza, perché finirebbero nel bundle JavaScript pubblico.

const INK = "#0b0b0c";
const PAPER = "#f4f1ea";
const CREAM = "#ece8e1";
const CLAY = "#c1440e";
const CLAY_LIGHT = "#d96a3f";

export default function AreaRiservataPage() {
  const [guida, setGuida] = useState(null);
  const [credenziali, setCredenziali] = useState({ piva_cf: "", referente_email: "" });
  const [errore, setErrore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apertaFaq, setApertaFaq] = useState(null);

  async function accedi(e) {
    e.preventDefault();
    setErrore(null);
    setLoading(true);
    try {
      const res = await fetch("/api/voucher/guida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenziali),
      });
      const dati = await res.json();
      if (!res.ok) {
        setErrore(dati?.error || "Non siamo riusciti ad aprire la tua pratica.");
        return;
      }
      setGuida(dati);
    } catch {
      setErrore("Errore di collegamento. Riprova tra un momento.");
    } finally {
      setLoading(false);
    }
  }

  // ── Schermata di accesso ──────────────────────────────────────────────────
  if (!guida) {
    return (
      <div style={{ backgroundColor: INK, minHeight: "70vh" }} className="px-5 py-16 sm:py-24">
        <div className="max-w-lg mx-auto">
          <p
            className="font-sans text-xs font-semibold uppercase mb-4"
            style={{ letterSpacing: "0.16em", color: CLAY_LIGHT }}
          >
            AI Academy · Area riservata
          </p>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-4"
            style={{ color: CREAM }}
          >
            La guida al voucher, passo per passo.
          </h1>
          <p className="font-sans text-base leading-relaxed mb-9" style={{ color: "rgba(236,232,225,0.7)" }}>
            Questa sezione è riservata a chi ha già preregistrato la propria
            pratica. Entra con gli stessi dati che hai usato in fase di
            registrazione e trovi la procedura completa per richiedere il
            voucher Formazione Continua, con le risposte alle domande più
            frequenti sulla burocrazia.
          </p>

          <form
            onSubmit={accedi}
            className="rounded-2xl p-7"
            style={{ backgroundColor: "rgba(236,232,225,0.05)", border: "1px solid rgba(236,232,225,0.14)" }}
          >
            <div className="mb-5">
              <label className="block font-sans text-sm font-medium mb-2" style={{ color: CREAM }}>
                P.IVA / Codice Fiscale dell&apos;impresa
              </label>
              <input
                required
                value={credenziali.piva_cf}
                onChange={(e) => setCredenziali({ ...credenziali, piva_cf: e.target.value })}
                className="w-full rounded-xl px-4 py-3 font-sans text-base"
                style={{ backgroundColor: "rgba(0,0,0,0.35)", border: "1px solid rgba(236,232,225,0.2)", color: CREAM }}
              />
            </div>
            <div className="mb-6">
              <label className="block font-sans text-sm font-medium mb-2" style={{ color: CREAM }}>
                Email del referente
              </label>
              <input
                required
                type="email"
                value={credenziali.referente_email}
                onChange={(e) => setCredenziali({ ...credenziali, referente_email: e.target.value })}
                className="w-full rounded-xl px-4 py-3 font-sans text-base"
                style={{ backgroundColor: "rgba(0,0,0,0.35)", border: "1px solid rgba(236,232,225,0.2)", color: CREAM }}
              />
            </div>

            {errore && (
              <p
                className="font-sans text-sm rounded-xl px-4 py-3 mb-5"
                style={{ backgroundColor: "rgba(193,68,14,0.15)", border: "1px solid rgba(193,68,14,0.4)", color: "#f0a68a" }}
              >
                {errore}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans font-semibold rounded-full transition-all duration-200 hover:brightness-110"
              style={{
                backgroundColor: loading ? "#6b7280" : CLAY,
                color: "#fff",
                minHeight: "52px",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
              }}
            >
              {loading ? "Verifica in corso…" : "Entra nell'area riservata"}
            </button>
          </form>

          <p className="font-sans text-sm mt-7" style={{ color: "rgba(236,232,225,0.5)" }}>
            Non ti sei ancora registrato?{" "}
            <Link href="/voucher-formazione-continua" className="underline underline-offset-4" style={{ color: CLAY_LIGHT }}>
              Vai alla preregistrazione
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  // ── Guida ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: INK }}>
      {/* Intestazione */}
      <div className="px-5 pt-14 pb-10" style={{ borderBottom: "1px solid rgba(236,232,225,0.12)" }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="font-sans text-xs font-semibold uppercase mb-4"
            style={{ letterSpacing: "0.16em", color: CLAY_LIGHT }}
          >
            Area riservata · {guida.ragione_sociale}
          </p>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5"
            style={{ color: CREAM }}
          >
            Come richiedere il voucher, passo per passo.
          </h1>
          <p className="font-sans text-base leading-relaxed mb-6" style={{ color: "rgba(236,232,225,0.7)" }}>
            La tua pratica è registrata con{" "}
            <strong style={{ color: CREAM }}>
              {guida.numero_partecipanti}{" "}
              {guida.numero_partecipanti === 1 ? "partecipante" : "partecipanti"}
            </strong>
            . Qui sotto trovi l&apos;intera procedura, dalla verifica dei
            requisiti al rimborso finale. Non devi fare tutto da solo: a ogni
            passaggio puoi scriverci.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/voucher-formazione-continua"
              className="inline-flex items-center font-sans text-sm font-semibold rounded-full px-5 py-2.5"
              style={{ backgroundColor: CLAY, color: "#fff" }}
            >
              Modifica la pratica
            </Link>
            <a
              href="mailto:como@mestierilombardia.it"
              className="inline-flex items-center font-sans text-sm font-semibold rounded-full px-5 py-2.5"
              style={{ border: "1px solid rgba(236,232,225,0.3)", color: CREAM }}
            >
              Scrivici
            </a>
          </div>
        </div>
      </div>

      {/* Riferimenti dell'avviso */}
      <div className="px-5 py-8" style={{ backgroundColor: "rgba(236,232,225,0.03)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { k: "Avviso di riferimento", v: guida.avviso.riferimento },
            { k: "Apertura sportello", v: guida.avviso.aperturaSportello },
            { k: "Dove si presenta", v: guida.avviso.portale },
          ].map((r) => (
            <div key={r.k}>
              <p
                className="font-sans text-xs font-semibold uppercase mb-1.5"
                style={{ letterSpacing: "0.1em", color: "rgba(236,232,225,0.45)" }}
              >
                {r.k}
              </p>
              <p className="font-sans text-sm" style={{ color: CREAM }}>{r.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Le fasi: l'ordine conta, è una procedura */}
      <div className="px-5 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <ol className="flex flex-col gap-4">
            {guida.fasi.map((fase, i) => (
              <li
                key={fase.id}
                className="rounded-2xl p-6 sm:p-8"
                style={{ backgroundColor: "rgba(236,232,225,0.04)", border: "1px solid rgba(236,232,225,0.12)" }}
              >
                <div className="flex gap-4 sm:gap-6">
                  <span
                    className="font-display font-bold text-xl shrink-0 rounded-full flex items-center justify-center"
                    style={{ width: "2.5rem", height: "2.5rem", backgroundColor: CLAY, color: "#fff" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-xl sm:text-2xl mb-2" style={{ color: CREAM }}>
                      {fase.titolo}
                    </h2>
                    <p className="font-sans text-base leading-relaxed mb-5" style={{ color: "rgba(236,232,225,0.68)" }}>
                      {fase.sintesi}
                    </p>
                    <ul className="flex flex-col gap-3 mb-5">
                      {fase.azioni.map((a) => (
                        <li
                          key={a}
                          className="font-sans text-sm leading-relaxed flex gap-3"
                          style={{ color: "rgba(236,232,225,0.8)" }}
                        >
                          <span style={{ color: CLAY_LIGHT }} aria-hidden="true">▸</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                    <p
                      className="font-sans text-sm leading-relaxed rounded-xl px-4 py-3"
                      style={{ backgroundColor: "rgba(193,68,14,0.12)", border: "1px solid rgba(193,68,14,0.3)", color: "#f0b79a" }}
                    >
                      <strong>Attenzione:</strong> {fase.attenzione}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-5 py-14 sm:py-20" style={{ backgroundColor: PAPER }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="font-sans text-xs font-semibold uppercase mb-4"
            style={{ letterSpacing: "0.16em", color: CLAY }}
          >
            Domande frequenti
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-4" style={{ color: "#1c1917" }}>
            La burocrazia, spiegata.
          </h2>
          <p className="font-sans text-base leading-relaxed mb-10" style={{ color: "#57534e" }}>
            Le domande che ci arrivano più spesso. Questa sezione cresce nel
            tempo: se non trovi la tua risposta, scrivici e la aggiungiamo.
          </p>

          <div className="flex flex-col gap-2.5">
            {guida.faq.map((f, i) => {
              const aperta = apertaFaq === i;
              return (
                <div
                  key={f.d}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: "#fff", border: "1px solid #e7e5e4" }}
                >
                  <button
                    type="button"
                    onClick={() => setApertaFaq(aperta ? null : i)}
                    aria-expanded={aperta}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span className="font-sans font-semibold text-base" style={{ color: "#1c1917" }}>
                      {f.d}
                    </span>
                    <span
                      className="font-sans text-xl shrink-0 leading-none"
                      style={{ color: CLAY }}
                      aria-hidden="true"
                    >
                      {aperta ? "−" : "+"}
                    </span>
                  </button>
                  {aperta && (
                    <p
                      className="font-sans text-base leading-relaxed px-5 pb-5"
                      style={{ color: "#44403c" }}
                    >
                      {f.r}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="rounded-2xl p-6 mt-10"
            style={{ backgroundColor: "#fff", border: `1px solid ${CLAY}33`, borderLeft: `4px solid ${CLAY}` }}
          >
            <p className="font-sans text-sm leading-relaxed" style={{ color: "#57534e" }}>
              Questa guida è un supporto operativo predisposto da Mestieri
              Lombardia Como e Starting Work. Il testo che fa fede resta{" "}
              <strong style={{ color: "#1c1917" }}>l&apos;avviso ufficiale di Regione Lombardia</strong>{" "}
              ({guida.avviso.riferimento}), pubblicato sul portale{" "}
              <a
                href={guida.avviso.portaleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
                style={{ color: CLAY }}
              >
                Bandi e Servizi
              </a>
              . In caso di dubbio, chiedi a noi prima di procedere: rispondiamo
              a{" "}
              <a
                href="mailto:como@mestierilombardia.it"
                className="underline underline-offset-2"
                style={{ color: CLAY }}
              >
                como@mestierilombardia.it
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Chiusura */}
      <div className="px-5 py-12" style={{ backgroundColor: "#000" }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Sei entrato come <strong style={{ color: CREAM }}>{guida.ragione_sociale}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setGuida(null);
              setApertaFaq(null);
              setCredenziali({ piva_cf: "", referente_email: "" });
            }}
            className="font-sans text-sm underline underline-offset-4"
            style={{ background: "none", border: "none", cursor: "pointer", color: CLAY_LIGHT }}
          >
            Esci dall&apos;area riservata
          </button>
        </div>
      </div>
    </div>
  );
}
