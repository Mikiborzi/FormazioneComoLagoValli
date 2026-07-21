#!/bin/bash
# Applica la migrazione voucher su Supabase.
# Uso:  bash m.sh
set -u

MIGRAZIONE="/var/www/formazionecomolago/supabase/migrations/20260721_voucher_hardening.sql"

echo
echo "════════════════════════════════════════════"
echo " Migrazione voucher → Supabase"
echo "════════════════════════════════════════════"
echo
echo "Incolla la connection string di Supabase e premi Invio."
echo "(Ctrl+Shift+V per incollare, oppure click destro su PuTTY)"
echo "Non vedrai comparire nulla: e' nascosta perche' contiene la password."
echo

read -rsp '> ' DBURL
echo
echo

if [ -z "${DBURL}" ]; then
  echo "❌ Non hai incollato nulla. Rilancia con: bash m.sh"
  exit 1
fi

if [[ "$DBURL" == *"YOUR-PASSWORD"* ]]; then
  echo "❌ La stringa contiene ancora il segnaposto [YOUR-PASSWORD]."
  echo "   Sostituiscilo con la password vera del database."
  echo "   (Supabase → Settings → Database → Reset database password)"
  exit 1
fi

echo "→ Applico la migrazione..."
echo

if ! psql "$DBURL" -v ON_ERROR_STOP=1 -f "$MIGRAZIONE"; then
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
echo "Ultimo passo, digita:  pm2 reload formazionecomolago"
echo
