-- ============================================================
-- Formazione Como Lago e Valli – Schema Supabase
-- ============================================================

-- Abilita l'estensione pgcrypto se non già attiva (per gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Tabella iscrizioni ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS iscrizioni (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome              TEXT        NOT NULL,
  cognome           TEXT        NOT NULL,
  email             TEXT        NOT NULL,
  telefono          TEXT        NOT NULL,
  codice_fiscale    TEXT        NOT NULL,
  data_nascita      DATE        NOT NULL,
  comune_residenza  TEXT        NOT NULL,
  indirizzo         TEXT        NOT NULL,
  status            TEXT        NOT NULL
    CHECK (status IN (
      'disoccupato',
      'inoccupato',
      'studente_universitario',
      'studente_accademia',
      'occupato',
      'imprenditore'
    )),
  idoneo_gol        BOOLEAN     NOT NULL DEFAULT true,
  corsi_interesse   TEXT[]      NOT NULL,
  priorita_corsi    TEXT[],
  come_saputo       TEXT,
  newsletter        BOOLEAN     DEFAULT false,
  stato             TEXT        DEFAULT 'nuovo'
    CHECK (stato IN (
      'nuovo',
      'contattato',
      'iscritto',
      'non_idoneo',
      'in_attesa'
    )),
  note_operatore    TEXT,
  modalita_online   BOOLEAN     DEFAULT false,
  sedi_preferite    TEXT[]      DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Aggiorna tabelle esistenti (idempotente)
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS modalita_online BOOLEAN DEFAULT false;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS sedi_preferite TEXT[] DEFAULT '{}';
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS iscritto_cpi BOOLEAN;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS cpi_riferimento TEXT;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS gol_attivo BOOLEAN;
ALTER TABLE iscrizioni ADD COLUMN IF NOT EXISTS ente_gol TEXT;

-- Indici utili per la gestione backoffice
CREATE INDEX IF NOT EXISTS iscrizioni_stato_idx      ON iscrizioni (stato);
CREATE INDEX IF NOT EXISTS iscrizioni_idoneo_idx     ON iscrizioni (idoneo_gol);
CREATE INDEX IF NOT EXISTS iscrizioni_email_idx      ON iscrizioni (email);
CREATE INDEX IF NOT EXISTS iscrizioni_created_at_idx ON iscrizioni (created_at DESC);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER iscrizioni_updated_at
  BEFORE UPDATE ON iscrizioni
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Tabella newsletter ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS newsletter (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  nome       TEXT,
  attivo     BOOLEAN     DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsletter_attivo_idx ON newsletter (attivo);

-- ─── Tabella corsi_interesse ─────────────────────────────────────────────────
-- Conta le iscrizioni ricevute per ogni corso GOL (match su slug).

CREATE TABLE IF NOT EXISTS corsi_interesse (
  corso_slug   TEXT        PRIMARY KEY,
  contatore    INTEGER     DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabella categorie_formative ─────────────────────────────────────────────
-- Categorie usate nel form "Proponi un Corso" (select dropdown).

CREATE TABLE IF NOT EXISTS categorie_formative (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  titolo      TEXT        NOT NULL,
  descrizione TEXT,
  attiva      BOOLEAN     DEFAULT true,
  ordine      INTEGER     DEFAULT 0,
  contatore   INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tabella desideri_formativi ───────────────────────────────────────────────
-- Raccoglie le proposte di corso inviate dal form /proponi-corso.

CREATE TABLE IF NOT EXISTS desideri_formativi (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome             TEXT        NOT NULL,
  cognome          TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  telefono         TEXT        NOT NULL,
  codice_fiscale   TEXT,
  comune_residenza TEXT,
  status           TEXT,
  categoria_id     UUID        REFERENCES categorie_formative(id),
  categoria_nome   TEXT,
  descrizione      TEXT        NOT NULL,
  newsletter       BOOLEAN     DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS desideri_categoria_idx  ON desideri_formativi (categoria_id);
CREATE INDEX IF NOT EXISTS desideri_created_at_idx ON desideri_formativi (created_at DESC);

-- ─── RLS (Row Level Security) ────────────────────────────────────────────────
-- Il form usa la anon key: abilita INSERT ma blocca SELECT/UPDATE/DELETE al pubblico.

ALTER TABLE iscrizioni         ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter         ENABLE ROW LEVEL SECURITY;
ALTER TABLE corsi_interesse    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorie_formative ENABLE ROW LEVEL SECURITY;
ALTER TABLE desideri_formativi ENABLE ROW LEVEL SECURITY;

-- Permetti INSERT anonimo (dal form pubblico)
CREATE POLICY "insert_anonimo_iscrizioni"
  ON iscrizioni FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "insert_anonimo_newsletter"
  ON newsletter FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "insert_anonimo_desideri"
  ON desideri_formativi FOR INSERT TO anon WITH CHECK (true);

-- Upsert newsletter (aggiorna se email già presente)
CREATE POLICY "upsert_anonimo_newsletter"
  ON newsletter FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Lettura pubblica delle categorie (per il select nel form)
CREATE POLICY "lettura_pubblica_categorie"
  ON categorie_formative FOR SELECT TO anon USING (true);

-- Aggiornamento contatore categorie (dalla anon key)
CREATE POLICY "update_contatore_categorie"
  ON categorie_formative FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Lettura/scrittura pubblica del contatore corsi GOL
CREATE POLICY "select_corsi_interesse"
  ON corsi_interesse FOR SELECT TO anon USING (true);

CREATE POLICY "insert_corsi_interesse"
  ON corsi_interesse FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "update_corsi_interesse"
  ON corsi_interesse FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ─── Tabella contatti (anagrafica unificata) ────────────────────────────────
-- Record master per ogni persona/azienda, indipendente dalla fonte.

CREATE TABLE IF NOT EXISTS contatti (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email             TEXT        UNIQUE NOT NULL,
  nome              TEXT,
  cognome           TEXT,
  telefono          TEXT,
  ragione_sociale   TEXT,
  partita_iva       TEXT,
  codice_fiscale    TEXT,
  indirizzo         TEXT,
  cap               TEXT,
  citta             TEXT,
  provincia         TEXT,
  nazione           TEXT        DEFAULT 'Italia',
  azienda           TEXT,
  note              TEXT,
  newsletter        BOOLEAN     DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contatti_email_idx      ON contatti (email);
CREATE INDEX IF NOT EXISTS contatti_created_at_idx ON contatti (created_at DESC);

CREATE TRIGGER contatti_updated_at
  BEFORE UPDATE ON contatti
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Tabella interazioni (log unificato di tutti i contatti/iscrizioni) ───────
-- Ogni form submission genera una riga; canale traccia la fonte.

CREATE TABLE IF NOT EXISTS interazioni (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  contatto_id     UUID        REFERENCES contatti(id) ON DELETE SET NULL,
  canale          TEXT        NOT NULL,
  -- Valori canale: impresa_iscrizione | impresa_contatto | gol | servizi_lavoro
  --                ifts_candidato | ifts_azienda | proponi_corso
  tipo            TEXT        NOT NULL,
  -- Valori tipo: iscrizione | contatto | interesse | acquisto
  oggetto         TEXT,
  stato           TEXT        DEFAULT 'nuovo',
  dati            JSONB,
  note_operatore  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS interazioni_contatto_idx    ON interazioni (contatto_id);
CREATE INDEX IF NOT EXISTS interazioni_canale_idx      ON interazioni (canale);
CREATE INDEX IF NOT EXISTS interazioni_created_at_idx  ON interazioni (created_at DESC);

CREATE TRIGGER interazioni_updated_at
  BEFORE UPDATE ON interazioni
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE contatti    ENABLE ROW LEVEL SECURITY;
ALTER TABLE interazioni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anonimo_contatti"
  ON contatti FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "update_anonimo_contatti"
  ON contatti FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "insert_anonimo_interazioni"
  ON interazioni FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "operatori_contatti"
  ON contatti FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "operatori_interazioni"
  ON interazioni FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Aggiunge FK contatto_id alle tabelle derivate (idempotente)
ALTER TABLE iscrizioni_impresa ADD COLUMN IF NOT EXISTS contatto_id UUID REFERENCES contatti(id) ON DELETE SET NULL;
ALTER TABLE contatti_impresa   ADD COLUMN IF NOT EXISTS contatto_id UUID REFERENCES contatti(id) ON DELETE SET NULL;

-- ─── Tabella iscrizioni_impresa ──────────────────────────────────────────────
-- Iscrizioni ai percorsi Formazione Impresa con dati di fatturazione.

CREATE TABLE IF NOT EXISTS iscrizioni_impresa (
  id                       UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome                     TEXT        NOT NULL,
  cognome                  TEXT        NOT NULL,
  email                    TEXT        NOT NULL,
  telefono                 TEXT        NOT NULL,
  ragione_sociale          TEXT        NOT NULL,
  partita_iva              TEXT,
  codice_fiscale_azienda   TEXT,
  indirizzo_fatturazione   TEXT        NOT NULL,
  cap_fatturazione         TEXT,
  citta_fatturazione       TEXT        NOT NULL,
  provincia_fatturazione   TEXT,
  percorso_interesse       TEXT,
  note                     TEXT,
  newsletter               BOOLEAN     DEFAULT false,
  stato                    TEXT        DEFAULT 'nuovo'
    CHECK (stato IN ('nuovo', 'contattato', 'iscritto', 'annullato')),
  note_operatore           TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS iscrizioni_impresa_email_idx      ON iscrizioni_impresa (email);
CREATE INDEX IF NOT EXISTS iscrizioni_impresa_stato_idx      ON iscrizioni_impresa (stato);
CREATE INDEX IF NOT EXISTS iscrizioni_impresa_created_at_idx ON iscrizioni_impresa (created_at DESC);

CREATE TRIGGER iscrizioni_impresa_updated_at
  BEFORE UPDATE ON iscrizioni_impresa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Tabella contatti_impresa ─────────────────────────────────────────────────
-- Richieste di contatto dal form /formazione-impresa/contatto.

CREATE TABLE IF NOT EXISTS contatti_impresa (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT        NOT NULL,
  cognome    TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  telefono   TEXT        NOT NULL,
  azienda    TEXT,
  messaggio  TEXT,
  stato      TEXT        DEFAULT 'nuovo'
    CHECK (stato IN ('nuovo', 'contattato', 'chiuso')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contatti_impresa_email_idx      ON contatti_impresa (email);
CREATE INDEX IF NOT EXISTS contatti_impresa_created_at_idx ON contatti_impresa (created_at DESC);

ALTER TABLE iscrizioni_impresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatti_impresa   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anonimo_iscrizioni_impresa"
  ON iscrizioni_impresa FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "insert_anonimo_contatti_impresa"
  ON contatti_impresa FOR INSERT TO anon WITH CHECK (true);

-- Gli operatori autenticati vedono tutto
CREATE POLICY "operatori_iscrizioni"
  ON iscrizioni FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "operatori_newsletter"
  ON newsletter FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "operatori_corsi_interesse"
  ON corsi_interesse FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "operatori_categorie"
  ON categorie_formative FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "operatori_desideri"
  ON desideri_formativi FOR ALL TO authenticated USING (true) WITH CHECK (true);
