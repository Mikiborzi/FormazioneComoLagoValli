-- Residenza e domicilio estesi sulla tabella iscrizioni.
-- Da eseguire nel SQL editor di Supabase. Idempotente: si può rilanciare
-- senza rischi, le colonne già presenti vengono semplicemente ignorate.
--
-- Perché serve: la Dote Inserimento Lavorativo (DIL) è riservata a chi è
-- residente O domiciliato in Lombardia. Senza la provincia non è possibile
-- verificare il requisito. Dal 26/07/2026 il campo provincia è obbligatorio
-- in entrambi i form (iscrizione ai corsi e Cerca Lavoro), quindi queste
-- colonne devono esistere prima di pubblicare il sito.

ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS cap_residenza          TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS provincia_residenza    TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS nazione_residenza      TEXT DEFAULT 'Italia';
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS comune_domicilio       TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS indirizzo_domicilio    TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS cap_domicilio          TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS provincia_domicilio    TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS nazione_domicilio      TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS interessato_formazione BOOLEAN;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS cv_url                 TEXT;

-- Indice per filtrare rapidamente i candidati lombardi nel backoffice.
CREATE INDEX IF NOT EXISTS iscrizioni_provincia_idx ON iscrizioni (provincia_residenza);

-- Verifica finale: elenca le colonne appena garantite. Se la migrazione è
-- andata a buon fine questa query restituisce 10 righe.
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'iscrizioni'
  AND column_name IN (
    'cap_residenza', 'provincia_residenza', 'nazione_residenza',
    'comune_domicilio', 'indirizzo_domicilio', 'cap_domicilio',
    'provincia_domicilio', 'nazione_domicilio',
    'interessato_formazione', 'cv_url'
  )
ORDER BY column_name;
