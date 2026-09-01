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

- Als User möchte ich anderen Usern folgen können, damit ich ihre Fotos sehen kann.
- Als User möchte ich eine rein chronologische Ansicht der Fotos der Personen sehen, denen ich folge, damit ich mich inspirieren lassen kann, ohne dass ein Algorithmus die Reihenfolge beeinflusst.
- Als User möchte ich ein öffentliches Profil mit meinem Foto-Kalender haben, damit andere meinen Fortschritt sehen können.
- Als User möchte ich mich registrieren und einloggen können, damit meine Fotos und mein Fortschritt meinem Account zugeordnet sind.

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
- **Tests**: Vitest (Unit/Integration), Playwright (E2E)
- **Bild-Storage**: Docker-Volume
- (**Authentifizierung**: Keycloak)