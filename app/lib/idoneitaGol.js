const STATUS_IDONEI = [
  "disoccupato",
  "inoccupato",
  "studente_universitario",
  "studente_accademia",
];

const MESSAGGI_NON_IDONEO = {
  occupato:
    "I corsi GOL sono riservati a chi non ha un contratto di lavoro attivo. Poiché risulti occupato, non puoi accedere a questi percorsi finanziati. Tuttavia raccogliamo il tuo interesse — contattaci tramite la chat per scoprire proposte formative alternative pensate per chi lavora.",
  imprenditore:
    "I corsi GOL sono riservati a chi non svolge attività d'impresa. Raccogliamo comunque il tuo interesse — contattaci tramite la chat per scoprire percorsi formativi alternativi adatti alla tua situazione.",
};

/**
 * Verifica l'idoneità al Programma GOL in base allo status.
 * @param {string} status
 * @returns {{ idoneo: boolean, messaggio: string }}
 */
export function checkIdoneitaGol(status) {
  if (STATUS_IDONEI.includes(status)) {
    return { idoneo: true, messaggio: "" };
  }
  return {
    idoneo: false,
    messaggio: MESSAGGI_NON_IDONEO[status] ?? "Status non riconosciuto.",
  };
}
