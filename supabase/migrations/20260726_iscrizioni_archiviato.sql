-- Aggiunge lo stato "archiviato" a iscrizioni (tab DIL / Servizi Lavoro).
-- Da eseguire nel SQL editor di Supabase. Idempotente: si può rilanciare.
--
-- Stessa logica già applicata a voucher_aziende: un candidato archiviato esce
-- dalla vista di default del tab admin (resta visibile solo filtrando
-- esplicitamente per "Archiviato"), senza bisogno di una pagina separata.

alter table iscrizioni drop constraint if exists iscrizioni_stato_check;
alter table iscrizioni add constraint iscrizioni_stato_check
  check (stato in ('nuovo', 'contattato', 'iscritto', 'non_idoneo', 'in_attesa', 'archiviato'));

-- Verifica finale
select stato, count(*) from iscrizioni group by stato order by stato;
