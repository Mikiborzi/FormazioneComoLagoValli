// Serata di presentazione AI Academy per le imprese.
// Unico punto da aggiornare per data, luogo e stato delle iscrizioni:
// pagina /ai-academy/serata (con il modulo), fascia su /ai-academy/imprese,
// inviti nel sito, barra in testata e API leggono da qui.

// Indirizzo della pagina della serata (modulo di prenotazione su #prenota).
export const PAGINA_SERATA = '/ai-academy/serata'

// Testi comuni della serata: vanno usati IDENTICI (kit di stile AI Academy,
// stile-riferimento/kit-stile-michele/testi-comuni.txt).
export const TESTI_SERATA = {
  titolo: "Siamo in Champions. E tu, in che serie giochi con l'AI?",
  sottotitolo: 'Giovedì 26 novembre, una serata per alzare il livello. Dal vivo, insieme.',
  sottotitolo2: 'Un aperitivo per incontrare la squadra e i programmi.',
  occhiello: 'AI Academy Open · Giovedì 26 novembre 2026 · ore 18:00 · Starting Work, Como · Ingresso gratuito · Posti limitati',
  dressCode: 'Dress code: portate tante domande. Le più scomode.',
  pulsante: 'Prenota il tuo posto',
  nota: "Non serve sapere niente. Serve solo la voglia di capire. Anche se l'AI un po' ti spaventa.",
}

export const SERATA_AI = {
  // Slug salvato su ogni iscrizione (colonna `evento`): per una nuova serata
  // cambiare slug, così le iscrizioni restano separate nel tab admin.
  // Resta "-27" anche se la serata è stata spostata al 26: è la stessa serata e
  // le iscrizioni già raccolte sono salvate con questo codice.
  slug: 'serata-ai-2026-11-27',
  giorno: 'Giovedì 26 novembre 2026',
  giornoBreve: 'Gio 26 novembre',
  // Per i testi della serata in stile AI Academy ("Giovedì 26 novembre, una serata per...").
  giornoSenzaAnno: 'Giovedì 26 novembre',
  // Fine del programma, prima dell'aperitivo.
  oraFine: '19:30',
  // Per il "calendarietto" del riquadro di invito (InvitoSerataAi).
  giornoNumero: '26',
  // Per il messaggio di conferma del modulo ("Ci vediamo il 26 novembre!").
  dataBreve: '26 novembre',
  meseBreve: 'Nov',
  ora: '18:00',
  luogo: 'Starting Work',
  indirizzo: 'Piazzale Monte Santo 4, 22100 Como',
  // Capienza: somma di num_persone delle iscrizioni non annullate dell'evento.
  // Raggiunto il limite il modulo si chiude (controllo lato server).
  postiMassimi: 80,
  // Le iscrizioni si chiudono a questa ora (ora italiana). Dopo, il modulo
  // non accetta più invii (controllo lato server).
  chiusuraIscrizioni: '2026-11-26T18:00:00+01:00',
  // Interruttore manuale: false per chiudere prima (es. posti esauriti).
  iscrizioniAperte: true,
}

export function iscrizioniSerataAperte(ora = new Date()) {
  return SERATA_AI.iscrizioniAperte && ora < new Date(SERATA_AI.chiusuraIscrizioni)
}

// Temi tra cui chi si iscrive può indicare i propri interessi.
// Le chiavi finiscono nel DB (colonna `interessi`, separate da virgola).
export const INTERESSI_SERATA = [
  { key: 'percorso_azienda', label: 'Un percorso su misura per la mia azienda' },
  { key: 'ai_act', label: 'AI Act e alfabetizzazione (art. 4)' },
  { key: 'uso_quotidiano', label: "Usare l'AI su documenti e lavoro quotidiano" },
  { key: 'numeri', label: "Leggere i numeri dell'azienda con l'AI" },
  { key: 'agenti', label: 'Agenti AI e azienda agentica' },
  { key: 'corso_individuale', label: 'Il corso AI Academy individuale (30 ore)' },
]
