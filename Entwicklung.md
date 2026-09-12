# Lokale Entwicklung

## Infrastruktur (Postgres + Keycloak)

```bash
cd infra
docker compose up
```

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

## Frontend

```bash
cd frontend
npm install
npm start
```

Öffnen: `http://localhost:4200/`. Der Angular-Dev-Server leitet `/api/*`-Anfragen an das Backend auf Port `3000` weiter (siehe `frontend/config/proxy.conf.json`).

## End-to-End-Tests

Siehe [e2e/README.md](./e2e/README.md).
