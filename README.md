# weblab-projekt

## Containerisiertes Setup (Prod-Bundle)

Im Repository-Root ausführen:

```bash
docker compose up --build
```

Damit werden Postgres, Keycloak (inkl. automatischem Import des `daily-lens`-Realms), das NestJS-Backend und das Angular-Frontend (ausgeliefert über Nginx, das auch `/api/*` an das Backend weiterleitet) gestartet.

Öffnen: `http://localhost/`.

## End-to-End-Tests

Details in [`e2e/README.md`](e2e/README.md).

## Lokale Entwicklung

Die Dev-Infrastruktur (Postgres + Keycloak) aus `infra/` starten:

```bash
cd infra
docker compose up
```

Danach Backend und Frontend jeweils in einem eigenen Terminal starten:

```bash
cd backend
npm install
npm run start:dev
```

```bash
cd frontend
npm install
npm start
```

Öffnen: `http://localhost:4200/`. Der Angular-Dev-Server leitet `/api/*`-Anfragen an das Backend auf Port `3000` weiter (siehe `frontend/config/proxy.conf.json`).
