# AGENTS.md - Schul-Mitbringlisten App

## Überblick
Eine Web-Anwendung zur Verwaltung von Schul-Events und Mitbringlisten mit hierarchischen Berechtigungsebenen für Administratoren, Schulleitungen, Lehrer und Eltern.

## Technology Stack

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **SQLite** - Database
- **JWT** - Authentication & Authorization
- **bcrypt** - Password Hashing
- **Nodemailer** - Email Notifications
- **express-rate-limit** - Rate Limiting
- **helmet** - Security Headers

### Frontend
- **React** (Latest LTS)
- **Material-UI v5** - UI Framework
- **React Router** - Navigation
- **Axios** - HTTP Client
- **React Hook Form** - Form Management
- **React Query** - State Management

### Security & Testing
- **Jest** - Testing Framework
- **Supertest** - API Testing
- **ESLint** - Code Quality
- **express-validator** - Input Validation
- **CORS** - Cross-Origin Resource Sharing

## Architektur

### Benutzerrollen & Hierarchie
```
Admin
├── Schulleitung/Sekretariat
    ├── Klassenlehrer
    │   └── Vertretungslehrer
    └── Eltern
```

### Berechtigungsmatrix
| Rolle | Schulen verwalten | Events erstellen | Klassen zuordnen | Aufgaben zuweisen | Aufgaben übernehmen |
|-------|------------------|------------------|------------------|-------------------|-------------------|
| Admin | ✅ | ❌ | ✅ | ❌ | ❌ |
| Schulleitung | Eigene | ✅ | ✅ | ✅ | ❌ |
| Klassenlehrer | Lesen | Klassenevents | Lesen | ✅ | ❌ |
| Eltern | Lesen | ❌ | ❌ | ❌ | ✅ |

## Core Features

### 1. Benutzerverwaltung
- **Registrierung**: Email-basierte Registrierung mit Rollenwahl
- **Aktivierung**: Email-Link zur Kontoaktivierung
- **Freischaltung**: Mehrstufige Genehmigung durch Schulleitung/Lehrer
- **Profile**: Bearbeitung von Benutzerdaten, Profilbild, Sichtbarkeitseinstellungen

### 2. Schulverwaltung
- **Schulen**: Anlegen und Verwalten von Schulen (Admin)
- **Klassen**: Definition und Zuordnung von Klassen
- **Lehrer-Zuordnung**: Klassenlehrer und Vertretungen

### 3. Event-Management
- **Schulevents**: Schulweite Events (Schulleitung)
- **Klassenevents**: Klassenspezifische Events (Lehrer)
- **Aufgaben**: ToDo-Definition mit Eltern-Zuordnung
- **Status-Tracking**: Ausstehend, Übernommen, Erledigt

### 4. Benachrichtigungssystem
- **In-App-Ticker**: Echtzeit-Benachrichtigungen
- **Email-Benachrichtigungen**: Event-Updates, Aufgaben-Zuweisungen
- **Status-Updates**: Aufgaben-Übernahme und -Abschluss

## User Stories

### Administrator
- [x] Schulen anlegen und verwalten
- [x] Schulleitungen aus Nutzerliste benennen
- [x] Komplette System-Übersicht aller Schulen, Klassen und Nutzer

### Schulleitung
- [x] Schulevents anlegen, editieren und verwalten
- [x] Alle Events aller Klassen der eigenen Schule einsehen
- [x] Lehrerkonten freigeben und Klassen zuordnen
- [x] Sekretariat mit gleichen Berechtigungen benennen
- [x] Zulassungsinterface für Lehrer und Eltern

### Klassenlehrer/Vertretung
- [x] Events der zugeordneten Klassen einsehen
- [x] Aufgaben zu Events hinzufügen
- [x] Eltern aus Klassenliste Aufgaben zuweisen
- [x] Eltern der eigenen Klasse hinzufügen
- [x] Zulassungsinterface für Eltern
- [x] Benachrichtigungen bei Aufgaben-Updates

### Eltern
- [x] Events der Schule und freigeschalteten Klassen einsehen
- [x] Zugeordnete Aufgaben verwalten
- [x] Aufgaben für freigeschaltete Events übernehmen
- [x] Benachrichtigungen bei neuen Zuweisungen/Events

## Security Framework

### Authentifizierung & Autorisierung
- **JWT-basierte Authentifizierung**
- **Role-based Access Control (RBAC)**
- **Session-Management mit Refresh Tokens**
- **Password Policy**: Mindestanforderungen für Passwörter

### Input Validation & Sanitization
```javascript
// Beispiel: Event-Validierung
const eventSchema = {
  title: { isLength: { min: 3, max: 100 } },
  description: { isLength: { max: 500 } },
  date: { isISO8601: true },
  requiredParents: { isInt: { min: 1, max: 50 } }
};
```

### Data Protection
- **SQL Injection Prevention**: Prepared Statements
- **XSS Protection**: Input Sanitization & Content Security Policy
- **CSRF Protection**: CSRF Tokens
- **Rate Limiting**: API-Endpunkt Schutz

### Privacy & GDPR Compliance
- **Datenminimierung**: Nur notwendige Daten speichern
- **Löschrecht**: Konto- und Datenlöschung
- **Sichtbarkeitskontrollen**: Granulare Privacy-Einstellungen
- **Audit Logs**: Nachverfolgbare Aktionen

## Testing Strategy

### Unit Tests
```javascript
describe('Event Service', () => {
  test('sollte Event für berechtigte Schulleitung erstellen', async () => {
    const event = await eventService.createEvent(schoolPrincipalUser, eventData);
    expect(event.createdBy).toBe(schoolPrincipalUser.id);
  });
  
  test('sollte Event-Erstellung für Eltern verweigern', async () => {
    await expect(
      eventService.createEvent(parentUser, eventData)
    ).rejects.toThrow('Insufficient permissions');
  });
});
```

### Integration Tests
```javascript
describe('Authentication Flow', () => {
  test('Vollständiger Registrierungs- und Aktivierungsflow', async () => {
    // 1. Registrierung
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    // 2. Email-Aktivierung simulieren
    const activationToken = extractTokenFromEmail(response.body.message);
    await request(app)
      .get(`/api/auth/activate/${activationToken}`)
      .expect(200);
      
    // 3. Freischaltung durch Schulleitung
    await request(app)
      .patch('/api/admin/approve-user')
      .set('Authorization', `Bearer ${principalToken}`)
      .send({ userId: response.body.userId, approved: true });
  });
});
```

### Security Tests
```javascript
describe('Security Tests', () => {
  test('sollte bei Rate Limit Überschreitung blockieren', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).post('/api/auth/login').send(invalidCredentials);
    }
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(invalidCredentials);
    expect(response.status).toBe(429);
  });
  
  test('sollte SQL Injection verhindern', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const response = await request(app)
      .get('/api/schools/search')
      .query({ name: maliciousInput });
    expect(response.status).not.toBe(500);
  });
});
```

### End-to-End Tests
```javascript
describe('E2E: Event Management', () => {
  test('Kompletter Event-Lifecycle', async () => {
    // Login als Schulleitung
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'principal@school.de');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Event erstellen
    await page.click('[data-testid="create-event"]');
    await page.fill('[data-testid="event-title"]', 'Schulfest 2025');
    await page.click('[data-testid="save-event"]');
    
    // Aufgabe zuweisen
    await page.click('[data-testid="add-task"]');
    await page.selectOption('[data-testid="parent-select"]', 'parent@email.de');
    await page.click('[data-testid="assign-task"]');
    
    // Als Elternteil einloggen und Aufgabe übernehmen
    await loginAsParent();
    await page.click('[data-testid="accept-task"]');
    
    // Bestätigung prüfen
    await expect(page.locator('[data-testid="task-status"]')).toHaveText('Übernommen');
  });
});
```

## Development Environment

### Umgebungsvariablen
```env
# Database
DATABASE_PATH=./data/school_app.db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Test Accounts (Development nur)
ENABLE_TEST_ACCOUNTS=true
TEST_ADMIN_EMAIL=admin@test.de
TEST_PRINCIPAL_EMAIL=principal@test.de
TEST_TEACHER_EMAIL=teacher@test.de
TEST_PARENT_EMAIL=parent@test.de
```

### Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/data/school_app.db
    volumes:
      - ./data:/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Benutzerregistrierung
- `POST /api/auth/login` - Anmeldung
- `GET /api/auth/activate/:token` - Kontoaktivierung
- `POST /api/auth/refresh` - Token erneuern

### User Management
- `GET /api/users/profile` - Benutzerprofil abrufen
- `PATCH /api/users/profile` - Profil bearbeiten
- `GET /api/users/pending` - Wartende Freischaltungen

### Schools & Classes
- `GET /api/schools` - Schulen auflisten
- `POST /api/schools` - Schule erstellen (Admin)
- `GET /api/schools/:id/classes` - Klassen einer Schule
- `POST /api/classes` - Klasse erstellen

### Events & Tasks
- `GET /api/events` - Events auflisten
- `POST /api/events` - Event erstellen
- `GET /api/events/:id/tasks` - Aufgaben eines Events
- `POST /api/tasks` - Aufgabe erstellen
- `PATCH /api/tasks/:id/accept` - Aufgabe übernehmen

## Monitoring & Logging

### Application Logs
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### Security Events
- Fehlgeschlagene Login-Versuche
- Unbefugte Zugriff-Versuche
- Admin-Aktionen
- Datenänderungen

### Performance Monitoring
- API Response Times
- Database Query Performance
- Memory Usage
- Error Rates

## Compliance & Standards

### GDPR/DSGVO Compliance
- Einverständniserklärungen bei Registrierung
- Recht auf Vergessenwerden implementiert
- Datenportabilität gewährleistet
- Privacy by Design Prinzipien

### Security Standards
- OWASP Top 10 Compliance
- ISO 27001 Guidelines
- Regelmäßige Security Audits
- Penetration Testing

### Code Quality
- ESLint Konfiguration
- Prettier Code Formatting
- SonarQube Integration
- Test Coverage > 80%