// Serata di presentazione AI Academy per le imprese.
// Unico punto da aggiornare per data, luogo e stato delle iscrizioni:
// pagina /ai-academy/imprese, inviti nel sito, barra in testata e API leggono da qui.

export const SERATA_AI = {
  // Slug salvato su ogni iscrizione (colonna `evento`): per una nuova serata
  // cambiare slug, così le iscrizioni restano separate nel tab admin.
  slug: 'serata-ai-2026-11-27',
  giorno: 'Venerdì 27 novembre 2026',
  giornoBreve: 'Ven 27 novembre',
  // Per il "calendarietto" del riquadro di invito (InvitoSerataAi).
  giornoNumero: '27',
  // Per il messaggio di conferma del modulo ("Ci vediamo il 27 novembre!").
  dataBreve: '27 novembre',
  meseBreve: 'Nov',
  ora: '18:00',
  luogo: 'Starting Work',
  indirizzo: 'Piazzale Monte Santo 4, 22100 Como',
  // Capienza: somma di num_persone delle iscrizioni non annullate dell'evento.
  // Raggiunto il limite il modulo si chiude (controllo lato server).
  postiMassimi: 80,
  // Le iscrizioni si chiudono a questa ora (ora italiana). Dopo, il modulo
  // non accetta più invii (controllo lato server).
  chiusuraIscrizioni: '2026-11-27T18:00:00+01:00',
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
