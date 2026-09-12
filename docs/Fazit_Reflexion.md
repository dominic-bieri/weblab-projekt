# Fazit & Reflexion

## Was ist gut gelaufen?

### Angular als Frontend-Framework

Eine der Vorgaben lautete, dass der Fokus des Projekts auf der Anwendung noch nicht bekannter Web-Technologien liegen soll. Mit Vue (aus der Arbeit) und React (privat) hatte ich bereits kleinere Projekte umgesetzt. Angular war mir durch die Arbeit ebenfalls schon ein wenig bekannt, allerdings nie in dieser Tiefe. Ich habe mich trotzdem bewusst für Angular entschieden, da es mir fachlich am meisten bringt und im Unterricht auch am ausführlichsten behandelt wurde. Dadurch konnte ich in diesem Bereich sehr viel dazulernen.

### Keycloak-Integration

Das Setup des Projekts sowie die Integration von Keycloak in Angular und im Backend sind gut gelaufen. Die Integration hat mir nochmals einiges zum Thema Authentifizierung gezeigt, etwa im Umgang mit Refresh-Tokens. Vieles davon wird zwar durch die Library abstrahiert, trotzdem musste man sich inhaltlich damit auseinandersetzen.

### NestJS als Backend-Framework

Für das Backend bin ich nach kurzer Recherche auf NestJS gestossen. Mir gefiel das durchdachte, stark strukturierte Architektur-Design mit Decorators. Auch Dependency Injection ist fester Bestandteil des Frameworks, wodurch es insgesamt sehr ähnlich wie Angular wirkt. Bei einem nächsten TypeScript-Backend würde ich auf jeden Fall wieder NestJS verwenden, da ich damit wirklich positive Erfahrungen gemacht habe.

### Internationalisierung (i18n)

Auch die Mehrsprachigkeit habe ich von Anfang an eingeplant und mit ngx-translate für Deutsch/Englisch umgesetzt, wodurch sie nicht nachträglich ins Projekt mühsam eingebaut werden musste.

### CI-Pipeline

Ebenfalls gut gelaufen ist die CI-Pipeline, die von Beginn an Tests, Formatierung (Prettier) und Linting (oxlint) automatisiert ausführt. Ehrlich gesagt vergesse ich es lokal öfters, den Code zu formatieren oder zu linten. Durch die Erzwingung in der CI blieb der Code trotzdem konsistent.

## Wo lagen die Herausforderungen?

### OIDC und Ausliefern der Fotos

Herausforderungen gab es vor allem beim Umgang mit OIDC sowie beim Ausliefern der Fotos. Da `<img>`-Tags keine Bearer-Token mitschicken können, musste dafür eine eigene Lösung mit signierten URLs gefunden werden.

### Keycloak in den E2E-Tests

Auch die Integration von Keycloak in die E2E-Tests war anspruchsvoll, da dafür der gesamte Stack lauffähig sein musste, also Frontend, Backend, Keycloak und Postgres zusammen.

### Angular Signals

Eine weitere Herausforderung war der Umgang mit Angular Signals, insbesondere mit `effect` und `computed`. Dadurch, dass ich mich damit auseinandersetzen musste, habe ich aber auch ein besseres Verständnis dafür bekommen.

### Styling

Auch das Styling der Anwendung war eine Herausforderung, sowohl das Anpassen/Theming von Angular Material als auch responsive CSS und ein konsistentes Design über die ganze App hinweg.

### Zeitmanagement & Priorisierung

Auch das Zeitmanagement war eine Herausforderung. Zu Beginn dachte ich, dass ich die meisten Anforderungen relativ gut umsetzen kann. Mit der Zeit hat sich dann aber gezeigt, dass 60 Stunden doch nicht so viel sind, wie man zuerst denkt.

Deshalb musste ich priorisieren: Registrierung/Login war im Projektvorschlag zwar nur ein Could-have, war aber Voraussetzung für die restlichen Anforderungen und ermöglicht erst, dass die App von mehreren Usern statt nur einer Person genutzt werden kann. Die EXIF-Daten aus dem Should-have habe ich dafür weggelassen, da sie für das MVP keinen wirklichen Mehrwert bringen und architektonisch auch keine grosse Neuerung dargestellt hätten, sondern einfach ein Auslesen von Bilddaten und Speichern in der DB gewesen wären. Ausserdem hatte ich schlicht mehr Interesse daran, Auth zu implementieren als EXIF-Daten auszulesen.

## Was würde ich das nächste Mal anders / besser machen?

### Styling & Responsiveness früher einplanen

Ich würde Styling und Responsivness bereits während der Entwicklung der einzelnen Komponenten berücksichtigen, anstatt sie erst am Schluss anzugehen.

### Shared Library für DTOs & Validierung

Wenn Frontend und Backend wie hier beide in TypeScript/JavaScript geschrieben sind, würde ich zudem eine Shared Library für DTOs und Validierungen einführen, um diese nicht doppelt pflegen zu müssen.
