const STATUS_IDONEI = [
  "disoccupato",
  "inoccupato",
  "studente_universitario",
  "studente_accademia",
];

const MESSAGGI_NON_IDONEO = {
  occupato:
    "La Dote Inserimento Lavorativo è riservata a chi non ha un contratto di lavoro attivo. Poiché risulti occupato, non puoi accedere a questi percorsi finanziati. Tuttavia raccogliamo il tuo interesse: se lavori, i voucher per la Formazione Continua di Regione Lombardia sono pensati proprio per te — contattaci per scoprirli.",
  imprenditore:
    "La Dote Inserimento Lavorativo è riservata a chi non svolge attività d'impresa. Raccogliamo comunque il tuo interesse: come imprenditore puoi accedere ai voucher per la Formazione Continua di Regione Lombardia — contattaci per valutare i percorsi disponibili.",
};

const MESSAGGIO_FUORI_LOMBARDIA =
  "La Dote Inserimento Lavorativo è riservata a chi è residente o domiciliato in Lombardia. Dai dati inseriti non risulti né residente né domiciliato in regione. Raccogliamo comunque il tuo interesse: contattaci per verificare insieme la tua posizione o per valutare percorsi alternativi.";

/** Sigle delle dodici province lombarde. */
export const PROVINCE_LOMBARDIA = new Set([
  "BG", // Bergamo
  "BS", // Brescia
  "CO", // Como
  "CR", // Cremona
  "LC", // Lecco
  "LO", // Lodi
  "MN", // Mantova
  "MI", // Milano
  "MB", // Monza e della Brianza
  "PV", // Pavia
  "SO", // Sondrio
  "VA", // Varese
]);

/**
 * @param {string} sigla sigla provinciale, con o senza spazi/maiuscole
 * @returns {boolean} true se la provincia è lombarda
 */
export function inLombardia(sigla) {
  if (!sigla) return false;
  return PROVINCE_LOMBARDIA.has(sigla.trim().toUpperCase());
}

/**
 * Verifica l'idoneità alla Dote Inserimento Lavorativo (DIL) in base allo
 * status occupazionale e alla residenza/domicilio. Dal 1° luglio 2026 la DIL
 * sostituisce il Programma GOL.
 *
 * Il requisito territoriale è soddisfatto dalla residenza OPPURE dal domicilio
 * in Lombardia: basta uno dei due. Se non è stata indicata alcuna provincia il
 * requisito non viene valutato — l'operatore lo verifica in fase di presa in
 * carico — e quindi non blocca l'iscrizione.
 *
 * @param {string} status
 * @param {{ provinciaResidenza?: string, provinciaDomicilio?: string }} [luogo]
 * @returns {{ idoneo: boolean, messaggio: string }}
 */
export function checkIdoneitaDil(status, luogo = {}) {
  if (!STATUS_IDONEI.includes(status)) {
    return {
      idoneo: false,
      messaggio: MESSAGGI_NON_IDONEO[status] ?? "Status non riconosciuto.",
    };
  }

  const { provinciaResidenza, provinciaDomicilio } = luogo;
  const provinciaIndicata = Boolean(
    (provinciaResidenza && provinciaResidenza.trim()) ||
      (provinciaDomicilio && provinciaDomicilio.trim())
  );

  if (
    provinciaIndicata &&
    !inLombardia(provinciaResidenza) &&
    !inLombardia(provinciaDomicilio)
  ) {
    return { idoneo: false, messaggio: MESSAGGIO_FUORI_LOMBARDIA };
  }

  return { idoneo: true, messaggio: "" };
}
