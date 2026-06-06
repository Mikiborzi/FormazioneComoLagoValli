"use client";

export default function PopupGOLSospensione({ onDismiss, onContinua, continuaLabel = "Consulta le informazioni archiviate" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 flex flex-col gap-6"
        style={{ border: "2px solid #fcd34d" }}
      >
        {/* Icona + titolo */}
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
            style={{ backgroundColor: "#fffbeb" }}
          >
            ⚠️
          </div>
          <div>
            <p
              className="font-sans font-bold text-xs uppercase tracking-widest mb-1"
              style={{ color: "#92400e" }}
            >
              Avviso importante
            </p>
            <h2
              className="font-display font-bold text-xl leading-snug"
              style={{ color: "#1a2e5a" }}
            >
              Percorsi GOL temporaneamente sospesi
            </h2>
          </div>
        </div>

        {/* Corpo */}
        <p className="font-sans text-gray-600 text-sm leading-relaxed">
          L&apos;offerta formativa collegata ai <strong>Percorsi GOL</strong> è
          temporaneamente sospesa in attesa di capire come funzioneranno i nuovi
          strumenti di Politiche Attive che <strong>Regione Lombardia</strong> intende
          adottare. Le informazioni presenti non sono da ritenersi aggiornate e valide.
        </p>

        <p className="font-sans text-gray-500 text-sm leading-relaxed -mt-2">
          Per restare aggiornato sulle novità puoi contattarci direttamente: ti avviseremo
          non appena saranno note le nuove modalità di accesso alla formazione finanziata.
        </p>

        {/* Bottoni */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => { window.location.href = "/"; }}
            className="flex-1 text-center font-sans font-semibold text-sm py-3 px-4 rounded-xl text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "#1a2e5a" }}
          >
            ← Torna alla home
          </button>
          <a
            href="mailto:como@mestierilombardia.it"
            className="flex-1 text-center font-sans font-semibold text-sm py-3 px-4 rounded-xl transition-all hover:brightness-105"
            style={{ backgroundColor: "#fffbeb", color: "#92400e", border: "1px solid #fcd34d" }}
          >
            Contattaci
          </a>
          <button
            onClick={onContinua || onDismiss}
            className="flex-1 font-sans text-sm py-3 px-4 rounded-xl transition-all hover:bg-gray-100"
            style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
          >
            {continuaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
