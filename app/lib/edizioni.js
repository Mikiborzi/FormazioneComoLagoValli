// Helper condivisi per corsi/edizioni/fatturazione (tab admin Voucher Formazione Continua).

// Solo informativa: quota di rimborso spettante all'azienda dalla Regione.
// Non entra MAI nel calcolo dell'importo fatturato — l'ente di formazione fattura
// sempre il valore pieno del percorso; è l'azienda a farsi rimborsare la propria
// quota con una domanda separata che non passa da qui.
export const FASCIA_PERCENTUALI = {
  fino_9: 0.10,
  dieci_50: 0.30,
  oltre_50: 0.50,
}

export const FASCIA_LABEL = {
  fino_9: '10% (fino a 9 addetti / autonomi)',
  dieci_50: '30% (10-50 addetti)',
  oltre_50: '50% (oltre 50 addetti)',
}

// Un'edizione è "avviata" (e quindi fatturabile) se lo stato lo dice esplicitamente
// o se la data di inizio è già passata. Unico punto di verità: usata identica sia
// nella lista edizioni (badge di stato) sia nel filtro della tab Fatturazione, così
// i due posti non possono disallinearsi.
export function edizioneAvviata(edizione) {
  if (!edizione) return false
  if (edizione.stato === 'avviata') return true
  if (edizione.stato !== 'pianificata') return false
  if (!edizione.data_inizio) return false
  const oggi = new Date().toISOString().slice(0, 10)
  return edizione.data_inizio <= oggi
}

export function normalizzaSede(sede) {
  return String(sede || '').trim().toLowerCase()
}

function sessioniValide(edizione) {
  return Array.isArray(edizione?.calendario) ? edizione.calendario.filter((s) => s?.data) : []
}

// Due incontri sono in conflitto solo se cadono lo stesso giorno E le fasce
// orarie si sovrappongono davvero (non basta la stessa data: due edizioni
// nella stessa sede possono benissimo tenersi la mattina e il pomeriggio dello
// stesso giorno senza alcun problema). Se manca l'orario su uno dei due si
// preferisce segnalare comunque, perché non c'è modo di escludere la sovrapposizione.
function sessioniSiSovrappongono(a, b) {
  if (a.data !== b.data) return false
  if (!a.ora_inizio || !a.ora_fine || !b.ora_inizio || !b.ora_fine) return true
  return a.ora_inizio < b.ora_fine && b.ora_inizio < a.ora_fine
}

// Confronta una candidata (nuova o in modifica) con le edizioni esistenti e
// restituisce un array di conflitti — stessa sede, almeno un incontro che si
// sovrappone davvero in data E orario. È un avviso, non un blocco: la sede è
// testo libero e può darsi che due gruppi coesistano nello stesso edificio in
// fasce diverse; decide l'admin.
export function trovaConflittiSede(candidata, edizioniEsistenti) {
  const sede = normalizzaSede(candidata?.sede)
  if (!sede) return []
  const sessioniCandidata = sessioniValide(candidata)
  if (sessioniCandidata.length === 0) return []

  return (edizioniEsistenti || []).filter((e) => {
    if (e.id && candidata.id && e.id === candidata.id) return false
    if (e.stato === 'annullata') return false
    if (normalizzaSede(e.sede) !== sede) return false
    const sessioniEsistente = sessioniValide(e)
    return sessioniCandidata.some((sc) => sessioniEsistente.some((se) => sessioniSiSovrappongono(sc, se)))
  })
}

// Genera una serie di incontri ricorrenti tra due date, nei giorni della
// settimana indicati (0=domenica...6=sabato), con la stessa fascia oraria per
// ognuno. Usata dal generatore "tutti i martedì e giovedì dalle 14 alle 18".
export function generaIncontriRicorrenti({ giorni, oraInizio, oraFine, dataInizio, dataFine }) {
  if (!giorni?.length || !oraInizio || !oraFine || !dataInizio || !dataFine) return []
  const risultato = []
  const cursore = new Date(`${dataInizio}T00:00:00`)
  const fine = new Date(`${dataFine}T00:00:00`)
  if (Number.isNaN(cursore.getTime()) || Number.isNaN(fine.getTime())) return []

  while (cursore <= fine) {
    if (giorni.includes(cursore.getDay())) {
      risultato.push({ data: cursore.toISOString().slice(0, 10), ora_inizio: oraInizio, ora_fine: oraFine })
    }
    cursore.setDate(cursore.getDate() + 1)
  }
  return risultato
}
