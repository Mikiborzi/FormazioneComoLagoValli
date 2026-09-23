// Guida operativa alla richiesta del voucher Formazione Continua, mostrata
// nell'area riservata a chi ha già preregistrato la propria pratica.
//
// I contenuti stanno qui, versionati, perché la procedura cambia a ogni
// edizione dell'avviso e va rivista a mano da chi la conosce. Quando l'area
// admin gestirà le FAQ a database, questo file resterà come contenuto iniziale.

export const AVVISO = {
  riferimento: "Decreto n. 8809 del 1° luglio 2026",
  programma: "Programma Regionale Lombardia FSE+ 2021-2027 — Obiettivo ESO 4.4",
  aperturaSportello: "13 luglio 2026",
  portale: "Bandi e Servizi di Regione Lombardia",
  portaleUrl: "https://www.bandi.regione.lombardia.it/",
};

export const FASI = [
  {
    id: "requisiti",
    titolo: "Verifica di poter accedere",
    sintesi:
      "Prima di muovere qualsiasi carta, controlla che azienda e persone rientrino nella misura.",
    azioni: [
      "Controlla che ogni destinatario sia ammissibile: dipendenti a tempo indeterminato o determinato, soci-lavoratori di cooperative, titolari e soci d'impresa, titolari di ditta individuale, autonomi e professionisti con domicilio fiscale in Lombardia.",
      "Escludi chi non può accedere: contratti intermittenti o in somministrazione, tirocinanti, apprendisti con periodo formativo in corso, collaboratori familiari, amministratori con sola carica societaria, chi è assente per ferie, malattia o aspettativa durante il corso.",
      "Verifica che nessun destinatario abbia già in corso altre politiche attive incompatibili.",
      "Conta gli addetti dell'impresa: da questo dipende la quota pubblica (90%, 70% o 50%).",
    ],
    attenzione:
      "Il tetto è di € 2.000 per lavoratore per anno solare e € 50.000 per impresa per anno solare. Se un tuo collaboratore ha già usato un voucher quest'anno, la capienza residua si riduce di conseguenza.",
  },
  {
    id: "preregistrazione",
    titolo: "Preregistra azienda e partecipanti",
    sintesi:
      "È il passaggio che hai già fatto: da qui in avanti la pratica esiste e possiamo seguirla insieme.",
    azioni: [
      "Verifica che i dati dell'azienda siano corretti e aggiornati, in particolare P.IVA, codice ATECO, numero addetti e sede operativa.",
      "Controlla i dati anagrafici di ogni partecipante: nome, cognome, codice fiscale, data e luogo di nascita, titolo di studio e condizione occupazionale. Devono coincidere con i documenti.",
      "Segnala eventuali variazioni: un partecipante che cambia, un contratto che scade, un addetto in più o in meno.",
    ],
    attenzione:
      "I dati della preregistrazione confluiscono nella domanda. Un codice fiscale sbagliato qui diventa un problema in fase di istruttoria.",
  },
  {
    id: "credenziali",
    titolo: "Prepara le credenziali di accesso al portale",
    sintesi:
      "La domanda si presenta online: senza identità digitale e profilazione non si parte.",
    azioni: [
      "Procurati un'identità digitale valida (SPID, CIE o CNS) intestata a chi presenterà la domanda per l'impresa.",
      "Registra e profila l'impresa sul portale Bandi e Servizi, se non l'hai già fatto in passato: la profilazione non è immediata, va fatta con anticipo.",
      "Verifica che chi presenta la domanda abbia i poteri di firma per l'impresa, o una delega formale.",
      "Tieni a portata di mano i dati del legale rappresentante e le coordinate bancarie dell'impresa.",
    ],
    attenzione:
      "La profilazione sul portale può richiedere qualche giorno. È il passaggio che più spesso fa perdere lo sportello: fallo prima, non il giorno dell'apertura.",
  },
  {
    id: "domanda",
    titolo: "Presenta la domanda a sportello",
    sintesi:
      "Le domande si presentano «a sportello», in ordine di arrivo, fino a esaurimento delle risorse.",
    azioni: [
      "Accedi al portale dalla data di apertura dello sportello e compila la domanda indicando il percorso scelto dal catalogo regionale e i nominativi dei destinatari.",
      "Indica AI Academy come percorso: ti forniamo noi il riferimento esatto a catalogo, il codice e la scheda del corso.",
      "Allega la documentazione richiesta dall'avviso e invia.",
      "Conserva la ricevuta di protocollo: è la prova della data di presentazione.",
    ],
    attenzione:
      "Ordine cronologico significa che chi arriva prima ha la precedenza. L'impegno contabile viene assunto solo dopo la verifica di ammissibilità: la domanda inviata non è ancora un voucher concesso.",
  },
  {
    id: "esito",
    titolo: "Attendi l'esito e l'ammissione",
    sintesi:
      "Regione verifica l'ammissibilità e comunica l'esito. Da lì decorrono i tempi del percorso.",
    azioni: [
      "Controlla periodicamente la casella PEC dell'impresa e l'area personale del portale: le comunicazioni arrivano lì.",
      "Se arriva una richiesta di integrazione, rispondi entro i termini indicati: i tempi sono stretti e perentori.",
      "A esito positivo, conferma con noi le date dell'edizione e l'iscrizione dei partecipanti.",
    ],
    attenzione:
      "Non avviare la formazione prima di aver verificato con noi che sia il momento giusto rispetto alla tua pratica: partire fuori tempo può compromettere il rimborso.",
  },
  {
    id: "frequenza",
    titolo: "Frequenta il corso",
    sintesi:
      "La frequenza è la condizione sostanziale del finanziamento, non una formalità.",
    azioni: [
      "Assicurati che ogni partecipante frequenti almeno il 75% delle ore previste.",
      "Firma i registri a ogni incontro: fanno fede in sede di controllo.",
      "Segnalaci subito le assenze prolungate: se un partecipante rischia di scendere sotto la soglia, meglio saperlo prima della fine.",
      "Completa la prova finale e ottieni la certificazione delle competenze.",
    ],
    attenzione:
      "Sotto il 75% delle ore il voucher non viene riconosciuto per quel partecipante. È il motivo più frequente di mancato rimborso.",
  },
  {
    id: "rendicontazione",
    titolo: "Rendiconta e ottieni il rimborso",
    sintesi:
      "Il voucher è erogato a rimborso: prima si paga e si documenta, poi si incassa la quota pubblica.",
    azioni: [
      "Raccogli la documentazione di spesa: fattura del corso e prova del pagamento effettivo.",
      "Verifica che l'attestato e la certificazione finale siano stati emessi per ogni partecipante.",
      "Presenta la domanda di liquidazione secondo le modalità e i termini dell'avviso.",
      "Conserva tutta la documentazione per il periodo previsto: le verifiche possono arrivare anche a distanza di tempo.",
    ],
    attenzione:
      "A rimborso significa che l'impresa anticipa il costo del corso e riceve la quota pubblica dopo. Mettilo in conto nella pianificazione di cassa.",
  },
];

export const FAQ = [
  {
    d: "Chi presenta la domanda: l'azienda o Starting Work?",
    r: "La domanda la presenta l'impresa (o il lavoratore autonomo) dal portale Bandi e Servizi, perché il voucher è intestato al destinatario della formazione. Noi ti affianchiamo in ogni passaggio e ti forniamo i dati del corso a catalogo, ma la firma e l'invio restano tuoi.",
  },
  {
    d: "Serve lo SPID? Di chi?",
    r: "Serve un'identità digitale (SPID, CIE o CNS) della persona che presenta la domanda per l'impresa, che deve avere i poteri di firma o una delega formale. Non è sufficiente lo SPID di un dipendente qualsiasi.",
  },
  {
    d: "Quanti lavoratori posso iscrivere?",
    r: "Non c'è un numero fisso di persone: il limite è economico. Ogni lavoratore può ricevere al massimo € 2.000 di voucher per anno solare, e ogni impresa al massimo € 50.000 per anno solare. Il numero di partecipanti che riesci a finanziare dipende dal costo del percorso e dalla quota pubblica che ti spetta.",
  },
  {
    d: "Quanto pago di tasca mia?",
    r: "Dipende dalla dimensione dell'impresa: il 10% se sei libero professionista, lavoratore autonomo o impresa fino a 9 addetti; il 30% da 10 a 50 addetti; il 50% da 51 addetti in su. La quota restante è pubblica.",
  },
  {
    d: "Il voucher è anticipato o a rimborso?",
    r: "A rimborso. L'impresa sostiene il costo del corso e riceve la quota pubblica dopo la conclusione, a fronte della documentazione di spesa e del raggiungimento della frequenza minima.",
  },
  {
    d: "Cosa succede se un partecipante non raggiunge il 75% delle ore?",
    r: "Per quel partecipante il voucher non viene riconosciuto e il costo resta interamente a carico dell'impresa. Gli altri partecipanti non vengono penalizzati. Se vedi che qualcuno sta accumulando assenze, avvisaci prima della fine del corso: a volte si riesce a recuperare.",
  },
  {
    d: "Posso sostituire un partecipante dopo aver presentato la domanda?",
    r: "Le sostituzioni sono possibili solo entro i limiti previsti dall'avviso e vanno comunicate formalmente. Non dare per scontato che basti mandare un'altra persona in aula: scrivici prima, valutiamo insieme se e come si può fare.",
  },
  {
    d: "Come si contano gli addetti per stabilire la quota pubblica?",
    r: "Si fa riferimento alla dimensione dell'impresa secondo i criteri dell'avviso, che considerano l'organico complessivo e non la singola unità locale. Se sei al confine tra due fasce (per esempio 9 o 10 addetti) verifica con noi prima di presentare: cambia la quota a tuo carico.",
  },
  {
    d: "Un mio collaboratore ha già usato un voucher quest'anno.",
    r: "Il massimale di € 2.000 è per anno solare e per persona: se ha già utilizzato una parte del plafond, resta disponibile solo la differenza. Segnalacelo in fase di preregistrazione, così valutiamo la capienza residua prima di presentare la domanda.",
  },
  {
    d: "Sono un libero professionista senza dipendenti: posso accedere?",
    r: "Sì, purché tu abbia domicilio fiscale in Lombardia. Rientri nella fascia con la quota pubblica più alta, il 90%, quindi il tuo contributo è del 10% del costo del corso.",
  },
  {
    d: "Che documentazione devo conservare per eventuali controlli?",
    r: "Domanda e ricevuta di protocollo, comunicazioni ricevute da Regione, fattura del corso e prova del pagamento, registri di presenza, attestato e certificazione finale. Conservali per tutto il periodo previsto dall'avviso: le verifiche possono arrivare anche a distanza di anni.",
  },
  {
    d: "Le risorse possono finire?",
    r: "Sì. Lo sportello lavora in ordine cronologico di presentazione e resta aperto fino a esaurimento delle risorse stanziate. È il motivo per cui conviene avere profilazione e documenti pronti prima dell'apertura, non dopo.",
  },
];
