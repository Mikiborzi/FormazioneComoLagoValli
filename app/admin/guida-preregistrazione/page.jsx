'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Guida operativa per l'operatore che segue un'azienda nella preregistrazione al voucher.
// Elenca tutti i campi del modulo pubblico con la spiegazione del "perché" servono.
// Pensata per essere aperta in una scheda separata durante la telefonata.

const SEZIONI = [
  {
    id: 'azienda',
    titolo: 'Sezione 1 · Dati dell\'impresa',
    intro: 'Prima di tutto raccogliamo i dati dell\'impresa: sono quelli che identificano la partita e determinano la fascia dimensionale e quindi la quota pubblica del voucher.',
    campi: [
      { nome: 'Ragione sociale', obbligatorio: true, perche: 'Denominazione ufficiale dell\'azienda come risulta in visura camerale. Va scritta esattamente come compare nei documenti fiscali.' },
      { nome: 'Partita IVA / Codice Fiscale', obbligatorio: true, perche: 'Identifica univocamente l\'impresa a livello fiscale e sul portale Bandi e Servizi. Per ditte individuali può coincidere col CF del titolare.' },
      { nome: 'Codice ATECO', obbligatorio: false, perche: 'Codice di classificazione economica. Va richiesto: verifica il settore di attività e certifica l\'appartenenza al catalogo Formazione Continua.' },
      { nome: 'Sede operativa', obbligatorio: true, perche: 'Indirizzo dove il partecipante presta effettivamente servizio. Deve essere in Lombardia perché il voucher finanzia lavoratori con domicilio fiscale o sede lavorativa in regione.' },
      { nome: 'Numero addetti (fascia)', obbligatorio: true, opzioni: '≤9 · 10-50 · ≥51', perche: 'Da questa fascia dipende la quota pubblica: 90% micro (≤9), 70% piccole (10-50), 50% medie/grandi (≥51). Contare tutti i dipendenti in forza al momento della domanda.' },
    ],
  },
  {
    id: 'referente',
    titolo: 'Sezione 2 · Referente aziendale',
    intro: 'La persona con cui interagiremo per tutta la pratica: preregistrazione, domanda, incontri, rendicontazione.',
    campi: [
      { nome: 'Nome referente', obbligatorio: true },
      { nome: 'Cognome referente', obbligatorio: true },
      { nome: 'Email referente', obbligatorio: true, perche: 'Riceverà tutte le comunicazioni operative. Va indicato un indirizzo controllato quotidianamente.' },
      { nome: 'Telefono referente', obbligatorio: true, perche: 'Contatto diretto per follow-up e chiarimenti. Consigliato cellulare.' },
    ],
  },
  {
    id: 'legale',
    titolo: 'Sezione 3 · Legale rappresentante',
    intro: 'Chi ha i poteri di firma per l\'impresa. Firmerà la domanda sul portale Bandi e Servizi (con SPID/CIE/CNS).',
    campi: [
      { nome: 'Nome legale rappresentante', obbligatorio: true },
      { nome: 'Cognome legale rappresentante', obbligatorio: true },
      { nome: 'Codice fiscale legale rappresentante', obbligatorio: true, perche: 'Deve coincidere con il CF associato a SPID/CIE/CNS di firma. Se firma un delegato, sarà necessario l\'Allegato A.3 (Incarico).' },
    ],
  },
  {
    id: 'comunicazioni',
    titolo: 'Sezione 3-bis · Comunicazioni e pagamenti',
    intro: 'La PEC è obbligatoria per Regione Lombardia; l\'IBAN serve per l\'accredito della quota pubblica in rendicontazione.',
    campi: [
      { nome: 'PEC dell\'azienda', obbligatorio: true, perche: 'Tutte le comunicazioni ufficiali di Regione (ammissione, integrazioni, provvedimento) arrivano via PEC. Senza PEC la pratica non prosegue.' },
      { nome: 'IBAN azienda', obbligatorio: true, perche: 'Per l\'accredito della quota pubblica in fase di rendicontazione. Deve essere intestato all\'azienda, non a persona fisica.' },
      { nome: 'CCNL applicato', obbligatorio: false, perche: 'Contratto collettivo di riferimento. Utile per determinare l\'orario di lavoro e coerenza con il tipo di rapporto dichiarato.' },
    ],
  },
  {
    id: 'polizza',
    titolo: 'Sezione 3-ter · Polizza danni catastrofali (Legge 213/2023)',
    intro: 'Requisito obbligatorio per le imprese che accedono a contributi pubblici. I liberi professionisti sono esonerati.',
    campi: [
      { nome: 'Stato della polizza', obbligatorio: true, opzioni: 'Stipulata · In fase di stipula · Non ancora stipulata · Esonerato', perche: 'Ai sensi della L. 213/2023 (art. 1 commi 101-112), il mancato adempimento comporta esclusione da contributi e agevolazioni pubbliche. Se "non ancora stipulata", va sistemata prima della domanda.' },
      { nome: 'Compagnia assicurativa', obbligatorio: 'Sì se stipulata', perche: 'Nome della compagnia. Solo dato informativo, non rendicontato.' },
      { nome: 'Scadenza polizza', obbligatorio: 'Sì se stipulata', perche: 'Deve essere valida almeno fino al termine del percorso formativo.' },
    ],
  },
  {
    id: 'capienza',
    titolo: 'Sezione 3-quater · Capienza voucher',
    intro: 'Verifica preventiva del plafond de minimis e del tetto Formazione Continua.',
    campi: [
      { nome: 'Voucher già utilizzati nell\'anno solare', obbligatorio: false, perche: 'Il tetto è € 50.000 per impresa e € 2.000 per lavoratore nell\'anno solare. Se l\'azienda ha già usato altri voucher Formazione Continua nell\'anno, va sottratta la capienza consumata.' },
    ],
  },
  {
    id: 'partecipante-anagrafica',
    titolo: 'Sezione 4 · Partecipante — Anagrafica',
    intro: 'Per ogni partecipante al corso raccogliamo tutti i dati anagrafici. Andranno esattamente come sui documenti.',
    campi: [
      { nome: 'Nome e cognome', obbligatorio: true },
      { nome: 'Codice fiscale', obbligatorio: true, perche: 'Univoco. Un errore qui blocca l\'istruttoria.' },
      { nome: 'Data di nascita', obbligatorio: true },
      { nome: 'Luogo di nascita', obbligatorio: true, perche: 'Comune di nascita così come compare sulla carta d\'identità.' },
      { nome: 'Sesso', obbligatorio: true, opzioni: 'M · F · X' },
      { nome: 'Cittadinanza', obbligatorio: true },
      { nome: 'Titolo di studio', obbligatorio: true, opzioni: 'Nessun titolo · Licenza media · Diploma · Laurea · Post-laurea', perche: 'Dato di monitoraggio FSE+. Regione lo usa per report europei.' },
      { nome: 'Condizione di vulnerabilità', obbligatorio: false, perche: 'Facoltativo, su base volontaria. Se dichiarata, incide sulla priorità e su indicatori FSE+ dedicati.' },
    ],
  },
  {
    id: 'partecipante-residenza',
    titolo: 'Sezione 5 · Partecipante — Residenza / Domicilio',
    intro: 'La residenza (o domicilio se diverso) del lavoratore.',
    campi: [
      { nome: 'Indirizzo di residenza/domicilio', obbligatorio: true },
      { nome: 'Comune', obbligatorio: true },
      { nome: 'Provincia', obbligatorio: true, perche: 'Sigla di 2 lettere. Autonomi/professionisti devono avere domicilio fiscale in Lombardia.' },
      { nome: 'CAP', obbligatorio: true },
    ],
  },
  {
    id: 'rapporto',
    titolo: 'Sezione 6 · Rapporto di lavoro',
    intro: 'Descrive il legame contrattuale tra partecipante e impresa. Da qui dipende l\'ammissibilità.',
    campi: [
      { nome: 'Tipologia rapporto', obbligatorio: true, opzioni: 'Dip. indeterminato · Dip. determinato · Dip. part-time · Socio-lavoratore coop. · Titolare/socio · Libero prof./autonomo · Ditta individuale', perche: 'Solo queste tipologie sono ammesse. Sono esclusi tirocinanti, intermittenti, somministrati, apprendisti in periodo formativo, collaboratori familiari, amministratori con sola carica.' },
      { nome: 'Numero COB', obbligatorio: 'Sì per dipendenti e soci-lavoratori', perche: 'Codice Comunicazione Obbligatoria assegnato al momento dell\'assunzione. Se il rapporto è iniziato prima del 1° marzo 2008 va sostituito con contratto + ultimo cedolino.' },
      { nome: 'Data assunzione / decorrenza incarico', obbligatorio: false, perche: 'Utile per verificare l\'anzianità di servizio e la coerenza col COB.' },
      { nome: 'Orario di lavoro', obbligatorio: true, perche: 'Serve per garantire che la frequenza al corso avvenga in orario di lavoro (requisito FSE+ formazione continua). Es. "Lun-Ven 9-18".' },
      { nome: 'Partita IVA (solo autonomi/professionisti)', obbligatorio: 'Sì se autonomo', perche: 'Per liberi professionisti serve certificato P.IVA o iscrizione gestione separata INPS.' },
    ],
  },
  {
    id: 'contatti',
    titolo: 'Sezione 7 · Contatti del partecipante',
    campi: [
      { nome: 'Email personale', obbligatorio: true },
      { nome: 'Telefono cellulare', obbligatorio: true },
    ],
  },
  {
    id: 'consensi',
    titolo: 'Sezione 8 · Consensi e privacy',
    intro: 'Il partecipante firma l\'informativa privacy (Allegato A.5 del decreto). L\'azienda spunta il consenso GDPR.',
    campi: [
      { nome: 'Consenso GDPR azienda', obbligatorio: true },
      { nome: 'Consenso GDPR partecipante', obbligatorio: true },
      { nome: 'Informativa privacy firmata (Allegato A.5)', obbligatorio: true, perche: 'Documento che il partecipante deve firmare fisicamente. Va conservato agli atti.' },
      { nome: 'Iscrizione newsletter', obbligatorio: false, perche: 'Opzionale, per aggiornamenti sui bandi.' },
    ],
  },
]


const DOCUMENTI_DA_PREPARARE = [
  { doc: 'SPID / CIE / CNS del legale rappresentante', quando: 'Prima di aprire la pratica sul portale' },
  { doc: 'Visura camerale aggiornata', quando: 'Utile per verificare P.IVA, ATECO, sede e legale rappresentante' },
  { doc: 'PEC azienda attiva', quando: 'Per ricevere le comunicazioni ufficiali di Regione Lombardia' },
  { doc: 'IBAN azienda', quando: 'Per l\'accredito della quota pubblica in fase di rendicontazione' },
  { doc: 'Polizza danni catastrofali in corso (L. 213/2023)', quando: 'Requisito obbligatorio per imprese — esonerati i liberi professionisti' },
  { doc: 'COB (Comunicazione Obbligatoria) per ogni dipendente', quando: 'Da INPS/Portale Lavoro Lombardia' },
  { doc: 'Contratto + ultimo cedolino (dipendenti pre-2008)', quando: 'Se il rapporto è iniziato prima del 1° marzo 2008' },
  { doc: 'Libro soci + COB (soci-lavoratori cooperative)', quando: 'Per soci di cooperative' },
  { doc: 'Certificato P.IVA / iscrizione gestione separata INPS (autonomi)', quando: 'Per liberi professionisti e autonomi' },
  { doc: 'Bollo pagoPA da 16 €', quando: 'Prima dell\'invio della domanda' },
  { doc: 'Allegati A.1, A.2.a, A.3 (se delega), A.5 firmati', quando: 'Da caricare in domanda — modelli disponibili sul sito' },
]

export default function GuidaPreregistrazione() {
  const [autenticato, setAutenticato] = useState(false)
  const [caricato, setCaricato] = useState(false)

  useEffect(() => {
    const t = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null
    if (t) setAutenticato(true)
    setCaricato(true)
  }, [])

  if (!caricato) return null

  if (!autenticato) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ background:'white', padding:'48px', borderRadius:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.08)', textAlign:'center' }}>
          <p style={{ fontSize:'16px', color:'#334155', margin:'0 0 20px' }}>🔒 Sessione admin necessaria per vedere la guida</p>
          <Link href="/admin" style={{ background:'#0f172a', color:'white', padding:'10px 24px', borderRadius:'8px', textDecoration:'none', fontSize:'14px', fontWeight:'600' }}>Vai al login admin</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* HEADER */}
      <div style={{ background:'#0f172a', color:'white', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:'700', margin:0 }}>📋 Guida alla preregistrazione voucher</h1>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:'2px 0 0' }}>Traccia operativa per guidare l&apos;azienda nella compilazione del modulo</p>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={() => window.print()} style={{ background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', borderRadius:'6px', padding:'8px 16px', cursor:'pointer', fontSize:'13px' }}>🖨️ Stampa</button>
          <Link href="/admin" style={{ background:'#374151', color:'#9ca3af', padding:'8px 16px', borderRadius:'6px', fontSize:'13px', textDecoration:'none' }}>← Torna al cruscotto</Link>
        </div>
      </div>

      <div style={{ maxWidth:'980px', margin:'0 auto', padding:'32px 24px' }}>

        {/* INTRO */}
        <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'12px', padding:'20px 24px', marginBottom:'32px' }}>
          <p style={{ fontSize:'13px', fontWeight:'700', color:'#1e40af', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 8px' }}>Come si usa questa guida</p>
          <p style={{ fontSize:'14px', color:'#1e3a8a', margin:0, lineHeight:1.6 }}>
            Apri questa pagina in una scheda separata durante la chiamata con l&apos;azienda. Ogni sezione ripercorre in ordine i campi del modulo pubblico
            di preregistrazione. Il &quot;perché&quot; ti aiuta a spiegare all&apos;azienda a cosa serve un dato e a raccoglierlo bene la prima volta.
          </p>
          <p style={{ fontSize:'14px', color:'#1e3a8a', margin:'8px 0 0', lineHeight:1.6 }}>
            Modulo pubblico: <a href="/voucher-formazione-continua" target="_blank" rel="noopener noreferrer" style={{ color:'#1d4ed8', fontWeight:'600' }}>formazionecomolago.it/voucher-formazione-continua</a>
          </p>
        </div>

        {/* SEZIONI */}
        {SEZIONI.map(sez => (
          <div key={sez.id} style={{ background:'white', borderRadius:'12px', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ background:'#f8fafc', padding:'16px 24px', borderBottom:'1px solid #e2e8f0' }}>
              <h2 style={{ fontSize:'17px', fontWeight:'700', color:'#0f172a', margin:'0 0 4px' }}>{sez.titolo}</h2>
              {sez.intro && <p style={{ fontSize:'13px', color:'#64748b', margin:0, lineHeight:1.5 }}>{sez.intro}</p>}
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#fafafa' }}>
                  <th style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', width:'32%' }}>Campo</th>
                  <th style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', width:'12%' }}>Obbligatorio</th>
                  <th style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em' }}>Perché serve · Come compilare</th>
                </tr>
              </thead>
              <tbody>
                {sez.campi.map((c,idx) => (
                  <tr key={c.nome} style={{ borderBottom: idx === sez.campi.length-1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding:'12px 16px', fontSize:'14px', fontWeight:'600', color:'#0f172a', verticalAlign:'top' }}>
                      {c.nome}
                      {c.opzioni && <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px', fontWeight:'400' }}>Opzioni: {c.opzioni}</div>}
                    </td>
                    <td style={{ padding:'12px 16px', verticalAlign:'top' }}>
                      {c.obbligatorio === true ? (
                        <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700', background:'#fee2e2', color:'#991b1b' }}>Sì</span>
                      ) : c.obbligatorio === false ? (
                        <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700', background:'#f3f4f6', color:'#6b7280' }}>Facoltativo</span>
                      ) : (
                        <span style={{ padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:'700', background:'#fef3c7', color:'#92400e' }}>{c.obbligatorio}</span>
                      )}
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569', lineHeight:1.5, verticalAlign:'top' }}>{c.perche || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* DOCUMENTI DA PREPARARE */}
        <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'12px', padding:'20px 24px', marginTop:'24px' }}>
          <p style={{ fontSize:'13px', fontWeight:'700', color:'#166534', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 8px' }}>📎 Documenti da avere pronti prima della domanda</p>
          <p style={{ fontSize:'13px', color:'#14532d', margin:'0 0 14px', lineHeight:1.5 }}>
            Consiglia all&apos;azienda di raccogliere questi documenti già durante la preregistrazione — così quando apre lo sportello sul portale non perde tempo.
          </p>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <tbody>
              {DOCUMENTI_DA_PREPARARE.map(d => (
                <tr key={d.doc} style={{ borderBottom:'1px solid #bbf7d0' }}>
                  <td style={{ padding:'8px 12px', fontSize:'13px', fontWeight:'600', color:'#166534' }}>✓ {d.doc}</td>
                  <td style={{ padding:'8px 12px', fontSize:'12px', color:'#15803d', textAlign:'right', fontStyle:'italic' }}>{d.quando}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CHECKLIST FINALE */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'20px 24px', marginTop:'24px' }}>
          <p style={{ fontSize:'13px', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 12px' }}>✅ Fine chiamata — checklist operatore</p>
          <ul style={{ margin:0, padding:'0 0 0 20px', color:'#334155', fontSize:'14px', lineHeight:1.8 }}>
            <li>Ho verificato che l&apos;azienda rientri nella misura (P.IVA valida, sede lavorativa in Lombardia)</li>
            <li>Ho verificato la fascia dimensionale e comunicato la quota pubblica corrispondente</li>
            <li>Ho spiegato che il voucher è a rimborso: prima si paga, poi si incassa</li>
            <li>Ho spiegato la condizione del 75% di frequenza minima</li>
            <li>Ho ricordato che la domanda va presentata almeno 72 ore prima dell&apos;avvio del corso</li>
            <li>Ho consegnato il link al modulo pubblico e concordato quando compilarlo insieme</li>
            <li>Ho annotato eventuali blocchi o note sull&apos;azienda nel tab &quot;🎟️ Voucher Formazione Continua&quot;</li>
          </ul>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
