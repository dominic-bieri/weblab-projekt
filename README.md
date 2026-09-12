# daily-lens

## Ausführen

Im Repository-Root:

```bash
docker compose up --build
```

Danach `http://localhost/` öffnen und sich mit einem beliebigen Benutzernamen/Passwort registrieren.

## Dokumentation

- [Architekturdokumentation](./docs/Architekturdokumentation.md)
- [Arbeitsjournal](./docs/Arbeitsjournal.md)
- [Fazit / Reflexion](./docs/Fazit_Reflexion.md)
- ([Projektvorschlag](./docs/Projektvorschlag.md))

## CI

Bei Push/PR auf `main` laufen je nach geänderten Pfaden die Workflows in [.github/workflows](./.github/workflows):

- **Frontend-CI** (`frontend/**`): Format-Check, Linting, Build, Unit-Tests.
- **Backend-CI** (`backend/**`): Format-Check, Linting, Build, Unit- und E2E-Tests.
- **E2E-CI** (`frontend/**`, `backend/**`, `e2e/**`, `docker-compose.yml`): Cypress-Tests gegen den vollen Docker-Compose-Stack ([e2e/README.md](./e2e/README.md)).

## Lokale Entwicklung

Siehe [Entwicklung.md](./Entwicklung.md).

## End-to-End-Tests

Siehe [e2e/README.md](./e2e/README.md).
