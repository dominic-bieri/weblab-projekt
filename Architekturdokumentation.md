# Architekturdokumentation — daily-lens

## 1. Einführung und Ziele

### 1.1 Qualitätsziele

### 1.2 Stakeholder

## 2. Randbedingungen

## 3. Kontextabgrenzung

### 3.1 Fachlicher Kontext

### 3.2 Technischer Kontext

## 4. Lösungsstrategie

## 5. Bausteinsicht

### 5.1 Whitebox Gesamtsystem (Level 1)

### 5.2 Whitebox wichtiger Bausteine (Level 2)

## 6. Laufzeitsicht

## 7. Verteilungssicht

## 8. Querschnittliche Konzepte

## 9. Architekturentscheidungen (ADRs)

### ADR 1: Frontend als Single Page Application (SPA)

Das Frontend wird als SPA (Angular) umgesetzt. Begründung: interaktive
Ansichten (Kalender, Galerie) ohne Full-Page-Reloads und klare Trennung von Frontend und Backend über eine REST-API.

### ADR 2: Backend als Monolith

Das Backend wird als ein einzelner NestJS-Dienst (Monolith) umgesetzt.
Begründung: Es ist eine kleine Applikation, und ein Monolith ist einfacher aufzusetzen und zu betreiben als mehrere Services.

### ADR 3: Signierte URLs für den Bild-Stream-Endpunkt

`<img ngSrc>` kann kein Bearer Token mitschicken, daher wird `GET /photo/:id` nicht per `JwtAuthGuard`, sondern per kurzlebiger HMAC-signierter URL abgesichert:
`GET /photo` liefert pro Foto eine `imageUrl` mit `exp`/`sig`-Query-Parametern (5 Min. gültig), die ein `SignedPhotoUrlGuard` validiert.
So funktioniert `<img ngSrc>` weiterhin nativ, ohne Blob-Fetch im Frontend.

### ADR 4: E2E-Test

Der Cypress-Test in `e2e/` läuft gegen den vollständigen `docker-compose`-Stack (Frontend, Backend, Postgres, Keycloak), nicht gegen `ng serve` mit gemocktem Backend.
Grund: Das Backend validiert Tokens live gegen den JWKS-Endpunkt des Realms, ein Mock würde genau diese Integration ungetestet lassen.
Vor allem Keycloak zu mocken hätte sich letztlich aufwändiger angefühlt als den ganzen Stack e2e zu testen.

Das Warten auf Stack-Bereitschaft steckt in `e2e/wait-for-stack.sh`, nicht in einem `docker-compose`-Healthcheck:
"Keycloak läuft" heisst nicht "Realm kann Login/Registrierung entgegennehmen".
Eine bessere Lösung dafür wurde auf die Schnelle nicht gefunden, das Skript pollt deshalb den Realm-Endpunkt, bis er antwortet.


Elemente, die im UI per E2E-Test geprüft werden, erhalten ein eigenes `data-testid`-Attribut statt über CSS-Klassen selektiert zu werden.
Das sollte die Tests robuster machen.

## 10. Qualitätsanforderungen

### 10.1 Qualitätsbaum

### 10.2 Qualitätsszenarien

## 11. Risiken und technische Schulden

## 12. Glossar