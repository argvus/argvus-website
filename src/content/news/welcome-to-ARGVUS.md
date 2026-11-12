---
author:
  name: "William C. Canin"
  link: "https://williamcanin.github.io"
title: "Welcome to ARGVUS"
description: "Meet ARGVUS, a modular Arch Linux desktop environment built on Wayland and Hyprland, with integrated settings, appearance, session tools and applications."
date: 2026-11-11
tags: ["welcome", "ARGVUS", "release", "0.1.0"]
---

Today, we are introducing **ARGVUS**: a modular desktop environment for **Arch Linux**, built for **Wayland** and powered by **Hyprland**.

ARGVUS brings the parts of a Linux desktop together: login and session startup, windows and workspaces, a taskbar and quick-control panel, settings, themes, notifications, displays, power, networking and everyday applications. These parts are organized as focused packages that share a common configuration model, so the desktop feels like one system without being one monolithic program.

> **In short:** Arch Linux is the operating system, Hyprland is the Wayland compositor, and ARGVUS coordinates the session and desktop experience around them.

## A desktop made of cooperating parts

The ARGVUS session has a clear path from login to the desktop:

```text
Login or TTY
    ↓
ARGVUS session → Hyprland
    ↓
Taskbar · Control Panel · Notifications · Wallpaper · Idle services
```

The session manager starts and supervises the desktop services. Hyprland manages windows, workspaces and monitors. The taskbar, Control Panel, settings application and focused service packages provide the surfaces you interact with every day.

| Area | What it brings to your desktop |
| --- | --- |
| **Login and sessions** | An ARGVUS greeter, graphical login, TTY startup and managed user services. |
| **Windows and workspaces** | A Hyprland setup with keyboard shortcuts, layouts, monitor handling and shared appearance settings. |
| **Taskbar** | A Waybar-based bar for workspaces, windows and system status, with optional widgets. |
| **Control Panel** | A Quickshell surface for quick actions, session and power controls, and desktop widgets. |
| **Control Center** | A keyboard-first settings application for desktop configuration and administration. |
| **Desktop services** | Focused integrations for displays, networking, Bluetooth, power, notifications, firewall and removable storage. |

Each component owns its own commands and service behavior. That modular design makes it possible to maintain or improve one part without turning the entire desktop into a single tightly coupled application.

## Settings that work together

Changing a setting should have a predictable effect across the desktop. ARGVUS stores appearance and preference state centrally, then applies it to the components that use it. The Control Center gives you a guided place to adjust settings; command-line tools are available when you prefer the terminal.

For example, a theme change can update the compositor, GTK and Qt applications, taskbar, Control Panel, launcher, notifications and lock screen together. You can also choose an accent color and a layout style:

| Style | Feel |
| --- | --- |
| **Sticky** | Compact spacing and a closer fit between windows and desktop surfaces. |
| **Spaced** | Larger gaps, rounded corners, shadows and more breathing room around the shell. |

The visual system includes **23 theme families**, each available in both styles, alongside wallpapers, fonts, icon themes and configurable effects. Choose a ready-made look or tune the accent color to make it yours.

> **A useful distinction:** your selected preferences are the source of truth. Files generated for individual desktop components are projections of that shared state, so make changes through ARGVUS settings or supported commands instead of editing generated output.

## Useful tools, already connected

ARGVUS includes or integrates a range of small conveniences so that common tasks are close at hand:

- **Application launcher:** press `SUPER + D` to find installed graphical applications. Additional keyboard menus can open projects, SSH hosts, snippets, emoji, a calculator and cheatsheets.
- **Display controls:** inspect monitors and adjust settings such as resolution, refresh rate, scale, position and orientation when the active compositor and hardware support them.
- **Power and session actions:** use the Control Panel for immediate actions such as locking, suspending, logging out or shutting down. Configure persistent idle and display behavior in the Control Center.
- **Do Not Disturb:** control notification delivery from the Control Panel; notifications received while it is active are kept for later.
- **Removable devices:** access storage actions from integrated menus and taskbar surfaces.
- **ARGVUS Focus:** run Pomodoro-style focus sessions, breaks and notifications, with a local history.
- **ARGVUS Clock:** use world clocks, a stopwatch, timers and alarms, including snooze and missed-alarm reports.
- **Terminal tools:** open configured terminal profiles, a system monitor and other integrated TUI applications.

Some features are optional packages. For example, programming-agent integrations and games can be added without making them mandatory parts of the base session. AI integrations launch the selected agent in a terminal; ARGVUS does not create accounts or configure API keys or subscriptions for you.

## Get started on Arch Linux

On a fresh Arch Linux installation, the documented quick start is:

```sh
curl -fsSL https://argvus.github.io/install.sh | sh
```

The installer configures the ARGVUS package repository and installs the `argvus` package with its dependencies. Then log out and choose **ARGVUS** in your display manager, or start an ARGVUS session from a TTY.

```sh
# Open the Control Center
argvus --control-center

# Reopen the first-setup guide at any time
argvus welcome
```

ARGVUS is built for **Arch Linux**, **Wayland** and **Hyprland**; it is not a standalone Linux distribution. Check the [installation guide](https://argvus.github.io/docs/getting-started/installation/) for requirements, manual setup and the current package details before installing.

## Explore ARGVUS

Start with the [user documentation](https://argvus.github.io/docs/intro/) for setup and daily use, or explore the [ARGVUS source repository](https://github.com/argvus/argvus) and the [ARGVUS organization on GitHub](https://github.com/argvus/) to discover individual components.

Welcome to a desktop that is modular under the hood and coordinated where it matters. **Welcome to ARGVUS.**
