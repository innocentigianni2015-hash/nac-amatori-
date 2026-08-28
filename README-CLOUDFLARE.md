# NAC Amatori Castellana — pacchetto Cloudflare

Questo progetto contiene il sito completo, l’area Admin, il database dei giocatori, voti, messaggi, agenda, presenze e il caricamento delle fotografie.

## Importante

Non trascinare questo ZIP nella funzione **Pages > Drag and drop**: quella procedura pubblica soltanto file statici e non configura automaticamente il database D1, l’archivio immagini R2 e la protezione dell’Admin.

Il progetto deve essere pubblicato come **Cloudflare Worker full-stack** con Wrangler oppure tramite un repository Git collegato a Workers Builds.

## Risorse da creare su Cloudflare

1. Crea un database D1 chiamato `nac-amatori-db`.
2. Copia il suo `database_id` nel file `wrangler.jsonc`, sostituendo `00000000-0000-4000-8000-000000000000`.
3. Crea un bucket R2 chiamato `nac-amatori-media`.
4. Proteggi con Cloudflare Access i percorsi `/admin*` e `/api/admin*`, consentendo soltanto la tua email.

## Pubblicazione da terminale

### Metodo guidato per Mac (consigliato)

1. Estrai lo ZIP sul Mac.
2. Apri la cartella `nac-amatori`.
3. Fai doppio clic su `PUBBLICA-SU-CLOUDFLARE.command`.
4. Quando si apre il browser, accedi a Cloudflare e autorizza Wrangler.

Il comando crea o collega automaticamente il database D1, prepara l'archivio R2, applica le tabelle e pubblica il sito completo.

Se macOS impedisce l'apertura, fai clic destro sul file, scegli **Apri** e conferma.

### Metodo manuale

```bash
npm install
npx wrangler login
npx wrangler d1 create nac-amatori-db --location weur
npx wrangler r2 bucket create nac-amatori-media
# Copia l'identificativo D1 ottenuto nel campo database_id di wrangler.jsonc
npm run cloudflare:db
npm run cloudflare:deploy
```

Al primo ingresso in `/admin`, l’email autenticata da Cloudflare Access viene registrata come amministratore principale.

## Pubblicazione tramite Git

Carica l’intera cartella in un repository GitHub o GitLab e collegalo da **Cloudflare > Workers & Pages > Create > Import a repository**.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy --config wrangler.jsonc`
- Node.js: versione 22 o successiva

Prima del primo deploy applica la migrazione `drizzle/0000_chief_tinkerer.sql` al database D1.

## Documentazione ufficiale

- Workers e Vite: https://developers.cloudflare.com/workers/vite-plugin/get-started/
- D1: https://developers.cloudflare.com/d1/
- R2: https://developers.cloudflare.com/r2/
- Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/applications/
