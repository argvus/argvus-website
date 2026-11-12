---
author:
  name: William C. Canin
  link: https://williamcanin.github.io
title: Bienvenue sur ARGVUS
description: Découvrez ARGVUS, un environnement de bureau modulaire pour Arch Linux, fondé sur Wayland et Hyprland, avec des réglages, une gestion de l’apparence, des outils de session et des applications intégrés.
date: 2026-11-11
tags:
  - welcome
  - ARGVUS
  - release
  - 0.1.0
---


Aujourd’hui, nous vous présentons **ARGVUS** : un environnement de bureau modulaire pour **Arch Linux**, conçu pour **Wayland** et propulsé par **Hyprland**.

ARGVUS réunit les différentes composantes d’un bureau Linux : la connexion et le démarrage de session, les fenêtres et espaces de travail, une barre des tâches et un panneau de commandes rapides, les réglages, les thèmes, les notifications, les écrans, l’alimentation, le réseau et les applications du quotidien. Ces éléments sont organisés en paquets spécialisés qui partagent un modèle de configuration commun. Le bureau forme ainsi un ensemble cohérent sans devenir un programme monolithique.

> **En bref :** Arch Linux est le système d’exploitation, Hyprland est le compositeur Wayland, et ARGVUS coordonne la session et l’expérience de bureau autour de ces deux éléments.

## Un bureau composé d’éléments qui coopèrent

La session ARGVUS suit un parcours clair, de la connexion jusqu’au bureau :

```text
Connexion ou TTY
    ↓
Session ARGVUS → Hyprland
    ↓
Barre des tâches · Panneau de commandes · Notifications · Fond d’écran · Services d’inactivité
```

Le gestionnaire de session démarre les services du bureau et en supervise le fonctionnement. Hyprland gère les fenêtres, les espaces de travail et les écrans. La barre des tâches, le panneau de commandes, l’application de réglages et les paquets de services spécialisés fournissent les interfaces que vous utilisez chaque jour.

| Domaine | Ce qu’il apporte au bureau |
| --- | --- |
| **Connexion et sessions** | Un écran d’accueil ARGVUS, une connexion graphique, le démarrage depuis un TTY et des services utilisateur gérés. |
| **Fenêtres et espaces de travail** | Une configuration Hyprland avec raccourcis clavier, dispositions, gestion des écrans et réglages d’apparence partagés. |
| **Barre des tâches** | Une barre basée sur Waybar pour les espaces de travail, les fenêtres et l’état du système, avec des widgets facultatifs. |
| **Panneau de commandes** | Une interface Quickshell pour les actions rapides, les commandes de session et d’alimentation, ainsi que des widgets de bureau. |
| **Centre de contrôle** | Une application de réglages privilégiant le clavier pour configurer et administrer le bureau. |
| **Services de bureau** | Des intégrations spécialisées pour les écrans, le réseau, le Bluetooth, l’alimentation, les notifications, le pare-feu et les supports amovibles. |

Chaque composant possède ses propres commandes et son propre comportement de service. Cette conception modulaire permet de maintenir ou d’améliorer une partie sans transformer tout le bureau en une application fortement interdépendante.

## Des réglages qui fonctionnent ensemble

Un réglage devrait produire un effet prévisible dans tout le bureau. ARGVUS stocke de façon centralisée l’état de l’apparence et des préférences, puis l’applique aux composants concernés. Le Centre de contrôle propose un espace guidé pour modifier les réglages ; des outils en ligne de commande sont également disponibles si vous préférez le terminal.

Par exemple, un changement de thème peut mettre à jour ensemble le compositeur, les applications GTK et Qt, la barre des tâches, le panneau de commandes, le lanceur, les notifications et l’écran de verrouillage. Vous pouvez aussi choisir une couleur d’accentuation et un style de disposition :

| Style | Aspect |
| --- | --- |
| **Sticky** | Espacements compacts et fenêtres plus proches des surfaces du bureau. |
| **Spaced** | Marges plus importantes, coins arrondis, ombres et davantage d’espace autour de l’interface. |

Le système visuel comprend **23 familles de thèmes**, chacune disponible dans les deux styles, ainsi que des fonds d’écran, des polices, des thèmes d’icônes et des effets configurables. Choisissez un style prêt à l’emploi ou ajustez la couleur d’accentuation selon vos goûts.

> **À distinguer :** les préférences que vous choisissez constituent la source de vérité. Les fichiers générés pour chaque composant du bureau sont des projections de cet état partagé. Modifiez donc les réglages depuis ARGVUS ou avec les commandes prises en charge, au lieu de modifier les fichiers générés.

## Des outils pratiques, déjà intégrés

ARGVUS inclut ou intègre plusieurs petites fonctions pratiques pour garder les tâches courantes à portée de main :

- **Lanceur d’applications :** appuyez sur `SUPER + D` pour rechercher les applications graphiques installées. Des menus clavier supplémentaires peuvent ouvrir des projets, des hôtes SSH, des extraits, des emoji, une calculatrice et des fiches de référence.
- **Commandes d’affichage :** consultez les écrans et réglez des paramètres comme la résolution, la fréquence de rafraîchissement, la mise à l’échelle, la position et l’orientation, si le compositeur actif et le matériel le permettent.
- **Alimentation et session :** utilisez le panneau de commandes pour verrouiller, suspendre, fermer la session ou éteindre immédiatement. Configurez le comportement persistant de l’inactivité et des écrans dans le Centre de contrôle.
- **Ne pas déranger :** gérez la réception des notifications depuis le panneau de commandes ; celles reçues pendant l’activation de cette fonction sont conservées pour plus tard.
- **Périphériques amovibles :** accédez aux actions de stockage depuis les menus intégrés et les interfaces de la barre des tâches.
- **ARGVUS Focus :** lancez des séances de concentration de type Pomodoro, des pauses et des notifications, avec un historique local.
- **ARGVUS Clock :** utilisez des horloges mondiales, un chronomètre, des minuteurs et des alarmes, avec répétition et rapports d’alarmes manquées.
- **Outils de terminal :** ouvrez des profils de terminal configurés, un moniteur système et d’autres applications TUI intégrées.

Certaines fonctionnalités sont proposées sous forme de paquets facultatifs. Par exemple, les intégrations d’agents de programmation et les jeux peuvent être ajoutés sans faire partie obligatoirement de la session de base. Les intégrations d’IA lancent l’agent choisi dans un terminal ; ARGVUS ne crée pas de comptes et ne configure pas de clés API ni d’abonnements à votre place.

## Démarrer sur Arch Linux

Sur une nouvelle installation d’Arch Linux, le démarrage rapide documenté est le suivant :

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

Le programme d’installation configure le dépôt de paquets ARGVUS et installe le paquet `argvus` avec ses dépendances. Déconnectez-vous ensuite et choisissez **ARGVUS** dans votre gestionnaire d’affichage, ou démarrez une session ARGVUS depuis un TTY.

```sh
# Ouvrir le Centre de contrôle
argvus --control-center

# Relancer le guide de première configuration à tout moment
argvus welcome
```

ARGVUS est conçu pour **Arch Linux**, **Wayland** et **Hyprland** ; ce n’est pas une distribution Linux autonome. Consultez le [guide d’installation](https://argvus.github.io/docs/getting-started/installation/) pour connaître les prérequis, la configuration manuelle et les détails actuels des paquets avant l’installation.

## Découvrir ARGVUS

Commencez par la [documentation utilisateur](https://argvus.github.io/docs/intro/) pour la configuration et l’utilisation quotidienne, ou explorez le [dépôt source d’ARGVUS](https://github.com/argvus/argvus) et l’[organisation ARGVUS sur GitHub](https://github.com/argvus/) pour découvrir les différents composants.

Bienvenue dans un bureau modulaire en coulisses et coordonné là où cela compte. **Bienvenue sur ARGVUS.**
