-- Corsi, edizioni, uditori, archiviazione voucher e fatturazione.
-- Da eseguire nel SQL editor di Supabase. Idempotente: si può rilanciare.
--
-- Verificato in produzione prima di scrivere questa migrazione:
--   voucher_aziende.numero_addetti ha solo 3 valori: '≤9 addetti', '10-50 addetti', '≥51 addetti'
--   voucher_aziende.stato ha solo: 'nuovo', 'annullato', 'iscritto'
-- Se questi valori sono cambiati da allora, ricontrollare prima di lanciare:
--   select distinct numero_addetti, count(*) from voucher_aziende group by 1;
--   select distinct stato, count(*) from voucher_aziende group by 1;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Corsi a catalogo. AI Academy è la prima riga; pensata per ospitarne altri.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists corsi (
  id                  uuid        primary key default gen_random_uuid(),
  nome                text        not null,
  codice_catalogo     text        unique,
  costo_partecipante  numeric(10,2),
  esente_iva          boolean     default true,
  ore_totali          integer,
  attivo              boolean     default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Edizioni concrete di un corso: calendario e sede vivono qui.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists edizioni_corso (
  id           uuid        primary key default gen_random_uuid(),
  corso_id     uuid        references corsi(id) on delete restrict,
  nome         text,
  data_inizio  date,
  data_fine    date,
  sede         text,
  calendario   jsonb,
  posti_max    integer     default 10,
  stato        text        default 'pianificata'
    check (stato in ('pianificata','avviata','conclusa','annullata')),
  note         text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Uditori: persone libere legate solo all'edizione, nessun legame azienda/voucher.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists edizione_uditori (
  id           uuid        primary key default gen_random_uuid(),
  edizione_id  uuid        references edizioni_corso(id) on delete cascade,
  nome         text,
  cognome      text,
  email        text,
  telefono     text,
  note         text,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Assegnazione partecipante → edizione. Il corso si deriva dal join
--    (edizione_id → edizioni_corso.corso_id): niente corso_id duplicato qui,
--    altrimenti i due campi possono andare fuori sincrono se l'edizione cambia corso.
-- ─────────────────────────────────────────────────────────────────────────────
alter table voucher_partecipanti
  add column if not exists edizione_id uuid references edizioni_corso(id) on delete set null;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Fascia addetti normalizzata. I 3 valori già in prod si mappano 1:1.
--    Solo informativa (quota di rimborso spettante all'azienda): non entra mai
--    nel calcolo dell'importo fatturato, che è sempre a prezzo pieno.
-- ─────────────────────────────────────────────────────────────────────────────
alter table voucher_aziende
  add column if not exists fascia_addetti text check (fascia_addetti in ('fino_9','dieci_50','oltre_50'));

update voucher_aziende set fascia_addetti = case numero_addetti
  when '≤9 addetti'    then 'fino_9'
  when '10-50 addetti' then 'dieci_50'
  when '≥51 addetti'   then 'oltre_50'
  else null
end where fascia_addetti is null;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Nuovo stato "archiviato": sposta la pratica fuori dal tab Voucher principale.
-- ─────────────────────────────────────────────────────────────────────────────
alter table voucher_aziende drop constraint if exists voucher_aziende_stato_check;
alter table voucher_aziende add constraint voucher_aziende_stato_check
  check (stato in ('nuovo','contattato','iscritto','annullato','archiviato'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Fatturazione. L'ente di formazione fattura il valore PIENO del percorso
--    (nessuno sconto): è l'azienda/professionista a farsi rimborsare la propria
--    quota dalla Regione con una domanda separata, che non passa da qui.
--    importo_computato/fascia_addetti_snapshot/numero_partecipanti_snapshot
--    congelano il calcolo al momento della creazione della riga, così una
--    fattura già emessa non si sposta se cambiano i partecipanti dopo.
--    Niente unique su (azienda_id, edizione_id): la fatturazione parziale è un caso reale.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists fatture_voucher (
  id                            uuid        primary key default gen_random_uuid(),
  azienda_id                    uuid        references voucher_aziende(id) on delete restrict,
  edizione_id                   uuid        references edizioni_corso(id) on delete restrict,
  importo                       numeric(10,2),
  importo_computato             numeric(10,2),
  fascia_addetti_snapshot       text,
  numero_partecipanti_snapshot  integer,
  numero_fattura                text,
  data_emissione                date,
  stato                         text        default 'da_emettere'
    check (stato in ('da_emettere','emessa','incassata')),
  note                          text,
  created_at                    timestamptz default now(),
  updated_at                    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. RLS: stesse regole delle tabelle voucher esistenti (20260721_voucher_hardening.sql).
--    Dati personali/finanziari: solo la service_role key (route handler lato server)
--    può leggerli o scriverli. La chiave anon è pubblica e non deve vedere nulla.
-- ─────────────────────────────────────────────────────────────────────────────
alter table corsi            enable row level security;
alter table edizioni_corso   enable row level security;
alter table edizione_uditori enable row level security;
alter table fatture_voucher  enable row level security;

revoke all on corsi, edizioni_corso, edizione_uditori, fatture_voucher from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Seed: AI Academy come primo corso a catalogo (solo se non già presente).
-- ─────────────────────────────────────────────────────────────────────────────
insert into corsi (nome, codice_catalogo, costo_partecipante, ore_totali)
select 'AI Academy', '17257', 1500.00, 30
where not exists (select 1 from corsi where codice_catalogo = '17257');

-- Verifica finale
select 'corsi' as tabella, count(*) from corsi
union all select 'edizioni_corso', count(*) from edizioni_corso
union all select 'edizione_uditori', count(*) from edizione_uditori
union all select 'fatture_voucher', count(*) from fatture_voucher;
