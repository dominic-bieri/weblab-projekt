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
Ansichten (Kalender, Galerie) ohne Full-Page-Reloads und klare Trennung von
Frontend und Backend über eine REST-API.

### ADR 2: Backend als Monolith

Das Backend wird als ein einzelner NestJS-Dienst (Monolith) umgesetzt.
Begründung: Es ist eine kleine Applikation, und ein Monolith ist einfacher
aufzusetzen und zu betreiben als mehrere Services.

## 10. Qualitätsanforderungen

### 10.1 Qualitätsbaum

### 10.2 Qualitätsszenarien

## 11. Risiken und technische Schulden

## 12. Glossar