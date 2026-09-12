# End-to-End-Tests

Eine User Journey durch daily-lens mit Cypress, gegen den kompletten Compose-Stack (Frontend, Backend, Postgres, Keycloak).

## Voraussetzungen

Docker, Node 24 und Google Chrome. Die Ports `80`, `8080` und `5432` müssen frei sein, d.h. es darf nichts anderes aus diesem Repo laufen:

- kein docker-compose-Stack im Root
- kein docker-compose-Stack in `infra/`
- keine lokalen Dev-Services (`npm run start:dev`, `npm start`)

## Ausführen

```bash
npm ci
npm run e2e
```

`npm run e2e` fährt den Stack hoch, wartet bis Keycloak sein Realm importiert hat, und startet Cypress headless in Chrome.

Danach `npm run stack:down` ausführen, um den Stack wieder zu stoppen.