# NAC Amatori - aggiornamento campionato 2026/27

Questa versione aggiunge il motore unico del Girone Eliminatorio 2 MSP Mantova.

- 132 partite del girone precaricate dal calendario ufficiale.
- 22 partite NAC filtrabili nella sezione Campionato.
- Classifica automatica: 3 punti vittoria, 1 pareggio, 0 sconfitta; ordinamento punti, differenza reti, gol fatti.
- Nuova scheda Campionato nell'Admin per inserire risultati o segnare una partita rinviata.
- Un risultato inserito dall'Admin aggiorna calendario e classifica nel sito pubblico.
- Le tre date con anno 2025 presenti nel PDF MSP sono conservate nel campo `source_date` e normalizzate al 2026 solo per l'ordinamento della stagione.

Per pubblicare: fare doppio clic su `PUBBLICA-SU-CLOUDFLARE.command` e seguire la procedura a schermo.

## Aggiornamento calendario ufficiale - 09/09/2026
Allineati gli orari casalinghi dell'ASD Amatori Gazoldo alle ore 15:30 secondo il calendario ufficiale MSP aggiornato. La partita ASD Amatori Gazoldo - NAC Amatori Castellana del 24/10/2026 passa quindi dalle 15:00 alle 15:30. La migrazione include UPDATE idempotenti per correggere anche un database D1 gia esistente.
