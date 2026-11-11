---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Willkommen bei ARGVUS
description: "Lernen Sie ARGVUS kennen: eine modulare Desktop-Umgebung für Arch Linux auf Basis von Wayland und Hyprland mit integrierten Einstellungen, Darstellung, Sitzungswerkzeugen und Anwendungen."
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---

# Willkommen bei ARGVUS

Heute stellen wir **ARGVUS** vor: eine modulare Desktop-Umgebung für **Arch Linux**, entwickelt für **Wayland** und angetrieben von **Hyprland**.

ARGVUS vereint die Bestandteile eines Linux-Desktops: Anmeldung und Sitzungsstart, Fenster und Arbeitsbereiche, eine Taskleiste und ein Schnellzugriffsmenü, Einstellungen, Designs, Benachrichtigungen, Bildschirme, Energieverwaltung, Netzwerk und alltägliche Anwendungen. Diese Bestandteile sind in spezialisierte Pakete gegliedert, die ein gemeinsames Konfigurationsmodell verwenden. So wirkt der Desktop wie ein zusammenhängendes System, ohne zu einem monolithischen Programm zu werden.

> **Kurz gesagt:** Arch Linux ist das Betriebssystem, Hyprland der Wayland-Compositor, und ARGVUS koordiniert die Sitzung und das Desktop-Erlebnis rund um beide.

## Ein Desktop aus zusammenarbeitenden Komponenten

Die ARGVUS-Sitzung führt auf einem klaren Weg von der Anmeldung zum Desktop:

```text
Anmeldung oder TTY
    ↓
ARGVUS-Sitzung → Hyprland
    ↓
Taskleiste · Kontrollzentrum · Benachrichtigungen · Hintergrundbild · Leerlaufdienste
```

Der Sitzungsmanager startet die Desktopdienste und überwacht sie. Hyprland verwaltet Fenster, Arbeitsbereiche und Monitore. Taskleiste, Kontrollzentrum, Einstellungsanwendung und spezialisierte Dienstpakete stellen die Oberflächen bereit, die Sie täglich verwenden.

| Bereich | Das bringt er für Ihren Desktop |
| --- | --- |
| **Anmeldung und Sitzungen** | Ein ARGVUS-Begrüßer, grafische Anmeldung, Start über ein TTY und verwaltete Benutzerdienste. |
| **Fenster und Arbeitsbereiche** | Eine Hyprland-Konfiguration mit Tastenkürzeln, Layouts, Monitorverwaltung und gemeinsamen Darstellungseinstellungen. |
| **Taskleiste** | Eine auf Waybar basierende Leiste für Arbeitsbereiche, Fenster und Systemstatus mit optionalen Widgets. |
| **Kontrollzentrum** | Eine Quickshell-Oberfläche für Schnellaktionen, Sitzungs- und Energiesteuerung sowie Desktop-Widgets. |
| **Einstellungszentrale** | Eine auf Tastaturbedienung ausgerichtete Anwendung zur Konfiguration und Verwaltung des Desktops. |
| **Desktopdienste** | Spezialisierte Integrationen für Bildschirme, Netzwerk, Bluetooth, Energie, Benachrichtigungen, Firewall und Wechseldatenträger. |

Jede Komponente verwaltet ihre eigenen Befehle und ihr eigenes Dienstverhalten. Dank dieses modularen Aufbaus lässt sich ein einzelner Teil warten oder verbessern, ohne den gesamten Desktop in eine eng gekoppelte Anwendung zu verwandeln.

## Einstellungen, die zusammenspielen

Eine Einstellung sollte sich vorhersehbar auf den gesamten Desktop auswirken. ARGVUS speichert Darstellung und Voreinstellungen zentral und wendet sie anschließend auf die betreffenden Komponenten an. Die Einstellungszentrale bietet eine geführte Oberfläche zum Anpassen; wenn Sie lieber das Terminal nutzen, stehen Befehlszeilenwerkzeuge bereit.

Eine Designänderung kann beispielsweise Compositor, GTK- und Qt-Anwendungen, Taskleiste, Kontrollzentrum, Starter, Benachrichtigungen und Sperrbildschirm gemeinsam aktualisieren. Sie können außerdem eine Akzentfarbe und einen Layoutstil wählen:

| Stil | Wirkung |
| --- | --- |
| **Sticky** | Kompakte Abstände und ein engerer Übergang zwischen Fenstern und Desktop-Oberflächen. |
| **Spaced** | Größere Abstände, abgerundete Ecken, Schatten und mehr Freiraum rund um die Oberfläche. |

Das visuelle System umfasst **23 Designfamilien**, die jeweils in beiden Stilen verfügbar sind, sowie Hintergrundbilder, Schriftarten, Icon-Designs und konfigurierbare Effekte. Wählen Sie ein fertiges Erscheinungsbild oder passen Sie die Akzentfarbe an Ihren Geschmack an.

> **Wichtig zu unterscheiden:** Ihre ausgewählten Voreinstellungen sind die maßgebliche Quelle. Dateien, die für einzelne Desktopkomponenten erzeugt werden, bilden diesen gemeinsamen Zustand ab. Ändern Sie Einstellungen daher über ARGVUS oder unterstützte Befehle, statt generierte Dateien direkt zu bearbeiten.

## Nützliche Werkzeuge, bereits integriert

ARGVUS enthält oder integriert zahlreiche kleine Helfer, damit alltägliche Aufgaben schnell erreichbar sind:

- **Anwendungsstarter:** Drücken Sie `SUPER + D`, um installierte grafische Anwendungen zu finden. Weitere Tastaturmenüs öffnen Projekte, SSH-Hosts, Snippets, Emojis, einen Taschenrechner und Spickzettel.
- **Bildschirmsteuerung:** Zeigen Sie Monitore an und passen Sie Auflösung, Bildwiederholrate, Skalierung, Position und Ausrichtung an, sofern aktiver Compositor und Hardware dies unterstützen.
- **Energie- und Sitzungsaktionen:** Über das Kontrollzentrum können Sie sofort sperren, den Ruhezustand aktivieren, sich abmelden oder herunterfahren. Dauerhafte Einstellungen für Leerlauf und Bildschirme konfigurieren Sie in der Einstellungszentrale.
- **Nicht stören:** Steuern Sie den Empfang von Benachrichtigungen über das Kontrollzentrum. Während der Aktivierung eingegangene Benachrichtigungen werden für später aufbewahrt.
- **Wechseldatenträger:** Greifen Sie über integrierte Menüs und Taskleistenoberflächen auf Speicheraktionen zu.
- **ARGVUS Focus:** Starten Sie Pomodoro-ähnliche Fokusphasen, Pausen und Benachrichtigungen mit einem lokalen Verlauf.
- **ARGVUS Clock:** Nutzen Sie Weltuhren, Stoppuhr, Timer und Wecker, einschließlich Schlummerfunktion und Berichten zu verpassten Alarmen.
- **Terminalwerkzeuge:** Öffnen Sie konfigurierte Terminalprofile, einen Systemmonitor und weitere integrierte TUI-Anwendungen.

Einige Funktionen sind optionale Pakete. Programmieragent-Integrationen und Spiele lassen sich beispielsweise hinzufügen, ohne sie zu verpflichtenden Bestandteilen der Basissitzung zu machen. KI-Integrationen starten den ausgewählten Agenten in einem Terminal; ARGVUS legt keine Konten an und richtet keine API-Schlüssel oder Abonnements für Sie ein.

## Erste Schritte mit Arch Linux

Für eine neue Arch-Linux-Installation lautet der dokumentierte Schnellstart:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

Das Installationsprogramm richtet das ARGVUS-Paket-Repository ein und installiert das Paket `argvus` samt Abhängigkeiten. Melden Sie sich anschließend ab und wählen Sie **ARGVUS** in Ihrem Display-Manager oder starten Sie eine ARGVUS-Sitzung über ein TTY.

```sh
# Die Einstellungszentrale öffnen
argvus --control-center

# Den Einrichtungsassistenten jederzeit erneut öffnen
argvus welcome
```

ARGVUS wurde für **Arch Linux**, **Wayland** und **Hyprland** entwickelt und ist keine eigenständige Linux-Distribution. Lesen Sie vor der Installation die [Installationsanleitung](https://argvus.github.io/docs/getting-started/installation/), um Anforderungen, manuelle Einrichtung und aktuelle Paketdetails zu prüfen.

## ARGVUS entdecken

Beginnen Sie mit der [Benutzerdokumentation](https://argvus.github.io/docs/intro/) zur Einrichtung und täglichen Nutzung oder erkunden Sie das [ARGVUS-Quellcode-Repository](https://github.com/argvus/argvus) und die [ARGVUS-Organisation auf GitHub](https://github.com/argvus/), um die einzelnen Komponenten kennenzulernen.

Willkommen bei einem Desktop, der unter der Oberfläche modular und dort koordiniert ist, wo es darauf ankommt. **Willkommen bei ARGVUS.**
