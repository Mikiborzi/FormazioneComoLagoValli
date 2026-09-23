'use client'

import { useEffect, useState } from 'react'

const INK = '#0f172a'
const BLUE = '#1e3a8a'
const BORDER = '#e2e8f0'

function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [mostra, setMostra] = useState(false)
  const [errore, setErrore] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      if (res.ok) {
        const { token } = await res.json()
        sessionStorage.setItem('admin_token', token)
        onLogin(token)
      } else {
        setErrore(true)
        setPwd('')
      }
    } catch {
      setErrore(true)
      setPwd('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '48px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📘</div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Documentazione tecnica</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Riservata agli amministratori</p>
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <input type={mostra ? 'text' : 'password'} placeholder="Password" value={pwd}
              onChange={(e) => { setPwd(e.target.value); setErrore(false) }} autoFocus
              style={{ width: '100%', padding: '12px 48px 12px 16px', border: errore ? '2px solid #ef4444' : '2px solid #e2e8f0', borderRadius: '8px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
            <button type="button" onClick={() => setMostra((v) => !v)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', lineHeight: 1, padding: 0 }}>
              {mostra ? '🙈' : '👁️'}
            </button>
          </div>
          {errore && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px', textAlign: 'left' }}>Password non corretta</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Verifica...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Contenuti ────────────────────────────────────────────────────────────

const SEZIONI = [
  { id: 'panoramica', label: 'Panoramica' },
  { id: 'infrastruttura', label: 'Infrastruttura & deploy' },
  { id: 'pagine-pubbliche', label: 'Pagine pubbliche' },
  { id: 'form-condivisi', label: 'Form condivisi' },
  { id: 'api-pubbliche', label: 'API pubbliche' },
  { id: 'dashboard-admin', label: 'Dashboard admin' },
  { id: 'api-admin', label: 'API admin' },
  { id: 'database', label: 'Database' },
  { id: 'ai-academy', label: 'AI Academy & Voucher' },
  { id: 'note-operative', label: 'Note operative' },
]

function Tabella({ colonne, righe }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: `2px solid ${BORDER}` }}>
            {colonne.map((c, i) => (
              <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {righe.map((r, ri) => (
            <tr key={ri} style={{ borderBottom: '1px solid #f1f5f9', background: ri % 2 === 0 ? 'white' : '#fafafa' }}>
              {r.map((cella, ci) => (
                <td key={ci} style={{ padding: '8px 12px', color: '#334155', verticalAlign: 'top' }}>{cella}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Sezione({ id, titolo, children }) {
  return (
    <section id={id} style={{ background: 'white', borderRadius: '10px', padding: '28px 32px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', scrollMarginTop: '80px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: INK, marginBottom: '18px', borderBottom: `2px solid ${BORDER}`, paddingBottom: '10px' }}>{titolo}</h2>
      {children}
    </section>
  )
}

function Nota({ tipo = 'info', children }) {
  const stili = {
    info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1e3a8a' },
    warning: { bg: '#FEF3C7', border: '#f59e0b', color: '#92400E' },
    danger:  { bg: '#FEE2E2', border: '#ef4444', color: '#991B1B' },
  }
  const s = stili[tipo]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px', padding: '12px 16px', margin: '12px 0', fontSize: '13px', color: s.color, lineHeight: '1.6' }}>
      {children}
    </div>
  )
}

const p = { fontSize: '14px', lineHeight: '1.7', color: '#334155', marginBottom: '12px' }
const code = { fontFamily: 'monospace', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontSize: '13px' }
const h3 = { fontSize: '16px', fontWeight: '700', color: INK, marginTop: '22px', marginBottom: '10px' }

function Contenuto() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>

      <Sezione id="panoramica" titolo="📘 Panoramica">
        <p style={p}>
          Questo sito (<code style={code}>formazionecomolago.it</code>) è la piattaforma di <strong>Formazione Como Lago e Valli</strong>,
          gestita da Starting Work Impresa Sociale Srl. Raccoglie iscrizioni e domande di contatto per diverse linee di prodotto —
          corsi finanziati DIL/GOL, IFTS, Formazione Impresa a pagamento, il Voucher Formazione Continua di Regione Lombardia
          (di cui AI Academy è oggi l'unico corso a catalogo) — e le fa confluire in un'unica dashboard operativa in <code style={code}>/admin</code>.
        </p>
        <p style={p}>
          Stack tecnologico: <strong>Next.js 16.2</strong> (App Router, Turbopack) + <strong>React 19.2</strong>, database <strong>Supabase</strong>
          (Postgres + Auth + Storage), invio email transazionali con <strong>Resend</strong>, export Excel con la libreria <code style={code}>xlsx</code>.
          Nessun framework CSS: tutto lo stile è inline (style-in-JS), sia nelle pagine pubbliche (spesso con classi Tailwind) sia nella dashboard admin
          (oggetti <code style={code}>style</code> React puri).
        </p>
      </Sezione>

      <Sezione id="infrastruttura" titolo="🖥️ Infrastruttura & deploy">
        <Tabella
          colonne={['Voce', 'Valore']}
          righe={[
            ['Server', 'Hetzner (VPS dedicato, nome host "MKB-HUB"), root@91.99.201.119'],
            ['Percorso applicazione', <code style={code}>/var/www/formazionecomolago</code>],
            ['Process manager', 'PM2 — processo "formazionecomolago", modalità fork, porta 3003'],
            ['Reverse proxy', 'nginx → proxy_pass su localhost:3003, TLS via Certbot/Let\'s Encrypt'],
            ['Repository', <code style={code}>github.com/Mikiborzi/FormazioneComoLagoValli</code>],
            ['Node / npm', 'Node v24.14.0 (gestito via nvm), npm 11.9.0'],
          ]}
        />
        <div style={h3}>Flusso di deploy (manuale)</div>
        <p style={p}>Non esiste una pipeline CI/CD automatica: il deploy è manuale, tipicamente via SSH:</p>
        <ol style={{ ...p, paddingLeft: '20px' }}>
          <li>Modifica dei file sorgente in <code style={code}>/var/www/formazionecomolago</code></li>
          <li><code style={code}>npm run build</code> (Next.js in produzione: <code style={code}>next start</code>, non <code style={code}>next dev</code> — le modifiche non si vedono senza rebuild)</li>
          <li><code style={code}>pm2 restart formazionecomolago</code></li>
        </ol>
        <div style={h3}>Variabili d'ambiente (nomi, mai valori)</div>
        <p style={p}>
          Definite in <code style={code}>.env.local</code> sul server (non versionato):{' '}
          <code style={code}>NEXT_PUBLIC_SUPABASE_URL</code>, <code style={code}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,{' '}
          <code style={code}>SUPABASE_SERVICE_ROLE_KEY</code>, <code style={code}>NEXT_PUBLIC_ADMIN_EMAIL</code>,{' '}
          <code style={code}>RESEND_API_KEY</code>, <code style={code}>CRON_SECRET</code>, <code style={code}>ADMIN_PASSWORD</code>,{' '}
          <code style={code}>ADMIN_SESSION_TOKEN</code>.
        </p>
      </Sezione>

      <Sezione id="pagine-pubbliche" titolo="🌐 Pagine pubbliche">
        <p style={p}>Mappa di tutte le route pubbliche, cosa fanno e dove scrivono i dati.</p>
        <Tabella
          colonne={['Route', 'Cosa fa']}
          righe={[
            [<code style={code}>/</code>, 'Homepage: elenco corsi DIL, categorie più richieste (da categorie_formative), vetrina testimonianze.'],
            [<code style={code}>/corsi/[slug]</code>, 'Dettaglio corso (statico, generateStaticParams da app/data/corsi) + form iscrizione FormIscrizione.'],
            [<code style={code}>/testimonianze</code>, 'Recensioni approvate (tabella recensioni, visibile=true) + form di gradimento multi-step.'],
            [<code style={code}>/proponi-corso</code>, 'Form "proponi un corso": scrive su desideri_formativi.'],
            [<code style={code}>/formazione-impresa</code>, 'Landing informativa su corsi aziendali a pagamento (voucher Formazione Continua).'],
            [<code style={code}>/formazione-impresa/iscriviti</code>, 'Form iscrizione azienda: scrive iscrizioni_impresa + contatti + interazioni.'],
            [<code style={code}>/formazione-impresa/contatto</code>, 'Form di contatto azienda: scrive contatti_impresa + contatti + interazioni.'],
            [<code style={code}>/ai-academy</code>, 'Landing AI Academy (corso a catalogo, vedi sezione dedicata più sotto).'],
            [<code style={code}>/ai-academy/area-riservata</code>, 'Guida operativa al voucher per chi si è preregistrato (o admin), contenuti serviti solo lato server via /api/voucher/guida.'],
            [<code style={code}>/voucher-formazione-continua</code>, 'Wizard preregistrazione azienda + partecipanti al voucher (crea/riprende una "pratica").'],
            [<>{<code style={code}>/ifts</code>} + /ifts/candidati + /ifts/aziende</>, 'Percorsi IFTS: pagine informative + due form (candidato, azienda).'],
            [<code style={code}>/servizi-lavoro</code>, 'Form DIL/ricerca lavoro con upload CV su Supabase Storage (bucket "cvs") e verifica idoneità DIL.'],
            [<>{<code style={code}>/accedi</code>}, /registrati, /password-dimenticata, /reimposta-password</>, 'Autenticazione utente finale via Supabase Auth diretto (non passa da API custom).'],
            [<code style={code}>/area-personale</code>, 'Area utente loggato: mostra le proprie iscrizioni/stato da tabella iscrizioni.'],
            [<>{<code style={code}>/cookie-policy</code>}, /privacy-policy</>, 'Pagine legali statiche.'],
          ]}
        />
      </Sezione>

      <Sezione id="form-condivisi" titolo="📝 Componenti form condivisi">
        <p style={p}>
          Quasi tutti i form pubblici scrivono <strong>direttamente su Supabase dal browser</strong> con la chiave anon
          (nessuna API route intermedia): la sicurezza è demandata a RLS lato Postgres (INSERT permesso, SELECT/UPDATE bloccati per anon).
        </p>
        <Tabella
          colonne={['Componente', 'Usato in', 'Scrive su']}
          righe={[
            ['FormIscrizione.js', '/corsi/[slug]', 'iscrizioni (+ newsletter, corsi_interesse contatore)'],
            ['FormGradimento.jsx', '/testimonianze', 'recensioni (visibile:false), video_testimonianze, newsletter'],
            ['FormContattoImpresa.jsx', '/formazione-impresa/contatto', 'contatti (upsert), contatti_impresa, interazioni'],
            ['FormIscrizioneImpresa.jsx', '/formazione-impresa/iscriviti', 'contatti (upsert), iscrizioni_impresa, interazioni, newsletter'],
            ['ProponCorsoForm.js', '/proponi-corso', 'desideri_formativi, newsletter, categorie_formative contatore'],
            ['AccountPrompt.js', 'dopo iscrizione corso', 'supabase.auth.signUp (crea account area-personale)'],
          ]}
        />
        <Nota tipo="info">
          <strong>Nota</strong>: recensioni e video_testimonianze vengono create con <code style={code}>visibile</code>/<code style={code}>approvato</code>{' '}
          a <code style={code}>false</code> — serve un'approvazione manuale (attualmente non gestita da un tab admin dedicato) prima che compaiano sul sito.
        </Nota>
      </Sezione>

      <Sezione id="api-pubbliche" titolo="🔌 API pubbliche (app/api/, esclusa /api/admin/*)">
        <Tabella
          colonne={['Route', 'Metodi', 'Protezione', 'Scopo']}
          righe={[
            [<code style={code}>/api/lookup-email</code>, 'GET', 'Sessione Supabase Auth (legge solo l\'email del richiedente loggato)', 'Auto-compila i form aziendali con dati già noti da "contatti".'],
            [<code style={code}>/api/voucher/azienda</code>, 'POST/PATCH', 'PATCH richiede id+token_accesso della pratica', 'Crea/modifica un\'azienda voucher; blocca P.IVA duplicate.'],
            [<code style={code}>/api/voucher/riprendi</code>, 'POST', 'P.IVA + email referente (match)', '"Login" alla propria pratica voucher: restituisce azienda + partecipanti.'],
            [<code style={code}>/api/voucher/partecipante</code>, 'POST/PATCH/DELETE', 'token_accesso della pratica', 'CRUD partecipanti di una pratica voucher.'],
            [<code style={code}>/api/voucher/guida</code>, 'POST', 'P.IVA+email, oppure Bearer ADMIN_SESSION_TOKEN', 'Serve la guida operativa al voucher (contenuti solo server-side).'],
            [<code style={code}>/api/ifts/aziende</code>, 'POST', 'Nessuna (solo validazione campi)', 'Form azienda IFTS.'],
            [<code style={code}>/api/ifts/candidati</code>, 'POST', 'Nessuna (solo validazione campi)', 'Form candidato IFTS.'],
            [<code style={code}>/api/report-giornaliero</code>, 'GET', 'Bearer CRON_SECRET', 'Cron giornaliero (18:00): email riepilogo preiscrizioni via Resend.'],
          ]}
        />
      </Sezione>

      <Sezione id="dashboard-admin" titolo="🗂️ Dashboard admin (/admin)">
        <div style={h3}>Autenticazione</div>
        <p style={p}>
          Password unica condivisa (<code style={code}>ADMIN_PASSWORD</code>) → <code style={code}>POST /api/admin/auth</code> restituisce un token
          statico (<code style={code}>ADMIN_SESSION_TOKEN</code>, sempre uguale, non scade) salvato in <code style={code}>sessionStorage['admin_token']</code>.
          Ogni chiamata successiva porta <code style={code}>Authorization: Bearer &lt;token&gt;</code>; ogni route <code style={code}>/api/admin/*</code>{' '}
          verifica quel token con la stessa funzione <code style={code}>verificaToken()</code> duplicata in ciascun file, poi usa la{' '}
          <strong>service role key</strong> per bypassare RLS. Non esistono utenti distinti: chiunque ha il token ha accesso completo.
        </p>
        <div style={h3}>Tab della dashboard</div>
        <Tabella
          colonne={['Tab', 'Dati', 'Azioni operatore']}
          righe={[
            ['🎓 DIL / Servizi Lavoro', 'iscrizioni', 'Cambio stato, note operatore, export CSV.'],
            ['🎟️ Voucher Formazione Continua › 📋 Elenco', 'voucher_aziende + voucher_partecipanti, edizioni (per il selettore)', 'Cambio stato azienda (incl. archiviato), assegnazione partecipante→edizione, export Excel/CSV (anche formato SIUF).'],
            ['🎟️ Voucher Formazione Continua › 📚 Corsi & Edizioni', 'corsi, edizioni_corso, uditori, partecipanti', 'Crea corsi ed edizioni (calendario+sede), cambia stato edizione, gestisce uditori.'],
            ['🎟️ Voucher Formazione Continua › 📅 Calendario', 'edizioni_corso (sola lettura)', 'Vista cronologica con avviso automatico di conflitti sede/data.'],
            ['🎟️ Voucher Formazione Continua › 🧾 Fatturazione', 'fatture_voucher + suggerimenti calcolati', 'Crea fatture da edizioni avviate, aggiorna numero/data/stato fattura.'],
            ['🎟️ Voucher Formazione Continua › 🗄️ Archiviati', 'voucher_aziende (stato=archiviato)', 'Ripristina un\'azienda archiviata in un altro stato.'],
            ['🏭 Percorsi IFTS', 'ifts_candidati + ifts_aziende', 'Cambio stato per candidati/aziende (due sotto-tab).'],
            ['🔴 Formazione Impresa', 'iscrizioni_impresa + contatti_impresa', 'Cambio stato, note operatore.'],
            ['👥 CRM Contatti', 'contatti + interazioni (tutte le fonti)', 'Vista unificata cross-canale, cambio stato interazione, note contatto.'],
          ]}
        />
      </Sezione>

      <Sezione id="api-admin" titolo="🔐 API admin (app/api/admin/*)">
        <p style={p}>Tutte seguono lo stesso schema: verifica <code style={code}>Bearer ADMIN_SESSION_TOKEN</code>, poi query con service role key.</p>
        <Tabella
          colonne={['Route', 'Tabelle']}
          righe={[
            [<code style={code}>/api/admin/auth</code>, '— (verifica password, emette token)'],
            [<code style={code}>/api/admin/iscrizioni</code>, 'iscrizioni'],
            [<code style={code}>/api/admin/ifts</code>, 'ifts_candidati, ifts_aziende'],
            [<code style={code}>/api/admin/impresa</code>, 'iscrizioni_impresa, contatti_impresa'],
            [<code style={code}>/api/admin/contatti</code>, 'contatti, interazioni'],
            [<code style={code}>/api/admin/voucher</code>, 'voucher_aziende (+ partecipanti annidati)'],
            [<code style={code}>/api/admin/corsi</code>, 'corsi'],
            [<code style={code}>/api/admin/edizioni</code>, 'edizioni_corso (con controllo conflitti sede/data)'],
            [<code style={code}>/api/admin/edizioni/uditori</code>, 'edizione_uditori'],
            [<code style={code}>/api/admin/partecipanti</code>, 'voucher_partecipanti (assegnazione edizione_id)'],
            [<code style={code}>/api/admin/fatture</code>, 'fatture_voucher (+ suggerimenti calcolati)'],
          ]}
        />
      </Sezione>

      <Sezione id="database" titolo="🗄️ Database (Supabase Postgres)">
        <p style={p}>
          Schema tracciato in <code style={code}>supabase/schema.sql</code> + migrazioni in <code style={code}>supabase/migrations/</code>.
          Due livelli di protezione RLS: le tabelle dei form pubblici permettono <code style={code}>INSERT</code> alla chiave anon ma bloccano
          lettura/modifica; le tabelle con dati personali/finanziari sensibili (voucher, edizioni, fatture) hanno RLS abilitata{' '}
          <strong>senza nessuna policy</strong> per anon/authenticated — solo la service role key (usata server-side nelle route admin) può leggerle o scriverle.
        </p>
        <div style={h3}>Tabelle tracciate in schema.sql / migrations</div>
        <Tabella
          colonne={['Tabella', 'Scopo', 'Accesso anon']}
          righe={[
            ['iscrizioni', 'Iscrizioni corsi DIL + form servizi-lavoro', 'INSERT only'],
            ['newsletter', 'Iscritti newsletter', 'INSERT + UPDATE (upsert)'],
            ['corsi_interesse', 'Contatore interesse per corso', 'SELECT + INSERT + UPDATE'],
            ['categorie_formative', 'Categorie dropdown "Proponi corso"', 'SELECT + UPDATE (contatore)'],
            ['desideri_formativi', 'Proposte corso da /proponi-corso', 'INSERT only'],
            ['contatti', 'Anagrafica unificata persona/azienda', 'INSERT + UPDATE (upsert)'],
            ['interazioni', 'Log unificato di ogni submission, multi-canale', 'INSERT only'],
            ['iscrizioni_impresa', 'Iscrizioni Formazione Impresa (dati fatturazione)', 'INSERT only'],
            ['contatti_impresa', 'Richieste contatto Formazione Impresa', 'INSERT only'],
            ['corsi', 'Catalogo corsi (AI Academy seminato)', 'Nessuno — solo service role'],
            ['edizioni_corso', 'Edizioni concrete di un corso (calendario, sede)', 'Nessuno — solo service role'],
            ['edizione_uditori', 'Uditori liberi legati a un\'edizione', 'Nessuno — solo service role'],
            ['fatture_voucher', 'Fatture voucher, importo sempre a prezzo pieno', 'Nessuno — solo service role'],
          ]}
        />
        <Nota tipo="warning">
          <strong>Schema drift noto</strong>: le tabelle <code style={code}>voucher_aziende</code>, <code style={code}>voucher_partecipanti</code>,{' '}
          <code style={code}>ifts_candidati</code>, <code style={code}>ifts_aziende</code>, <code style={code}>recensioni</code> e{' '}
          <code style={code}>video_testimonianze</code> sono usate ampiamente nel codice ma il loro <code style={code}>CREATE TABLE</code>{' '}
          non esiste in nessun file tracciato (create direttamente da SQL editor Supabase). Le colonne elencate qui sotto sono ricostruite
          dal codice applicativo, non da una fonte DDL. Andrebbe scritta una migrazione "documentativa" (CREATE TABLE IF NOT EXISTS con lo
          schema reale) per chiudere questo gap.
        </Nota>
        <div style={h3}>voucher_aziende (schema ricostruito dal codice)</div>
        <p style={p}>
          id, ragione_sociale, piva_cf (UNIQUE, normalizzata maiuscolo/no-spazi), codice_ateco, sede_operativa, numero_addetti (testo:
          "≤9 addetti" / "10-50 addetti" / "≥51 addetti"), referente_nome/cognome/email/telefono, legale_rappresentante_nome/cognome/cf,{' '}
          stato (nuovo/contattato/iscritto/annullato/archiviato), note_operatore, token_accesso (capability token per auto-gestione pratica),
          conclusa_il, fascia_addetti (fino_9/dieci_50/oltre_50, normalizzata, solo informativa), created_at/updated_at.
        </p>
        <div style={h3}>voucher_partecipanti</div>
        <p style={p}>
          id, azienda_id (FK), nome, cognome, codice_fiscale, data_nascita, luogo_nascita, sesso, cittadinanza, titolo_studio,
          condizione_occupazionale, condizione_vulnerabilita, indirizzo, comune, provincia, cap, tipologia_rapporto, numero_cob,
          data_assunzione, orario_lavoro, partita_iva, email, telefono, privacy_firmata, <strong>edizione_id</strong> (FK →
          edizioni_corso, assegnazione all'edizione — niente corso_id duplicato: si deriva dal join), created_at/updated_at.
        </p>
      </Sezione>

      <Sezione id="ai-academy" titolo="🎓 AI Academy & Voucher Formazione Continua">
        <p style={p}>
          Il sistema più recente, costruito per gestire l'intero ciclo di vita del corso AI Academy dal punto di vista amministrativo:
          dalla preregistrazione dell'azienda fino alla fattura.
        </p>
        <div style={h3}>Flusso completo</div>
        <ol style={{ ...p, paddingLeft: '20px' }}>
          <li>Azienda/professionista si preregistra su <code style={code}>/voucher-formazione-continua</code> → riga in voucher_aziende + voucher_partecipanti.</li>
          <li>Admin crea un'<strong>edizione</strong> per il corso (Voucher Formazione Continua › sotto-sezione "Corsi & Edizioni"): sede, calendario incontri, posti max, data inizio/fine.</li>
          <li>Admin assegna ogni partecipante preregistrato a un'edizione (colonna "Edizione" nel tab Voucher, evidenziata in blu accanto al nome).</li>
          <li>Quando l'edizione <strong>parte</strong> (stato "avviata", automaticamente se la data inizio è raggiunta o manualmente), diventa fatturabile.</li>
          <li>La sotto-sezione Fatturazione mostra un importo suggerito a <strong>prezzo pieno</strong> (costo corso × partecipanti di quell'azienda — nessuno sconto:
            è l'azienda a farsi rimborsare la propria quota dalla Regione con una domanda separata). L'admin crea la fattura, che congela
            l'importo calcolato in quel momento (non si sposta se cambiano i partecipanti dopo).</li>
          <li>Pratiche chiuse/non più attive si spostano a stato "archiviato", uscendo dall'elenco Voucher principale ma restando consultabili nella sotto-sezione Archiviati.</li>
        </ol>
        <div style={h3}>Prevenzione conflitti di calendario</div>
        <p style={p}>
          <code style={code}>app/lib/edizioni.js</code> espone <code style={code}>trovaConflittiSede()</code>: confronta la sede normalizzata
          (minuscolo, spazi rimossi) e le date effettive degli incontri (non il semplice range data_inizio/data_fine, per evitare falsi
          positivi tra edizioni con giorni della settimana diversi nello stesso periodo). È un <strong>avviso</strong>, non un blocco: decide l'admin.
        </p>
      </Sezione>

      <Sezione id="note-operative" titolo="⚠️ Note operative & criticità note">
        <Nota tipo="danger">
          <strong>CRON_SECRET in chiaro</strong>: il cron giornaliero (report-giornaliero, ore 18:00) è lanciato da crontab root con{' '}
          <code style={code}>curl -H "Authorization: Bearer &lt;CRON_SECRET&gt;" ...</code> — il segreto appare in chiaro nell'output di{' '}
          <code style={code}>crontab -l</code>. Rischio basso (richiede accesso root al server per essere letto) ma da sistemare: spostare
          il segreto in uno script wrapper che lo legge da <code style={code}>.env.local</code> invece di scriverlo nella riga di crontab.
        </Nota>
        <Nota tipo="warning">
          <strong>Moderazione contenuti mancante</strong>: <code style={code}>recensioni</code> e <code style={code}>video_testimonianze</code>{' '}
          vengono create con <code style={code}>visibile</code>/<code style={code}>approvato</code> a <code style={code}>false</code>, ma
          non esiste ancora un tab admin per approvarle: l'unico modo per pubblicarle oggi è aggiornare la riga direttamente da Supabase.
        </Nota>
        <Nota tipo="info">
          <strong>Autenticazione admin</strong>: password unica condivisa, nessun utente distinto, nessuna scadenza del token. Adeguato per
          un piccolo team fidato; da rivedere se il numero di operatori con accesso alla dashboard dovesse crescere.
        </Nota>
      </Sezione>

    </div>
  )
}

export default function DocumentazionePage() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sezioneAttiva, setSezioneAttiva] = useState('panoramica')

  /* eslint-disable react-hooks/set-state-in-effect --
     Bootstrap sessione: sessionStorage è disponibile solo lato client. */
  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) setToken(t)
    setLoading(false)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!token) return
    const onScroll = () => {
      const posizione = window.scrollY + 100
      for (const s of SEZIONI) {
        const el = document.getElementById(s.id)
        if (el && el.offsetTop <= posizione) setSezioneAttiva(s.id)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [token])

  if (loading) return null
  if (!token) return <LoginScreen onLogin={setToken} />

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: INK, color: 'white', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>📘 Documentazione tecnica</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Formazione Como Lago e Valli — riservata agli amministratori</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: '600', border: '1px solid #475569', borderRadius: '6px', padding: '8px 14px' }}>
            ← Torna alla dashboard
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        <nav style={{ width: '220px', flexShrink: 0, padding: '24px 12px', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh', overflowY: 'auto' }}>
          {SEZIONI.map((s) => (
            <a key={s.id} href={`#${s.id}`}
              style={{
                display: 'block', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', marginBottom: '2px',
                fontWeight: sezioneAttiva === s.id ? '700' : '500',
                color: sezioneAttiva === s.id ? BLUE : '#64748b',
                background: sezioneAttiva === s.id ? '#eff6ff' : 'transparent',
              }}>
              {s.label}
            </a>
          ))}
        </nav>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Contenuto />
        </div>
      </div>
    </div>
  )
}
