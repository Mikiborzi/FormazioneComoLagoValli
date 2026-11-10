-- Iscrizioni alla serata di presentazione AI Academy per le imprese
-- (venerdì 27 novembre 2026, ore 18:00, Starting Work — Como).
-- Da eseguire nel SQL editor di Supabase. Idempotente: si può rilanciare.
--
-- La tabella è pensata per ospitare anche serate future: ogni riga porta lo
-- slug dell'evento (colonna `evento`), così la prossima serata non richiede
-- una tabella nuova.
--
-- Capienza (80 posti, in app/lib/serataAi.js): controllata dall'API sommando
-- num_persone delle iscrizioni dell'evento con stato diverso da 'annullato'.
--
-- RLS attiva SENZA policy: la chiave anon (pubblica nel bundle) non legge né
-- scrive nulla. Tutto passa dalle route server con service role:
--   GET/POST  /api/serata-ai      (modulo pubblico: posti residui e iscrizione)
--   GET/PATCH /api/admin/serata-ai (tab admin, protetto da token)

create table if not exists serata_iscrizioni (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  evento text not null,
  nome text not null,
  cognome text not null,
  email text not null,
  telefono text,
  azienda text,
  ruolo text,
  num_persone integer not null default 1 check (num_persone between 1 and 10),
  interessi text,
  messaggio text,
  consenso_privacy boolean not null default false,
  stato text not null default 'nuovo',
  note_operatore text
);

alter table serata_iscrizioni drop constraint if exists serata_iscrizioni_stato_check;
alter table serata_iscrizioni add constraint serata_iscrizioni_stato_check
  check (stato in ('nuovo', 'confermato', 'presente', 'assente', 'annullato'));

-- Una sola iscrizione per email e per evento (confronto senza maiuscole/spazi).
create unique index if not exists serata_iscrizioni_evento_email_idx
  on serata_iscrizioni (evento, lower(trim(email)));

alter table serata_iscrizioni enable row level security;

-- Il consenso privacy è obbligatorio anche a livello di database
-- (l'API lo controlla già: questo è un secondo livello di sicurezza).
alter table serata_iscrizioni drop constraint if exists serata_iscrizioni_consenso_privacy_check;
alter table serata_iscrizioni add constraint serata_iscrizioni_consenso_privacy_check
  check (consenso_privacy = true);

-- Consenso facoltativo a ricevere proposte e comunicazioni future,
-- separato dal consenso privacy.
alter table serata_iscrizioni add column if not exists consenso_marketing boolean not null default false;

-- Permessi espliciti per il ruolo usato dalle route server (service role).
grant select, insert, update, delete on serata_iscrizioni to service_role;

-- Verifica finale: deve tornare la tabella con RLS attiva (rowsecurity = true)
select tablename, rowsecurity from pg_tables where tablename = 'serata_iscrizioni';
