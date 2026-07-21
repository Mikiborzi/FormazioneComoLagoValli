-- Voucher Formazione Continua — messa in sicurezza e integrità dati.
-- Da eseguire nel SQL editor di Supabase. Idempotente: si può rilanciare.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. RLS: le tabelle voucher contengono dati personali (CF, email, indirizzi,
--    dati occupazionali). Nessuna policy => solo la service_role key, usata
--    esclusivamente nelle route handler lato server, può leggerle o scriverle.
--    La chiave anon è pubblica (viaggia nel bundle JS) e non deve vedere nulla.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('voucher_aziende', 'voucher_partecipanti')
  loop
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

alter table public.voucher_aziende      enable row level security;
alter table public.voucher_partecipanti enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Token di accesso alla pratica.
--    Sostituisce "conosco l'id" come autorizzazione per modifica/cancellazione.
--    Il default popola anche le righe già esistenti.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.voucher_aziende
  add column if not exists token_accesso uuid not null default gen_random_uuid();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. P.IVA / CF: normalizzazione e unicità.
--    Senza vincolo unique il controllo anti-doppione applicativo è soggetto a
--    race condition; la maiuscolizzazione serve ai codici fiscali, altrimenti
--    "Riprendi pratica" non ritrova la pratica per differenza di case.
-- ─────────────────────────────────────────────────────────────────────────────
update public.voucher_aziende
   set piva_cf = upper(regexp_replace(piva_cf, '\s', '', 'g'))
 where piva_cf is distinct from upper(regexp_replace(piva_cf, '\s', '', 'g'));

create unique index if not exists voucher_aziende_piva_cf_key
  on public.voucher_aziende (piva_cf);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Conclusione pratica: asse indipendente da `stato` (che resta il workflow
--    dell'operatore: nuovo/contattato/iscritto/annullato). Distingue una bozza
--    abbandonata da una pratica che l'azienda ha effettivamente concluso.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.voucher_aziende
  add column if not exists conclusa_il timestamptz;
