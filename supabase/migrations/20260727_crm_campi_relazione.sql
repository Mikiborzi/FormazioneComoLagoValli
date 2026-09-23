-- Aggiunge campi di gestione relazione alla tabella contatti (CRM unificato).
-- Da eseguire nel SQL editor di Supabase. Idempotente: si può rilanciare.

alter table contatti
  add column if not exists stato_relazione text default 'lead'
    check (stato_relazione in ('lead', 'in_trattativa', 'cliente', 'chiuso'));

alter table contatti
  add column if not exists prossimo_contatto date;

alter table contatti
  add column if not exists responsabile text;

create index if not exists contatti_stato_relazione_idx ON contatti (stato_relazione);
create index if not exists contatti_prossimo_contatto_idx ON contatti (prossimo_contatto);

-- Verifica finale
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'contatti'
  and column_name in ('stato_relazione', 'prossimo_contatto', 'responsabile')
order by column_name;
