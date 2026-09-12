# Architekturdokumentation - daily-lens

Architekturdokumentation nach [arc42](https://arc42.de/overview/)

## 1. Einführung und Ziele

daily-lens ist eine Webapplikation, die User dazu anregt, täglich ein Foto hochzuladen und sich zeitlich begrenzen Challenges zu widmen.
Zusätzlich existiert eine Kalenderansicht mit Streak-Funktion, damit die persönliche Routine besser sichtbar zu machen und zum Weitermachen motiviert.

Genaue Anforderungen stehen im [`Projektvorschlag.md`](./Projektvorschlag.md).
Die Modulvorgaben dazu stehen im Repository [web-programming-lab-projekt](https://github.com/web-programming-lab/web-programming-lab-projekt) (Stand 31. August 2026).

## 2. Randbedingungen

| Art | Randbedingung |
|---|---|
| Organisatorisch | Einzelarbeit, Zeitbudget ca. 60 Stunden (siehe [Arbeitsjournal.md](./Arbeitsjournal.md)) |
| Organisatorisch | Abgabe als GitHub-Repository (Modulvorgabe) |
| Technisch | CRUD auf mind. einer selbstdefinierten Ressource, Daten persistent in einer DB, mind. zwei unterschiedliche Darstellungsformen der Daten (Modulvorgabe) |
| Technisch | Responsive für Mobile/Tablet/Desktop (Modulvorgabe) |
| Technisch | Automatisierte Unit-/Integrations-/E2E-Tests (Modulvorgabe) |
| Technisch | Lighthouse-Score >= 90, Mobile & Desktop (Modulvorgabe) |
| Technisch | Prod-Bundle reproduzierbar startbar, hier via `docker compose up` (Modulvorgabe) |
| Konvention | Formatierung und Linting über Prettier und oxlint, in der CI erzwungen |

## 3. Kontextabgrenzung

Dieses Kapitel grenzt daily-lens fachlich und technisch von seiner Umgebung ab.

### 3.1 Fachlicher Kontext

Es gibt nur einen Akteur: der User im Browser.
Keine Anbindung an Drittsysteme.

```mermaid
graph LR
       U((User)) -- "registriert sich, lädt Fotos hoch,<br/>erstellt Challenges, betrachtet Kalender/Galerie" --> S[daily-lens]
```

### 3.2 Technischer Kontext

```mermaid
graph LR
    Browser["Browser<br/>(Angular SPA)"]
    Nginx["nginx<br/>(statisches Bundle + Reverse Proxy)"]
    Backend["NestJS Backend<br/>(REST-API)"]
    Keycloak[("Keycloak<br/>(Identity Provider)")]
    DB[("PostgreSQL")]
    Files[["Docker-Volume<br/>(Foto-Dateien)"]]

    Browser -- "HTTPS, statische Assets" --> Nginx
    Browser -- "HTTPS/JSON, Bearer-Token (/api/*)" --> Nginx
    Nginx -- "proxy_pass" --> Backend
    Browser -- "OIDC Redirect (Login/Registrierung)" --> Keycloak
    Backend -- "JWKS: Token-Signatur prüfen" --> Keycloak
    Backend -- "SQL (TypeORM)" --> DB
    Backend -- "read/write Bilddateien" --> Files
```

| Schnittstelle | Protokoll/Format | Zweck |
|---|---|---|
| Browser <> nginx | HTTPS, statische Dateien | Ausliefern des Angular-Bundles |
| Browser <> Backend (via nginx `/api/*`) | REST/JSON über HTTPS, Bearer-Token | Fachliche Operationen (Fotos, Challenges, Streak) |
| Browser <> Keycloak | OIDC (Authorization Code Flow) | Login, Registrierung, Token-Erneuerung |
| Backend <> Keycloak | HTTPS (JWKS-Endpunkt) | Verifikation der JWT-Signatur |
| Backend <> PostgreSQL | SQL | Persistenz der Metadaten zu Fotos und Challenges |
| Backend <> Volume | Dateisystem | Ablage der konvertierten Foto-Dateien (`<id>.webp`) |

## 4. Lösungsstrategie

Dieses Kapitel begründet die wichtigsten technischen Grundsatzentscheidungen für Frontend und Backend.

### 4.1 Technische Entscheidungen

- **Frontend**: Angular
    - Begründung: Im Kurs am meisten Fokus & Wissen kann bei der Arbeit auch eingesetzt werden
    - Erfüllt Anforderung an JavaScript SPA
- **Backend**: NestJS
    - Begründung: TypeScript, Dependency Injection, Decorator Style (ähnlich wie Java Backends welche ich sonst schreibe)
    - Erfüllt Anforderung an JavaScript Backend
- **DB**: PostgreSQL
    - Begründung: einfach mit Docker
- **Authentifizierung**: Keycloak
    - Begründung: kann selbst gehostet werden
- **Testing Frameworks**: Unit/Integration: Vitest, E2E: Cypress
    - Begründung: Vitest: defacto Standard & ESM. Cypress: Im Kurs am meisten Fokus

### 4.2 Frontend Architektur

Das Frontend wird als SPA (Angular) umgesetzt.
Begründung: interaktive Ansichten (Kalender, Galerie) ohne Full-Page-Reloads und klare Trennung von Frontend und Backend über eine REST-API.

### 4.3 Backend Architektur

Das Backend wird als ein einzelner Monolith (NestJS) umgesetzt.
Begründung: Es ist eine kleine Applikation, und ein Monolith ist einfacher aufzusetzen und zu betreiben als mehrere Services.

### Struktur

**Frontend**
- nach Features
- strikte unterteilung in `smart_container` und `dumb_components`

**Backend**
- nach Features

## 5. Bausteinsicht

Dieses Kapitel zeigt die Bausteine des Systems auf Gesamtsystem- und Modulebene.

### 5.1 Whitebox Gesamtsystem (Level 1)

```mermaid
graph TB
    subgraph Client
        FE["Frontend<br/>Angular SPA (nginx-Container)"]
    end
    subgraph Server
        BE["Backend<br/>NestJS REST-API"]
        DB[("PostgreSQL")]
        KC[("Keycloak")]
        VOL[["Volume: uploads"]]
    end
    FE -->|REST/JSON, Bearer-Token| BE
    FE -->|OIDC| KC
    BE -->|TypeORM| DB
    BE -->|JWKS-Verifikation| KC
    BE -->|Dateizugriff| VOL
```

| Baustein | Verantwortung |
|---|---|
| Frontend (Angular) | Darstellung (Kalender, Galerie, Formulare), Routing/Guards, Login-Redirect zu Keycloak, i18n |
| Backend (NestJS) | REST-API, Validierung, Businesslogik (Streak-Berechnung, Bildkonvertierung), Autorisierung pro Ressource |
| PostgreSQL | Persistenz der Metadaten zu Fotos und Challenges |
| Keycloak | Identity Provider: Login, Registrierung, Token-Ausstellung/-Verifikation |
| Volume `uploads` | Persistenz der konvertierten Bilddateien |

### 5.2 Whitebox wichtiger Bausteine (Level 2)

**Backend**: ein Modul pro fachlicher Domäne (Controller -> Service -> Entity/DTO)

```mermaid
graph TB
    Auth[AuthModule] -.sichert.-> Photo[PhotoModule]
    Auth -.sichert.-> Challenge[ChallengeModule]
    Auth -.sichert.-> Streak[StreakModule]
    Photo --> Challenge
    Streak --> Photo
```

| Modul | Verantwortung |
|---|---|
| PhotoModule | Upload inkl. WebP-Konvertierung, CRUD, signierte Streaming-URLs |
| ChallengeModule | CRUD von Challenges |
| StreakModule | Streak-Berechnung aus den Aufnahmedaten der Fotos |
| AuthModule | JWT-Verifikation gegen Keycloak-JWKS, schützt die übrigen Module |

**Frontend**: je Feature ein Ordner, intern getrennt in `smart_container` (State, ruft `*.api.ts` auf) und `dumb_components` (reine Präsentation, kein HTTP)

```mermaid
graph TB
    Nav["components/navigation<br/>(enthält language-switcher)"]
    config["config<br/>(routes, DI-Setup, auth.guard)"]
    subgraph features
        login[login]
        home[home]
        calendar[calendar]
        challenge[challenge]
    end
    core["core/auth<br/>(Wrapper um keycloak-js)"]
    i18n["core/i18n<br/>(aktive Sprache)"]
    shared["shared<br/>(local-date, challenge-progress.util, ...)"]

    Nav -- "router-outlet" --> features
    config -- "definiert Routen für" --> features
    login --> core
    home --> core
    calendar --> core
    challenge --> core
    home --> shared
    calendar --> shared
    challenge --> shared
    Nav --> i18n
    home --> i18n
    calendar --> i18n
    challenge --> i18n
```

| Baustein | Verantwortung |
|---|---|
| login | Login-/Registrierungs-Einstiegsseite, stösst Redirect zu Keycloak an |
| home | Foto-Upload, Foto-Liste, Streak-Anzeige |
| calendar | Kalender-/Zeitleisten-Ansicht der eigenen Fotos |
| challenge | CRUD von Challenges, Detail-/Galerie-Ansicht je Challenge |
| components | App-weite UI-Bausteine: `navigation` (Shell um `router-outlet`, Menü) und `language-switcher`|
| config | Routing & App Konfigurationen |
| core/auth | Login/Logout, Bearer-Token-Interceptor, Route-Guard |
| core/i18n | Hält die aktive Sprache zentral, von `language-switcher` und den Feature-Komponenten für Datums-/Textformatierung verwendet |
| shared | domänenübergreifende Utilities (Datum, Challenge-Fortschritt) und Dialoge |

## 6. Laufzeitsicht

Dieses Kapitel zeigt bewusst nur die wichtigsten Abläufe als Sequenzdiagramme.
Andere Abläufe wie das Erstellen von Challenges oder das Bearbeiten von Fotos sind hier bewusst nicht dargestellt, da sie keine zusätzlichen architektonischen Erkenntnisse liefern.

### Login/Registrierung (OIDC)

```mermaid
sequenceDiagram
    actor N as User
    participant FE as Angular SPA
    participant KC as Keycloak
    participant BE as Backend

    N->>FE: öffnet /login, klickt "Login"
    FE->>KC: redirect (Authorization Code Flow)
    N->>KC: Login/Registrierung
    KC-->>FE: redirect mit Code
    FE->>KC: Code gegen Access-/Refresh-Token tauschen
    N->>FE: navigiert zu /home
    FE->>BE: GET /photo (Authorization: Bearer <token>)
    BE->>KC: JWKS abrufen (gecacht) & Signatur/Issuer prüfen
    BE-->>FE: 200 OK, Foto-Liste
```

### Foto hochladen

```mermaid
sequenceDiagram
    actor N as User
    participant FE as Angular SPA
    participant BE as PhotoController
    participant DB as PostgreSQL
    participant FS as Volume

    N->>FE: wählt Bild, Datum, Beschreibung, optional Challenge
    FE->>BE: POST /photo/upload (multipart, Bearer-Token)
    BE->>BE: JwtAuthGuard prüft Token, Validierung (Grösse, Magic Number)
    BE->>BE: Bild konvertieren (Resize ≤2048px, WebP q80)
    BE->>FS: schreibt <uuid>.webp
    BE->>DB: INSERT Photo (userId, captureDate, ...)
    BE-->>FE: 201 Created
```

### Foto anzeigen (signierte URL, ADR 1)

```mermaid
sequenceDiagram
    participant FE as Angular SPA
    participant BE as PhotoController
    participant Signer as PhotoUrlSigner
    participant FS as Volume

    FE->>BE: GET /photo (Bearer-Token)
    BE->>Signer: signierte, zeitlich begrenzte Bild-URL je Foto erzeugen
    Signer-->>BE: signierte URL (15 Min. gültig)
    BE-->>FE: Liste inkl. signierter Bild-URL
    FE->>FE: <img ngSrc="signierte URL">
    FE->>BE: GET Bild über signierte URL (kein Bearer-Token nötig)
    BE->>BE: SignedPhotoUrlGuard verifiziert die Signatur
    BE->>FS: liest <id>.webp
    BE-->>FE: 200, Cache-Control: private, max-age=900, immutable
```

## 7. Verteilungssicht

```mermaid
graph TB
    subgraph "Docker Host (docker compose up)"
        FE["Container: frontend<br/>(nginx, Port 80)"]
        BE["Container: backend<br/>(NestJS, Port 3000)"]
        DB[("Container: postgres")]
        KC[("Container: keycloak<br/>(Port 8080)")]
        VOL_DB[(Volume postgres_data)]
        VOL_KC[(Volume keycloak_data)]
        VOL_UP[(Volume backend_uploads)]
    end
    Browser((Browser)) --> FE
    Browser --> KC
    FE -- "proxy_pass /api" --> BE
    BE --> DB
    BE -- JWKS --> KC
    DB --- VOL_DB
    KC --- VOL_KC
    BE --- VOL_UP
```

- `docker compose up --build` im Repo-Root startet alle vier Container. Keycloak importiert den `daily-lens`-Realm automatisch beim Start
- Nur `frontend` (Port 80) und `keycloak` (Port 8080) sind nach aussen exponiert. `backend` ist nur intern erreichbar und wird über den nginx-Reverse-Proxy angesprochen
- Drei benannte Volumes für DB-Daten, Keycloak-Daten und hochgeladene Fotos überleben Container-Neustarts
- Für die Entwicklung startet `infra/docker-compose.yaml` nur Postgres + Keycloak. Frontend (`npm run start`) und Backend (`npm run start:dev`) laufen dann lokal mit Hot-Reload

## 8. Querschnittliche Konzepte

Dieses Kapitel beschreibt Konzepte, die mehrere Bausteine gleichermassen betreffen.

### Authentifizierung & Autorisierung

Keycloak ist der einzige Identity Provider (OIDC).
Das Backend hat keinen eigenen Session-Store: `JwtStrategy` prüft jedes Bearer-Token direkt gegen den JWKS-Endpunkt von Keycloak.
Jede Ressource (Photo, Challenge) hat eine `userId`-Spalte.
Bei jedem Zugriff wird zusätzlich geprüft, ob die Ressource dem anfragenden User gehört (`assertOwnership()` bzw. `WHERE userId = ...`).
Bei fremden Ressourcen kommt ein 404 statt 403 zurück, damit man von aussen nicht sieht, ob die Ressource überhaupt existiert.

### Validierung

DTOs (`PhotoDto`, `ChallengeDto`) werden mit `class-validator`/`class-transformer` deklarativ validiert (Datumsformat, Pflichtfelder, UUID).
Die Angular-Formulare spiegeln dieselben Regeln clientseitig.
Feldübergreifende Regeln (z. B. `endDate >= startDate`) werden im Service geprüft.

### Bild-Pipeline

Hochgeladene Bilder werden einmalig mit `sharp` normalisiert (max. 2048 px, WebP q80) und unter ihrer `id` abgelegt (ADR 4).
Weil sich der Inhalt einer `id` danach nie mehr ändert, kann `GET /photo/:id` lange gecacht werden: `Cache-Control: private, max-age=900, immutable`.

- `private`, weil die Bilder personenbezogen sind und nicht über Proxies/CDNs gecacht werden sollen
- `immutable`, damit der Browser bei einem Reload nicht nochmal nachfragt
- `max-age=900` (15 Min.), genau so lange wie die signierte URL gültig ist

Damit das Caching über mehrere Loads hinweg wirklich greift, muss die URL selbst stabil bleiben.
Dazu mehr im nächsten Abschnitt.

### Signierte Bild-URLs

Der Browser lädt ein `<img>` über eine eigene, native GET-Anfrage, an die sich keine eigenen Header wie `Authorization` anhängen lassen.
`<img ngSrc>` kann also kein Bearer-Token mitschicken, deshalb ist `GET /photo/:id` nicht per `JwtAuthGuard` geschützt, sondern über eine signierte URL:

- `GET /photo` liefert pro Foto eine URL mit `exp`- und `sig`-Parameter, `sig` ist ein HMAC-SHA256 über `photoId + exp`
- `SignedPhotoUrlGuard` prüft beim Abruf, ob `exp` noch in der Zukunft liegt und `sig` stimmt
- `exp` wird nicht auf "jetzt + 5 Min." gesetzt, sondern auf ein 15-Minuten-Raster gerundet, damit `sign()` für dieselbe `photoId` innerhalb desselben Fensters immer dieselbe URL liefert. Sonst würde der Cache-Header oben nichts bringen, weil bei jedem Request eine andere Signatur in der URL stünde

So funktioniert `<img ngSrc>` weiterhin nativ, ohne dass das Frontend die Bilder selbst per Fetch laden und als Blob einbinden muss.

Das Muster ist unter "signed URL" bzw. "presigned URL" bekannt, siehe z. B.[Bytescale Signed URL](https://www.bytescale.com/docs/secure-urls/signed-urls) oder [Google Signed URLs](https://docs.cloud.google.com/storage/docs/access-control/signed-urls).

### Internationalisierung

`ngx-translate` mit DE/EN-JSON-Dateien, umschaltbar über den `language-switcher`.
Datumswerte laufen über eine zentrale Utility (`shared/local-date.ts`), um DE/EN-Formatunterschiede an einer Stelle zu behandeln.

### Testkonzept

| Ebene | Werkzeug | Umfang |
|---|---|---|
| Unit | Vitest (Backend), Angular/Vitest (Frontend) | `streak.util`, `photo-url.signer`, `assert-ownership`, `challenge-progress.util`, Komponenten-Specs |
| Integration | Vitest gegen echtes NestJS-Modul (`*.e2e-spec.ts`) | Photo-CRUD, Photo-Upload, Challenge, Streak, mit `FakeAuthGuard` statt echtem Keycloak |
| End-to-End | Cypress gegen vollen `docker-compose`-Stack (ADR 2) | Kompletter User-Flow: Registrieren → Foto hochladen → Anzeige → Logout |

Jedes Teilprojekt (`backend`, `frontend`, `e2e`) hat eine eigene GitHub-Actions-Pipeline (Format-Check, Lint, Build, Tests).
UI-Elemente, die im E2E-Test geprüft werden, bekommen ein eigenes `data-testid` statt über CSS-Klassen selektiert zu werden (ADR 2).

## 9. Architekturentscheidungen (ADRs)

Die folgenden ADRs dokumentieren wichtige Architekturentscheidungen samt Begründung.

### ADR 1: Signierte URLs für den Bild-Stream-Endpunkt

`<img ngSrc>` kann kein Bearer-Token mitschicken, daher wird `GET /photo/:id` nicht per `JwtAuthGuard`, sondern per kurzlebiger HMAC-signierter URL abgesichert.
Der Mechanismus ist in Kapitel 8 unter [Signierte Bild-URLs](#signierte-bild-urls) beschrieben.

### ADR 2: E2E-Test

Der Cypress-Test in `e2e/` läuft gegen den vollständigen `docker-compose`-Stack (Frontend, Backend, Postgres, Keycloak), nicht gegen `ng serve` mit gemocktem Backend.
Grund: Das Backend validiert Tokens live gegen den JWKS-Endpunkt des Realms, ein Mock würde genau diese Integration ungetestet lassen.
Vor allem Keycloak zu mocken hätte sich letztlich aufwändiger angefühlt als den ganzen Stack e2e zu testen.

Das Warten auf Stack-Bereitschaft steckt in `e2e/wait-for-stack.sh`, nicht in einem `docker-compose`-Healthcheck:
"Keycloak läuft" heisst nicht "Realm kann Login/Registrierung entgegennehmen".
Eine bessere Lösung dafür wurde auf die Schnelle nicht gefunden, das Skript pollt deshalb den Realm-Endpunkt, bis er antwortet.


Elemente, die im UI per E2E-Test geprüft werden, erhalten ein eigenes `data-testid`-Attribut statt über CSS-Klassen selektiert zu werden.
Das sollte die Tests robuster machen.

### ADR 3: Keycloak-spezifische Library statt generischem OAuth2/OIDC-Client

Im Frontend wird für Login/Auth `keycloak-angular`/`keycloak-js` eingesetzt statt einer generischen, Provider-unabhängigen Library wie `angular-oauth2-oidc`.
Begründung: Es handelt sich um ein kleines Schulprojekt, daher ist eine feste Abhängigkeit an Keycloak als IdP kein relevantes Risiko.
Im Gegenzug nimmt die Keycloak-spezifische Library viel Arbeit ab: Token-Refresh, Bearer-Interceptor und Route-Guard sind fertig integriert und müssen nicht selbst gebaut werden, was Login/Auth im Vergleich zu einer generischen OIDC-Library einfacher macht.

### ADR 4: WebP-Konvertierung beim Upload & Caching der Bilder

Kamera-Uploads sind oft mehrere MB gross und ziehen Ladezeit und Lighthouse-Score runter.
Deshalb werden Bilder beim Upload einmalig mit `sharp` konvertiert: auf max. 2048 px begrenzt, als WebP (Quality 80).
Pro Foto liegt danach nur noch eine `<id>.webp` auf der Disk, die zusätzlich über einen langlebigen `Cache-Control`-Header ausgeliefert wird.
Details dazu in Kapitel 8 unter [Bild-Pipeline](#bild-pipeline).

## 10. Qualitätsanforderungen

Dieses Kapitel beschreibt die Qualitätsziele und wie sie überprüft wurden.

### 10.1 Qualitätsanforderungen im Überblick

| Qualitätsziel | Konkretisierung |
|---|---|
| Performance | Lighthouse-Score >= 90 (Mobile & Desktop). WebP-Kompression und Cache-Header für Fotos |
| Benutzbarkeit | Responsive für Mobile/Tablet/Desktop |
| Sicherheit | Zugriff nur mit gültigem Token. Fotos/Challenges strikt pro Account isoliert |
| Zuverlässigkeit | Unit-, Integrations- und E2E-Tests laufen automatisiert in der CI |
| Übertragbarkeit | `docker compose up` startet den kompletten Stack reproduzierbar |

### 10.2 Qualitätsszenarien

| # | Szenario | Antwortmass |
|---|---|---|
| 1 | User öffnet die App auf dem Handy | Lighthouse-Score >= 90 im Schnitt aller Kategorien, Mobile & Desktop |
| 2 | Jemand ruft `GET /photo/:id` eines fremden Fotos ohne gültige Signatur auf | `SignedPhotoUrlGuard` lehnt ab, keine Bilddaten werden ausgeliefert |
| 3 | Jemand versucht, eine fremde Challenge per `PUT /challenge/:id` zu ändern | `assertOwnership()` liefert 404, keine Änderung in der DB |
| 4 | Ein Refactoring führt versehentlich einen Bug in der Streak-Berechnung ein | `streak.util.spec.ts` schlägt in der CI fehl, der PR kann nicht gemerged werden |
| 5 | Bewertende:r klont das Repo frisch und führt `docker compose up --build` aus | Kompletter Stack (DB, Keycloak inkl. Realm, Backend, Frontend) läuft ohne weitere Handgriffe unter `http://localhost/` |
| 6 | Dasselbe Foto wird in derselben Session zweimal geladen (Navigation zurück/vor) | Bild kommt aus dem Browser-Cache statt vom Server (stabile signierte URL, `Cache-Control: immutable`) |

### 10.3 Lighthouse-Ergebnisse

Gemessen wurde manuell (Chrome DevTools Lighthouse) pro Route, jeweils für Mobile und Desktop, gegen den per `docker compose up --build` gestarteten Stack.
Damit nicht nur der leere Zustand gemessen wird, wurden vorher ca. 10 Fotos (je ca. 20 MB, unkonvertiert direkt ab Kamera) hochgeladen. Das entspricht eher der späteren Praxisnutzung als eine leere Galerie oder Kalenderansicht.
Gemessen wurde in einem Inkognito-Tab, sonst waren keine weiteren Chrome-Tabs geöffnet. Das verhindert, dass Erweiterungen oder Hintergrundaktivität aus anderen Tabs den Score verfälschen.
Die Screenshots liegen unter [`docs/lighthouse/`](./docs/lighthouse).

| Route | Mobile | Desktop |
|---|---|---|
| `/login` | ![Lighthouse login mobile](./docs/lighthouse/login-mobile.png) | ![Lighthouse login desktop](./docs/lighthouse/login-desktop.png) |
| `/home` | ![Lighthouse home mobile](./docs/lighthouse/home-mobile.png) | ![Lighthouse home desktop](./docs/lighthouse/home-desktop.png) |
| `/calendar` | ![Lighthouse calendar mobile](./docs/lighthouse/calendar-mobile.png) | ![Lighthouse calendar desktop](./docs/lighthouse/calendar-desktop.png) |
| `/challenge` | ![Lighthouse challenge mobile](./docs/lighthouse/challenge-mobile.png) | ![Lighthouse challenge desktop](./docs/lighthouse/challenge-desktop.png) |
| `/challenge/:id` | ![Lighthouse challenge-detail mobile](./docs/lighthouse/challenge-detail-mobile.png) | ![Lighthouse challenge-detail desktop](./docs/lighthouse/challenge-detail-desktop.png) |

## 11. Risiken und technische Schulden

Dieses Kapitel listet bekannte Risiken und bewusst in Kauf genommene technische Schulden auf.

### Risiko 1: Fehlende Pagination bei wachsender Fotoanzahl

Galerie- und Kalenderansicht laden aktuell alle Fotos eines Users ohne Pagination/Lazy-Loading. Mit steigender Fotoanzahl steigt die Ladezeit dieser Ansichten, was den geforderten Lighthouse-Score (>= 90, siehe Kap. 2/10) gefährden kann.
Aktuell ist das Risiko gering: Jeder User sieht nur seine eigenen Fotos, die Menge ist also durch die eigene Nutzung begrenzt. Problematischer würde es, sobald weitere User hinzukommen und z. B. eine Funktion umgesetzt wird, mit der man anderen Usern folgen und deren Fotos sehen kann — dann ist die Fotoanzahl pro Ansicht nicht mehr durch die eigene Nutzung begrenzt und kann deutlich schneller wachsen.

Begründung: Auf Pagination wurde für den aktuellen Funktionsumfang (nur eigene Fotos, Einzelnutzer-fokussiert) bewusst verzichtet, da der Aufwand dafür im aktuellen Rahmen nicht gerechtfertigt war.

Massnahme: Pagination/Lazy-Loading einführen, spätestens sobald Mehrbenutzer-Funktionen wie das Folgen anderer User und deren Fotos umgesetzt werden.

### Technische Schuld 1: Secrets ohne Rotation

`PHOTO_URL_SIGNING_SECRET` (siehe [Signierte Bild-URLs](#signierte-bild-urls)) liegt als Klartext in `.env`.
Bei einem Leak der `.env` (z. B. falsch konfiguriertes Volume/Backup) lassen sich damit beliebige signierte Bild-URLs fälschen, bis das Secret manuell ersetzt wird.

Begründung: Für ein Schulprojekt mit einmaligem Deployment zur Bewertung (kein produktiver Betrieb mit echten Userdaten über längere Zeit) steht der Aufwand für ein eigenes Secret-Management im Verhältnis zum Zeitbudget von ca. 60 Stunden (siehe Kap. 2) nicht im Verhältnis zum Nutzen.

Massnahme: Für einen produktiven Betrieb Secrets über ein Secret-Management statt `.env` einspielen und eine Rotation der Signing-Secrets vorsehen.

### Technische Schuld 2: Polling statt Healthcheck für Keycloak-Realm

`e2e/wait-for-stack.sh` (ADR 2) pollt den Realm-Endpunkt per Curl-Loop (60 × 1 s), weil ein reiner Container-Healthcheck nur "Keycloak läuft" prüft, nicht ob der Realm-Import abgeschlossen ist.
Das Polling ist ein Workaround: Bei einem langsamen CI-Runner kann das fixe 60-Sekunden-Timeout knapp werden und den E2E-Lauf ohne fachlichen Grund fehlschlagen lassen.

Begründung: Ein sauberer Healthcheck, der den Keycloak-Realm-Import mit abbildet, wurde in der verfügbaren Zeit nicht gefunden (siehe ADR 2).
Das Polling-Skript war die pragmatischere Lösung, um die E2E-Pipeline überhaupt lauffähig zu bekommen.

Massnahme: Prüfen, ob Keycloak einen Health-Endpunkt bietet, der den Realm-Import mit abbildet, oder Timeout/Backoff des Skripts konfigurierbar machen.

### Technische Schuld 3: Keine DB-Migrations

`TypeOrmModule.forRoot` läuft mit `synchronize: true` (`app.module.ts`).
TypeORM generiert das Schema direkt aus den Entities, es existieren keine Migrations-Dateien.
Schemaänderungen sind damit nicht versioniert und nicht reproduzierbar über Umgebungen hinweg.
Bei `synchronize: true` besteht in Produktion zudem das Risiko von Datenverlust bei automatischen Schema-Anpassungen (z. B. Spalten-Drop bei Entity-Umbenennung).

Begründung: Während der Entwicklung hat sich das Entity-Schema noch häufig geändert.
`synchronize: true` erspart es, für jede Änderung von Hand eine Migration zu schreiben, und war für den Entwicklungsstand bislang bequemer (im Code als TODO vermerkt).

Massnahme: Vor einem produktiven Einsatz auf TypeORM-Migrations umstellen und `synchronize` deaktivieren.

## 12. Glossar

| Begriff | Beschreibung |
|---|---|
| `assertOwnership()` | Backend-Prüfung, ob eine angefragte Ressource (Photo/Challenge) dem authentifizierten User gehört. |
| Bearer-Token | Access-Token im HTTP-Header `Authorization: Bearer <token>`. Authentifiziert den User gegenüber dem Backend |
| Challenge | Vom User erstellte, zeitlich begrenzte Foto-Aufgabe, Fotos können ihr zugeordnet werden |
| dumb_component | Frontend-Komponente ohne eigenen State/HTTP-Zugriff, rein präsentativ, Daten via Input/Output |
| HMAC | Hash-based Message Authentication Code. Signaturverfahren aus Daten + geheimem Schlüssel, Basis der signierten Bild-URLs |
| JWKS | JSON Web Key Set. Endpunkt von Keycloak mit öffentlichen Schlüsseln zur Prüfung der JWT-Signatur |
| JWT | JSON Web Token. signiertes Token-Format, das Keycloak als Access-/Refresh-Token ausstellt |
| OIDC | OpenID Connect. Authentifizierungsprotokoll auf Basis von OAuth2, hier via Authorization Code Flow gegen Keycloak |
| Realm | Mandanten-/Konfigurationseinheit in Keycloak (User, Clients, Rollen). Hier der `daily-lens`-Realm |
| Signierte URL | Zeitlich begrenzte URL mit HMAC-Signatur (`exp`, `sig`). Erlaubt Ressourcenzugriff ohne Bearer-Token (siehe ADR 1) |
| smart_container | Frontend-Komponente mit State, ruft `*.api.ts` auf, reicht Daten an dumb_components weiter |
| Streak | Anzahl aufeinanderfolgender Tage mit mind. einem hochgeladenen Foto |