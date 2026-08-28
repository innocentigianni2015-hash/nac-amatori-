#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

DB_NAME="nac-amatori-db"
R2_NAME="nac-amatori-media"
CONFIG_FILE="wrangler.jsonc"
MIGRATION_FILE="drizzle/0000_chief_tinkerer.sql"

echo
echo "===================================================="
echo "  NAC AMATORI CASTELLANA - PUBBLICAZIONE CLOUDFLARE"
echo "===================================================="
echo

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Sul Mac non risulta installato Node.js."
  echo "Scaricalo da https://nodejs.org/ (versione LTS), installalo e riapri questo file."
  echo
  read -r -p "Premi Invio per chiudere..."
  exit 1
fi

echo "1/7 - Installazione dei componenti necessari..."
npm install

echo
echo "2/7 - Collegamento al tuo account Cloudflare..."
if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "Si aprira il browser: accedi a Cloudflare e autorizza Wrangler."
  npx wrangler login
fi
npx wrangler whoami

echo
echo "3/7 - Preparazione del database D1..."
DB_LIST="$(npx wrangler d1 list --json)"
DB_ID="$(printf '%s' "$DB_LIST" | node -e '
let raw="";
process.stdin.on("data", chunk => raw += chunk);
process.stdin.on("end", () => {
  const parsed = JSON.parse(raw);
  const rows = Array.isArray(parsed) ? parsed : (parsed.result || parsed.databases || []);
  const db = rows.find(item => item.name === "nac-amatori-db" || item.database_name === "nac-amatori-db");
  process.stdout.write(db ? String(db.uuid || db.id || db.database_id || "") : "");
});
')"

if [ -z "$DB_ID" ]; then
  npx wrangler d1 create "$DB_NAME" --location weur
  DB_LIST="$(npx wrangler d1 list --json)"
  DB_ID="$(printf '%s' "$DB_LIST" | node -e '
let raw="";
process.stdin.on("data", chunk => raw += chunk);
process.stdin.on("end", () => {
  const parsed = JSON.parse(raw);
  const rows = Array.isArray(parsed) ? parsed : (parsed.result || parsed.databases || []);
  const db = rows.find(item => item.name === "nac-amatori-db" || item.database_name === "nac-amatori-db");
  process.stdout.write(db ? String(db.uuid || db.id || db.database_id || "") : "");
});
')"
fi

if [ -z "$DB_ID" ]; then
  echo "Non sono riuscito a recuperare l'identificativo del database."
  exit 1
fi

DB_ID="$DB_ID" CONFIG_FILE="$CONFIG_FILE" node <<'NODE'
const fs = require("fs");
const path = process.env.CONFIG_FILE;
const config = JSON.parse(fs.readFileSync(path, "utf8"));
const database = config.d1_databases?.find(item => item.binding === "DB");
if (!database) throw new Error("Binding D1 DB non trovato in wrangler.jsonc");
database.database_id = process.env.DB_ID;
fs.writeFileSync(path, JSON.stringify(config, null, 2) + "\n");
NODE

echo
echo "4/7 - Preparazione dell'archivio immagini R2..."
if ! npx wrangler r2 bucket info "$R2_NAME" >/dev/null 2>&1; then
  npx wrangler r2 bucket create "$R2_NAME"
fi

echo
echo "5/7 - Creazione delle tabelle per giocatori, voti e presenze..."
npx wrangler d1 execute "$DB_NAME" --remote --file "$MIGRATION_FILE"

echo
echo "6/7 - Costruzione del sito..."
npm run build

echo
echo "7/7 - Pubblicazione del sito completo..."
npx wrangler deploy --config "$CONFIG_FILE"

echo
echo "===================================================="
echo "  PUBBLICAZIONE COMPLETATA"
echo "===================================================="
echo "Il link del sito e indicato qui sopra."
echo "Conserva questa cartella per i prossimi aggiornamenti."
echo
read -r -p "Premi Invio per chiudere..."
