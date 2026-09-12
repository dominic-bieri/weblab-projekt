# Projektvorschlag

## Kontext

Im Alltag fehlt oft der Anstoss, bewusst fotografieren zu gehen. Das „fotografische Auge“ wird jedoch nur besser, wenn man immer wieder übt.
Die Idee für das Projekt ist deshalb, dass man über die App täglich ein Foto hochladen und sich zeitlich begrenzten Challenges widmen kann (z. B. zwei Wochen nur Architektur).
Dabei soll man durch eine Kalenderübersicht (inkl. Streak) und eine Challenge-Galerie dazu animiert werden, die persönliche Foto-Routine aufrechtzuerhalten.

Optional könnte die Website eine kleine soziale Komponente erhalten, z. B. die Möglichkeit, anderen Nutzern zu folgen und einen chronologischen Feed zu haben.
Allerdings soll bewusst auf Likes, Kommentare oder einen Algorithmus verzichtet werden, damit der Fokus auf den Bildern bleibt und kein zweites Instagram aufgebaut wird.

## User Stories (MoSCoW)

### Must have

- Als User möchte ich pro Tag ein Foto hochladen können, damit ich eine tägliche Fotografie-Routine aufbaue.
- Als User möchte ich meine Fotos bearbeiten und löschen können, damit ich Fehler korrigieren kann.
- Als User möchte ich meine Fotos in einer Kalender-/Zeitleisten-Ansicht sehen, damit ich meinen Fortschritt über die Zeit nachvollziehen kann.
- Als User möchte ich eine Challenge (Titel, Zeitraum, Beschreibung) erstellen können, damit ich mir ein fotografisches Thema vornehmen kann.
- Als User möchte ich meine Fotos einer Challenge zuordnen können, damit sie thematisch gruppiert sind.
- Als User möchte ich alle Fotos einer Challenge in einer Galerie-Ansicht sehen, damit ich den Verlauf der Challenge visuell nachvollziehen kann.

### Should have

- Als User möchte ich einen Streak-Zähler sehen (Anzahl aufeinanderfolgender Tage mit Foto), damit ich motiviert bleibe.
- Als User möchte ich EXIF-Daten (Kamera, Brennweite) zu meinen Fotos angezeigt bekommen, damit ich technische Details nachvollziehen kann.

### Could have

- Als User möchte ich mich registrieren und einloggen können, damit meine Fotos und mein Fortschritt meinem Account zugeordnet sind.
- Als User möchte ich anderen Usern folgen können, damit ich ihre Fotos sehen kann.
- Als User möchte ich eine rein chronologische Ansicht der Fotos der Personen sehen, denen ich folge, damit ich mich inspirieren lassen kann, ohne dass ein Algorithmus die Reihenfolge beeinflusst.
- Als User möchte ich ein öffentliches Profil mit meinem Foto-Kalender haben, damit andere meinen Fortschritt sehen können.

### Won't have (bewusst ausgeschlossen)

- Likes und Kommentare
- Feed-Algorithmus / Empfehlungssystem
- Push-Benachrichtigungen
- Bildfilter/-bearbeitung

## Angedachter Technologie-Stack

- **Frontend**: Angular
- **Backend**: NestJS
- **Datenbank**: PostgreSQL
- **Deployment**: Docker Compose
- **Tests**: Vitest (Unit/Integration), E2E TBD
- **Bild-Storage**: Docker-Volume
- (**Authentifizierung**: Keycloak)

## Funktionale Anforderungen

> Diese Anforderungen verstehen sich als **Mindestanforderungen**
* Die Applikation muss das Erstellen, Anzeigen, Ändern und Löschen einer selbständig definierten Resource ermöglichen.
* Die Daten müssen persistent in einer Datenbank abgelegt werden.
* Die Daten müssen in mindestens zwei inhaltlich unterschiedlichen Darstellungsformen präsentiert werden.

## Nicht funktionale Anforderungen

* Die Applikation soll neben der Desktop-Ansicht, auch für die Mobile/Tablet-Ansicht optimiert sein.
* Die Funktionalitäten sollen mittels sinnvollen automatisierten **Unit/Integration/E2E-Tests** überprüft werden.
* [Lighthouse-Score](https://developer.chrome.com/docs/lighthouse?hl=de) von mindestens 90 (Durchschnitt aller Analysen) für Mobile sowie Desktop.
* Das **Prod-Bundle** der Applikation soll reproduzierbar gestartet werden können.
  * Option 1: Deployed auf einer öffentlichen URL
  * Option 2: via Docker-Compose mit einem Command (`docker compose up`) ausführbar
* Code-Lesbarkeit & Erweiterbarkeit
* Sinnvolle & durchdachte Strukturierung der gesamten Applikation
