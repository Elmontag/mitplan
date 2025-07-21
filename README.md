# mitplan!
Mitplan ist ein Event-Planungstool für KiTas und Schulen. Es soll Schulen, Klassen und Eltern die Möglichkeit geben Events zu erstellen, ToDos zu dokumentieren und eigendständig Aufgaben zu übernehmen.

# Rollen
## Lehrer:
Dürfen Veranstaltungen ihrer Klasse anlegen, editieren und löschen, ihnen zugeordnete Klassen sehen, registrierte Eltern ihren Klassen hinzufügen. Lehrer dürfen immer Mitbringeinträge in ihren Veranstaltungen anlegen, die von Eltern übernommen werden können.

## Schuldirektion:
Dürfen alle Veranstaltungen ihrer Schule sehen und editieren.

## Admins:
Sehen alles, können alles editieren.

## Klassenbeirat:
Darf die Veranstaltungen einer Klasse sehen, Personen für die Übernahme einer Aufgabe benennen und Veranstaltungen hinzufügen, die jedoch nur für andere Eltern dieser Klasse sichtbar sind. Klassenlehrer können per Checkbox in den Eventeinstellungwn hinzugefügt werden.

## Elternbeirat:
Wie Klassenbeirat, aber für die ganze Schule.

# Registrierung
Der Elternbeirat wird von der Schulleitung bestimmt.
Der Klassenbeirat wird vom Klassenlehrer definiert.
Elternregistrierungen für einzelne Klassen müssen vom Klassenlehrer freigeschaltet werden.

Registrierungen als Lehrer müssen von der zuständigen Schulleitung freigeschaltet werden.
Ohne Freischaltung ist kein Login möglich.

## Entwicklung

1. `npm install` um Abhängigkeiten zu installieren.
2. `npm test` führt die Jest Tests aus.
3. `npm start` startet den Express Server.

## Docker Deployment

Mit `docker-compose up --build` wird die Anwendung zusammen mit einem nginx Reverse Proxy gestartet. Der Datenbankpfad wird im `data` Ordner abgelegt.
