# Mitplan Demo

Dieses Repository enthält eine einfache Demo-Anwendung für gruppenbasierte Mitbringlisten. Das Backend basiert auf Node.js und SQLite, das Frontend auf React mit Vite.

## Setup

### Voraussetzungen
- Node.js 20
- npm

### Installation
```bash
# Backend installieren
cd server
npm install
cd ..
# Frontend installieren
cd client
npm install
cd ..
```

### Entwicklung starten
```bash
# Backend
cd server
node server.js
```
In einem zweiten Terminal:
```bash
cd client
npm run dev
```
Das Frontend ist dann unter http://localhost:5173 erreichbar und leitet API-Aufrufe an das Backend weiter.

### Demo-Konten
Durch Setzen der Umgebungsvariable `ENABLE_DEMO=1` beim Start des Backends werden einfache Demokonten erzeugt (`parent`/`teacher`/`admin` jeweils mit Passwort `demo`). Diese Funktion kann durch Entfernen der Variable deaktiviert werden.

### Docker
Ein einfaches Docker-Setup befindet sich in `Dockerfile` und `docker-compose.yml`.
