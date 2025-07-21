Entwickelt wird eine App für Schul-Mitbringlisten mit entsprechenden Hierarchie- und Berechtigungsebenen.

# Stack
Genutzt werden soll NodeJS, SQLite, React und eine aktuelle Versionen von MaterialUI.

# Oberfläche
Die Oberfläche soll sich an einem MaterialUI Dashboard-Template orientieren (https://mui.com/material-ui/getting-started/templates/dashboard/)

## Profilansicht:
Ansicht und Editieren von Usereigenschaften, E-Mail-Adresse, Mitgliedschaft bei 1 oder mehreren Schulen, Klassen und Elternverbänden.
Sichtbarkeit des Kontos per Usersuche aktivieren / deaktivieren für Klassen, Schulen oder über die eigene Schule hinaus.
Profilbild hinterlegen

## Schulansicht (für Schulleitungen und Lehrer)
Ansicht von Schulevents, Hinzufügen von neuen Schulevents, Definieren von Klassen und Klassenlehrern

## Klassenansicht
Wird über die Schulansicht, oder über einen "Meine Klasse"-Button aufgerufen. Sichtbar für Lehrer und Schulleitungen. Dort können Lehrer Eltern ihren Klassen per Suche hinzufügen. Angezeigt werden Klassenlehrer, beteiligte Eltern, Klassenname.
Die Klassenansicht zeigt Klassenevents an, die von Klassenlehrern erstellt wurden.

## Eventansicht
- Zeigt die Events an, für die man freigeschaltet ist. Man kann einzelne Events aufrufen, neue Events hinzufügen, ToDos für Events definieren. Schulleitung und Lehrer können per Suche Eltern, die der Klasse zugehören, einzelnen Todos zuweisen. Todos können als erledigt markiert, als übernommen oder als ausstehend markiert werden. 
- Zeigt Verantwortung des Events an (Name des Klassenlehrers / Schulleitung)
- Zeigt Datum des Events an
- Zeigt Zahl der benötigten Eltern an

## ToDo-Ansicht
- Zeigt alle ausstehenden Todos eines Nutzers eines offenen Events an
- Zeigt in einem Archiv alle Todos vergangener Events an

# Storys
Als Admin kann ich Schulen anlegen. Schulen können sich gegenseitig nicht sehen oder editieren.
Als Admin kann ich aus einer Nutzerliste Schulleitungen benennen. 
Als Schulleitung kann ich Schulevents anlegen, editieren und Aufgaben anlegen.
Als Schulleitung kann ich alle Events aller Klassen meiner Schule sehen.
Als Schulleitung kann ich Lehrerkonten freigeben und Klassen zuordnen ( 1 Klassenlehrer und beliebig viele Vertretungen)
Als Klassenlehrer kann ich die Events der Schulklassen sehen, denen ich als Klassenlehrer oder Vertretung zugeordnet bin.
Als Klassenlehrer kann ich den Events der Schulklassen sehen, denen ich als Klassenlehrer oder Vertretung zugeordnet bin, Aufgaben hinzufügen und verantwortliche Eltern aus einer Liste der Eltern, die den Klassen zugeordnet sind, benennen.
Als Klassenlehrer oder Vertretung kann ich Eltern meiner Klasse hinzufügen.
Als Elternteil kann ich die Events der Schule und meiner freigeschalteten Schulklassen sehen.
Als Elternteil kann ich meine Zugeordneten Aufgaben sehen.
Als Elternteil kann ich Aufgaben der für mich freigeschalteten Events übernehmen.
Als Schulleitung kann ich ein Sekretariat benennen (welches gleiche Berechtigungen hat wie die Schulleitung)
Als Lehrer möchte ich per Ticker und per Mail benachrichtigt werden, wenn eine Aufgabe übernommen und /oder abgeschlossen wurde.
Als Eltern möchte ich per Ticker und per Mail benachrichtigt werden, wenn mir eine Aufgabe zugewiesen, oder ein für mich interessantes Event erstellt wurde.
Bei der Registrierung möchte ich meine Rolle (Lehrer/Eltern, Schulzugehörigkeit als Dropdown, Klassenzugehörigkeit als Dropdown im Datensatz der Schule) angeben können.
Als Schulleitung möchte ich ein Zulassungsinterface, in dem ich Lehrer und Eltern akzeptieren und Klassen zuordnen kann.
Als Lehrer möchte ich ein Zulassungsinterface, in dem ich Eltern meiner Klasse zuordnen kann.
In der Registrierung angebenene Schul- und Klassenzugehörigkeiten MÜSSEN IMMER von SChulleitung oder Lehrern geprüft und freigeschaltet werden.
Ohne Freischaltung ist ein Login nicht möglich.
Als Lehrer / Eltern möchte nach Registrierung eine Mail mit einem Link zur Kontoaktivierung erhalten. Erst dann taucht mein Konto im Interface zum Freischalten auf.
Als Lehrer / Eltern möchte ich per Mail über eine erfolgte Freischaltung informiert werden.
Als Admin kann ich alle Schulen, Klassen  und User:innen sehen und verwalten.

Es soll Testkonten für admin, Schullleitung, Lehrer und Eltern geben. Diese werden per env aus- oder eingeschaltet.


