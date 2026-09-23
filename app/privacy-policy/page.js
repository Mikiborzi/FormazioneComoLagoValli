export const metadata = {
  title: "Privacy Policy – Formazione Como Lago e Valli",
  description: "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "#1a2e5a" }}>
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-400 mb-10">
        Informativa ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR) — aggiornata al 26 luglio 2026
      </p>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>1. Titolare del trattamento</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          <strong>Starting Work Impresa Sociale S.r.l.</strong><br />
          Piazzale Monte Santo 4, 22100 Como (CO)<br />
          P.IVA/C.F.: 03262210135 — R.E.A. n. 304755 — Cap. Soc. Euro 25.000,00 i.v.<br />
          Email: <a href="mailto:info@startingwork.it" className="underline" style={{ color: "#1a2e5a" }}>info@startingwork.it</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>2. Dati raccolti e finalità del trattamento</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Il portale formazionecomolago.it raccoglie dati personali esclusivamente attraverso i form presenti nel sito, per le diverse iniziative che gestisce (corsi DIL, Formazione Impresa, Voucher Formazione Continua, percorsi IFTS, servizi di orientamento al lavoro). I dati raccolti e le relative finalità sono:
        </p>
        <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid #e2e8f0" }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Dati raccolti</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Finalità</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Base giuridica</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Nome, cognome, email, telefono, codice fiscale, data di nascita, indirizzo", "Gestione preiscrizioni ai corsi e contatto da parte degli operatori", "Consenso esplicito (art. 6.1.a GDPR)"],
                ["Comune e indirizzo di residenza/domicilio", "Verifica dei requisiti di idoneità alla Dote Inserimento Lavorativo (DIL)", "Esecuzione di un contratto o misure precontrattuali (art. 6.1.b GDPR)"],
                ["Status occupazionale", "Determinazione dell'idoneità alla Dote Inserimento Lavorativo (DIL)", "Esecuzione di un contratto o misure precontrattuali (art. 6.1.b GDPR)"],
                ["Curriculum vitae (file caricato)", "Valutazione del profilo per i servizi di orientamento al lavoro", "Consenso esplicito (art. 6.1.a GDPR)"],
                ["Ragione sociale, P.IVA, sede operativa, dati del referente e del legale rappresentante", "Gestione della pratica di richiesta voucher Formazione Continua presso Regione Lombardia", "Consenso esplicito (art. 6.1.a GDPR)"],
                ["Dati anagrafici e occupazionali dei partecipanti al voucher (codice fiscale, data di nascita, indirizzo, tipologia di rapporto di lavoro)", "Iscrizione al corso e verifica dei requisiti per il voucher Formazione Continua", "Consenso esplicito (art. 6.1.a GDPR)"],
                ["Eventuale condizione di vulnerabilità del partecipante (dato facoltativo, fornito su base volontaria)", "Solo se comunicato spontaneamente, ai fini della rendicontazione della misura regionale", "Consenso esplicito e distinto ai sensi dell'art. 9 GDPR (categoria particolare di dati)"],
                ["Ragione sociale, P.IVA, dati di fatturazione dell'azienda", "Iscrizione ai percorsi a pagamento di Formazione Impresa", "Consenso esplicito (art. 6.1.a GDPR)"],
                ["Dati del candidato o dell'azienda per i percorsi IFTS (anagrafica, titolo di studio, dati aziendali)", "Gestione della candidatura o della richiesta di percorso IFTS in apprendistato", "Consenso esplicito (art. 6.1.a GDPR)"],
                ["Email (per comunicazioni promozionali)", "Invio di comunicazioni su nuovi corsi, servizi di orientamento professionale e altre iniziative formative e professionali di Starting Work", "Consenso esplicito, distinto e revocabile in ogni momento (art. 6.1.a e art. 7.4 GDPR) — facoltativo, non condizionante l'erogazione del servizio richiesto"],
                ["Email e password (area personale)", "Autenticazione e accesso all'area personale utente", "Consenso esplicito (art. 6.1.a GDPR)"],
              ].map(([dati, finalita, base], i) => (
                <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td className="px-4 py-3 text-gray-600">{dati}</td>
                  <td className="px-4 py-3 text-gray-600">{finalita}</td>
                  <td className="px-4 py-3 text-gray-500">{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          Il consenso alla ricezione di comunicazioni promozionali su altri servizi formativi e professionali
          è sempre richiesto separatamente dal consenso necessario per erogare il servizio specifico richiesto
          (iscrizione a un corso, richiesta di voucher, candidatura IFTS, ecc.): rifiutarlo non pregiudica in
          alcun modo la gestione della tua richiesta principale, e può essere revocato in qualsiasi momento.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>3. Modalità del trattamento e conservazione</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          I dati sono trattati con strumenti elettronici e conservati in forma sicura su database Supabase (Supabase Inc., con server in Europa). Le email inviate dal sito sono gestite tramite il fornitore Resend, esclusivamente per notifiche interne agli operatori.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          I dati relativi alle preiscrizioni ai corsi DIL sono conservati per tutta la durata della misura Dote Inserimento Lavorativo (DIL) — che dal 1° luglio 2026 sostituisce il Programma GOL — e per i successivi 10 anni ai fini amministrativi e di rendicontazione, salvo diversa indicazione normativa. I dati relativi alle pratiche di Voucher Formazione Continua, Formazione Impresa e percorsi IFTS sono conservati per la durata della pratica e per i successivi 10 anni ai fini amministrativi, contabili e di rendicontazione verso Regione Lombardia. I dati dell'area personale (credenziali di accesso) sono conservati fino alla cancellazione dell'account da parte dell'utente.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>4. Comunicazione e diffusione dei dati</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          I dati raccolti possono essere comunicati a: Centri per l'Impiego della Provincia di Como, Regione Lombardia, ANPAL e soggetti istituzionali coinvolti nella Dote Inserimento Lavorativo (DIL); Regione Lombardia e gli enti coinvolti nell'istruttoria del Voucher Formazione Continua (PR FSE+ 2021-2027), per le relative pratiche; aziende partner coinvolte nei percorsi IFTS in apprendistato, solo con il consenso del candidato. La comunicazione avviene esclusivamente per le finalità connesse all'erogazione del servizio richiesto. I dati non sono diffusi a terzi per finalità commerciali né ceduti a soggetti non coinvolti nelle rispettive misure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>5. Diritti dell'interessato</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Ai sensi degli artt. 15-22 del GDPR, l'interessato ha il diritto di:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed space-y-1">
          <li>Accedere ai propri dati personali</li>
          <li>Richiederne la rettifica o l'aggiornamento</li>
          <li>Richiederne la cancellazione (diritto all'oblio), nei limiti previsti dalla normativa sulla Dote Inserimento Lavorativo</li>
          <li>Opporsi al trattamento o richiederne la limitazione</li>
          <li>Richiedere la portabilità dei dati</li>
          <li>Revocare il consenso in qualsiasi momento, senza pregiudizio per la liceità del trattamento precedente</li>
          <li>Proporre reclamo al Garante per la Protezione dei Dati Personali (garante.privacy.it)</li>
        </ul>
        <p className="text-gray-600 text-sm leading-relaxed mt-3">
          Per esercitare i propri diritti: <a href="mailto:info@startingwork.it" className="underline" style={{ color: "#1a2e5a" }}>info@startingwork.it</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>6. Cookie e tecnologie di tracciamento</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Il portale utilizza esclusivamente cookie tecnici necessari al funzionamento del servizio (cookie di sessione per l'autenticazione). Non vengono utilizzati cookie di profilazione né strumenti di tracciamento a fini pubblicitari. Per maggiori informazioni consulta la <a href="/cookie-policy" className="underline" style={{ color: "#1a2e5a" }}>Cookie Policy</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>7. Modifiche alla presente informativa</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Il Titolare si riserva il diritto di modificare la presente informativa in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento. Si consiglia di consultare periodicamente questa pagina.
        </p>
      </section>
    </div>
  )
}
