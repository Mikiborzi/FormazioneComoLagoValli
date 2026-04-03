export const metadata = {
  title: "Cookie Policy - Formazione Como Lago e Valli",
};

export default function CookiePolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "#1a2e5a" }}>
        Cookie Policy
      </h1>
      <p className="text-sm text-gray-400 mb-10">
        Aggiornata al 1 aprile 2026
      </p>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>1. Cosa sono i cookie</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          I cookie sono piccoli file di testo salvati sul dispositivo durante la navigazione. Vengono utilizzati per far funzionare il sito correttamente e garantire la sicurezza delle sessioni autenticate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>2. Cookie utilizzati</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Il portale formazionecomolago.it utilizza esclusivamente cookie tecnici necessari al funzionamento del servizio. Non vengono utilizzati cookie di profilazione, pubblicitari o strumenti di tracciamento di terze parti.
        </p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#f8fafc" }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Finalita</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: "1px solid #f1f5f9" }}>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">sb-auth-token</td>
                <td className="px-4 py-3 text-gray-600">Tecnico</td>
                <td className="px-4 py-3 text-gray-600">Gestione autenticazione utente. Mantiene la sessione attiva dopo il login.</td>
                <td className="px-4 py-3 text-gray-500">Sessione / 1 anno</td>
              </tr>
              <tr style={{ borderTop: "1px solid #f1f5f9" }}>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">sb-auth-code-verifier</td>
                <td className="px-4 py-3 text-gray-600">Tecnico</td>
                <td className="px-4 py-3 text-gray-600">Verifica sicurezza durante il flusso di autenticazione.</td>
                <td className="px-4 py-3 text-gray-500">Sessione</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>3. Cookie tecnici e consenso</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          I cookie tecnici non richiedono il consenso ai sensi dell&apos;art. 122 del D.Lgs. 196/2003 e delle Linee Guida del Garante Privacy. Senza questi cookie alcune funzionalita del portale non sarebbero disponibili.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>4. Come disabilitare i cookie</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          E possibile disabilitare i cookie dal browser:
        </p>
        <ul className="text-sm space-y-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#1a2e5a" }}>Chrome</a></li>
          <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#1a2e5a" }}>Safari</a></li>
          <li><a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#1a2e5a" }}>Firefox</a></li>
          <li><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#1a2e5a" }}>Edge</a></li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#1a2e5a" }}>5. Titolare del trattamento</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Starting Work Impresa Sociale S.r.l.<br />
          Piazzale Monte Santo 4, 22100 Como (CO)<br />
          P.IVA/C.F.: 03262210135<br />
          Email: info@startingwork.it
        </p>
      </section>
    </div>
  )
}
