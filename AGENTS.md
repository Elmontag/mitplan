Entwickelt wird eine App für Schul-Mitbringlisten.

Eltern: Dürfen Events sehen und die Übernahme von Listeneinträgen, die von Lehrern, sowie Admins angelegt wurden, als "Erledigt" markieren. Eltern dürfen Kommentare für Rückfragen hinterlassen. Eltern dürfen zusätzliche Einträge nur anlegen, wenn dies in den Eventeinstellungen von Admins oder Lehtern für dieses Event aktiviert wurde. Eltern dürfen nur Listeneinträge löschen, die sie selbst angelegt haben.
Lehrer: Dürfen Veranstaltungen ihrer Klasse anlegen, editieren und löschen, ihnen zugeordnete Klassen sehen, registrierte Eltern ihren Klassen hinzufügen. Lehrer dürfen immer Mitbringeinträge in ihren Veranstaltungen anlegen, die von Eltern übernommen werden können.

Schuldirektion: Dürfen alle Veranstaltungen ihrer Schule sehen und editieren.

Admins: Sehen alles, können alles editieren.

Klassenbeirat: Darf die Veranstaltungen einer Klasse sehen, Personen für die Übernahme einer Aufgabe benennen und Veranstaltungen hinzufügen, die jedoch nur für andere Eltern dieser Klasse sichtbar sind. Klassenlehrer können per Checkbox in den Eventeinstellungwn hinzugefügt werden.

Elternbeirat: Wie Klassenbeirat, aber für die ganze Schule.

Achte darauf, dass später noch Berechtigungen für Fördervereine, Ganztagsbetreuung usw ergänzt werden.

Der Elternbeirat wird von der Schulleitung bestimmt, der Klassenbeirat vom Klassenlehrer. Elternregistrierungen für einzelne Klassen müssen vom Klassenlehrer freigeschaltet werden.

Registrierungen als Lehrer müssen von der zuständigen Schulleitung freigeschaltet werden. Ohne Freischaltung ist kein Login möglich.

Entwickelt werden soll Front- und Backend mit API.

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


