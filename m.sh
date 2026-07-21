#!/bin/bash
# Applica la migrazione voucher su Supabase.
# Uso:  bash m.sh
#
# Chiede solo la password del database: host, utente e porta sono ricavati dal
# progetto (connessione diretta, IPv6 — il pooler richiederebbe di conoscere
# la region). La password viaggia in PGPASSWORD e non dentro una URI, così i
# caratteri speciali non vanno url-encodati.
set -u

MIGRAZIONE="/var/www/formazionecomolago/supabase/migrations/20260721_voucher_hardening.sql"
HOST="db.fyjpiofjjkcjicaqdfll.supabase.co"

echo
echo "════════════════════════════════════════════"
echo " Migrazione voucher → Supabase"
echo "════════════════════════════════════════════"
echo
echo "Serve la password del database (NON quella del tuo account Supabase)."
echo
echo "Dove trovarla:"
echo "  Dashboard → Settings → Database → Database password"
echo "  Se non la ricordi: 'Reset database password' e copia quella nuova."
echo
echo "Incollala qui e premi Invio."
echo "Su PuTTY si incolla con il CLICK DESTRO del mouse."
echo "Non vedrai comparire nulla: e' nascosta apposta."
echo

read -rsp '> ' PGPASSWORD
echo
echo

if [ -z "${PGPASSWORD}" ]; then
  echo "❌ Non hai incollato nulla. Rilancia con: bash m.sh"
  exit 1
fi

case "$PGPASSWORD" in
  *"YOUR-PASSWORD"*|*"["*"]"*)
    echo "❌ Hai incollato il segnaposto, non la password vera."
    echo "   Serve solo la password, non tutta la connection string."
    exit 1
    ;;
  postgres://*|postgresql://*)
    echo "❌ Hai incollato la connection string intera."
    echo "   Serve SOLO la password (la parte tra ':' e '@')."
    exit 1
    ;;
esac

export PGPASSWORD
CONN="host=$HOST port=5432 dbname=postgres user=postgres sslmode=require"

echo "→ Verifico la connessione..."
if ! psql "$CONN" -c 'select 1' >/dev/null 2>&1; then
  echo "❌ Connessione fallita: password errata oppure database non raggiungibile."
  echo "   Rilancia con: bash m.sh"
  exit 1
fi
echo "✅ Connesso."
echo
echo "→ Applico la migrazione..."
echo

if ! psql "$CONN" -v ON_ERROR_STOP=1 -f "$MIGRAZIONE"; then
  echo
  echo "❌ Migrazione fallita. Copia l'errore qui sopra e mostramelo."
  exit 1
fi

echo
echo "✅ Migrazione applicata."
echo
echo "→ Verifico che la chiave pubblica non legga piu' i dati..."
echo

set -a
. /var/www/formazionecomolago/.env.local
set +a

RISPOSTA=$(curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/voucher_aziende?select=id&limit=1" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY")

if [ "$RISPOSTA" = "[]" ]; then
  echo "✅ Blindato: la chiave anonima non restituisce piu' alcun dato."
else
  echo "⚠️  Attenzione, la chiave anonima risponde ancora:"
  echo "   $RISPOSTA"
  echo "   Mostrami questo output."
fi

echo
echo "Fatto. Torna da Claude e scrivi 'fatto': pensa lui a build e reload."
echo
