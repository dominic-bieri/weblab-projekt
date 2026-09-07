# Arbeitsjournal

Projekt: **daily-lens** - Weblab Projektarbeit
Autor: Dominic Bieri
Ziel: ca. 60 h

Pro Eintrag: **Datum - Stunden - Tätigkeit(en)**. Stunden dezimal (z. B. 1.5).

---

## 2026-09-02 - 5.0 h

- Projektsetup Angular (inkl. Angular Material) und NestJS-Backend im Monorepo
- Routing für Angular aufgesetzt
- CI-Pipeline (GitHub Actions) eingerichtet
- Doku-Grundgerüst: Arbeitsjournal, arc42, Fazit/Reflexion

---

## 2026-09-03 - 7.0 h

- Fileupload-Formular im Frontend
- Anzeige der hochgeladenen Fotos im Frontend
- Backend CRUD von Bildern (Persistenz in PostgreSQL)
- i18n mit ngx-translate hinzugefügt

---

## 2026-09-04 - 7.0 h

- Keycloak-Integration im Frontend (Login/Logout, Auth-Guard, Bearer-Token-Interceptor)
- Backend JWT-Auth mit Passport für die Photo-Endpunkte, Fotos pro User getrennt
- Bildanzeige per signierten URLs gelöst (Auth-Problem bei `<img>`-Tags, ADR 3)

---

## 2026-09-05 - 4.5 h

- Setup lokales docker compose Deployment inkl. nginx config und Path Redirect
- Erster e2e Test mit Abhängigkeit zum kompletten Stack (Frontend, Backend, Keycloak, Postgres)
    - User registrieren
    - Foto hochladen
    - hochgeladenes Foto wird angezeigt
    - Logout

---

## 2026-09-06 - 7.0 h

- Foto löschen & bearbeiten im Frontend
- Kalender-/Zeitleisten-Ansicht
- Datum Funktionen vereinheitlicht (korrektes Format für EN <-> DE, Formatierung, usw)
- Backend: CRUD für Challenge
- Frontend: Challenge erstellen / löschen

---

## 2026-09-07 - 4.5 h

- Foto einer Challenge zuordnen (Backend + Frontend, Auswahl bei Upload und Bearbeitung)
- Challenge bearbeiten im Frontend
- Challenge-Zugehörigkeit in der Picture-Card anzeigen
- Challenge-Detailansicht inkl. Anzeige der zugehörigen Fotos

---