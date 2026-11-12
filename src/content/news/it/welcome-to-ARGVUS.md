---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Benvenuti in ARGVUS
description: Scopri ARGVUS, un ambiente desktop modulare per Arch Linux basato su Wayland e Hyprland, con impostazioni, aspetto, strumenti di sessione e applicazioni integrati.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---


Oggi presentiamo **ARGVUS**: un ambiente desktop modulare per **Arch Linux**, progettato per **Wayland** e basato su **Hyprland**.

ARGVUS riunisce le parti di un desktop Linux: accesso e avvio della sessione, finestre e spazi di lavoro, una barra delle applicazioni e un pannello di controllo rapido, impostazioni, temi, notifiche, schermi, alimentazione, rete e applicazioni di tutti i giorni. Questi elementi sono organizzati in pacchetti specializzati che condividono un modello di configurazione comune, così il desktop funziona come un unico sistema senza diventare un programma monolitico.

> **In breve:** Arch Linux è il sistema operativo, Hyprland è il compositor Wayland e ARGVUS coordina la sessione e l’esperienza desktop intorno a entrambi.

## Un desktop composto da parti che collaborano

La sessione ARGVUS segue un percorso chiaro dall’accesso al desktop:

```text
Accesso o TTY
    ↓
Sessione ARGVUS → Hyprland
    ↓
Barra delle applicazioni · Pannello di controllo · Notifiche · Sfondo · Servizi di inattività
```

Il gestore di sessione avvia e supervisiona i servizi del desktop. Hyprland gestisce finestre, spazi di lavoro e monitor. La barra delle applicazioni, il pannello di controllo, l’applicazione delle impostazioni e i pacchetti di servizi dedicati forniscono le interfacce che usi ogni giorno.

| Area | Cosa offre al desktop |
| --- | --- |
| **Accesso e sessioni** | Un greeter ARGVUS, accesso grafico, avvio da TTY e servizi utente gestiti. |
| **Finestre e spazi di lavoro** | Una configurazione Hyprland con scorciatoie da tastiera, layout, gestione dei monitor e impostazioni condivise dell’aspetto. |
| **Barra delle applicazioni** | Una barra basata su Waybar per spazi di lavoro, finestre e stato del sistema, con widget opzionali. |
| **Pannello di controllo** | Un’interfaccia Quickshell per azioni rapide, controlli di sessione e alimentazione e widget desktop. |
| **Centro di controllo** | Un’applicazione di impostazioni pensata per l’uso da tastiera, per configurare e amministrare il desktop. |
| **Servizi desktop** | Integrazioni dedicate per schermi, rete, Bluetooth, alimentazione, notifiche, firewall e supporti rimovibili. |

Ogni componente gestisce i propri comandi e il proprio comportamento come servizio. Questa struttura modulare permette di mantenere o migliorare una parte senza trasformare l’intero desktop in un’applicazione strettamente accoppiata.

## Impostazioni che funzionano insieme

Una modifica dovrebbe produrre un effetto prevedibile in tutto il desktop. ARGVUS conserva centralmente lo stato dell’aspetto e delle preferenze, poi lo applica ai componenti interessati. Il Centro di controllo offre un’interfaccia guidata per modificare le impostazioni; sono disponibili anche strumenti da riga di comando se preferisci il terminale.

Per esempio, cambiare tema può aggiornare insieme compositor, applicazioni GTK e Qt, barra delle applicazioni, pannello di controllo, launcher, notifiche e schermata di blocco. Puoi anche scegliere un colore d’accento e uno stile di layout:

| Stile | Aspetto |
| --- | --- |
| **Sticky** | Spazi compatti e maggiore vicinanza tra finestre e superfici del desktop. |
| **Spaced** | Spazi più ampi, angoli arrotondati, ombre e più respiro intorno all’interfaccia. |

Il sistema visivo include **23 famiglie di temi**, ciascuna disponibile in entrambi gli stili, oltre a sfondi, font, temi di icone ed effetti configurabili. Scegli un aspetto pronto all’uso oppure regola il colore d’accento per renderlo tuo.

> **Una distinzione utile:** le preferenze selezionate sono la fonte di verità. I file generati per i singoli componenti desktop sono proiezioni di questo stato condiviso; perciò modifica le impostazioni tramite ARGVUS o i comandi supportati, invece di intervenire sui file generati.

## Strumenti utili, già collegati

ARGVUS include o integra diverse piccole comodità che tengono a portata di mano le attività più comuni:

- **Launcher delle applicazioni:** premi `SUPER + D` per trovare le applicazioni grafiche installate. Altri menu da tastiera possono aprire progetti, host SSH, snippet, emoji, una calcolatrice e schede di riferimento.
- **Controlli dello schermo:** esamina i monitor e modifica impostazioni come risoluzione, frequenza di aggiornamento, scala, posizione e orientamento quando il compositor attivo e l’hardware lo consentono.
- **Alimentazione e sessione:** usa il pannello di controllo per bloccare, sospendere, disconnetterti o spegnere subito il sistema. Configura nel Centro di controllo il comportamento persistente per inattività e schermi.
- **Non disturbare:** controlla la consegna delle notifiche dal pannello di controllo; quelle ricevute mentre la funzione è attiva vengono conservate per dopo.
- **Dispositivi rimovibili:** accedi alle azioni di archiviazione dai menu integrati e dalle interfacce della barra delle applicazioni.
- **ARGVUS Focus:** avvia sessioni di concentrazione in stile Pomodoro, pause e notifiche, con una cronologia locale.
- **ARGVUS Clock:** usa orologi mondiali, cronometro, timer e sveglie, con posticipo e rapporti sulle sveglie perse.
- **Strumenti per il terminale:** apri profili di terminale configurati, un monitor di sistema e altre applicazioni TUI integrate.

Alcune funzionalità sono pacchetti opzionali. Per esempio, le integrazioni per agenti di programmazione e i giochi si possono aggiungere senza renderli componenti obbligatori della sessione base. Le integrazioni di IA avviano l’agente selezionato in un terminale; ARGVUS non crea account e non configura chiavi API o abbonamenti al posto tuo.

## Iniziare su Arch Linux

Su una nuova installazione di Arch Linux, la procedura rapida documentata è:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

Il programma di installazione configura il repository dei pacchetti ARGVUS e installa il pacchetto `argvus` con le relative dipendenze. Poi esci dalla sessione e scegli **ARGVUS** nel display manager, oppure avvia una sessione ARGVUS da un TTY.

```sh
# Aprire il Centro di controllo
argvus --control-center

# Riaprire la guida alla prima configurazione in qualsiasi momento
argvus welcome
```

ARGVUS è progettato per **Arch Linux**, **Wayland** e **Hyprland**; non è una distribuzione Linux autonoma. Prima di installare, consulta la [guida all’installazione](https://argvus.github.io/docs/getting-started/installation/) per requisiti, configurazione manuale e dettagli aggiornati sui pacchetti.

## Esplorare ARGVUS

Inizia dalla [documentazione utente](https://argvus.github.io/docs/intro/) per configurazione e uso quotidiano, oppure esplora il [repository sorgente di ARGVUS](https://github.com/argvus/argvus) e l’[organizzazione ARGVUS su GitHub](https://github.com/argvus/) per scoprire i singoli componenti.

Benvenuto in un desktop modulare sotto il cofano e coordinato dove conta. **Benvenuto in ARGVUS.**
