---
title: Environment
description: How the ARGVUS desktop environment is organized.
---

ARGVUS is a complete desktop, ready to use, focused on Hyprland. The desktop configuration lives in the [`argvus`](https://github.com/argvus/argvus) repository and is packaged as the `argvus` Arch Linux package.

The package installs read-only defaults under `/usr/share/argvus` and the optional `argvus-setup` copy helper under `/usr/bin`. It never writes to `$HOME`.

## Component packages

The desktop is split into focused packages, all built by `argvus-pkgbuild` and published to the same repository:

| Package | Owns |
| --- | --- |
| `argvus` | Desktop configuration under `/usr/share/argvus` and the optional `/usr/bin/argvus-setup` helper. |
| `argvus-session` | Session launchers `/usr/bin/argvus-session`, `/usr/bin/argvus-start`, `/usr/bin/argvus-tty` and `/usr/share/wayland-sessions/argvus.desktop`. |
| `argvus-appearance` | Shared wallpapers under `/usr/share/backgrounds/argvus` and bundled fonts under `/usr/share/fonts`. |
| `argvus-storage` | The removable-storage Waybar module (binary, config and themes). |
| `argvus-calendar` | The native calendar popup for Waybar (binary, config and themes). |
| `argvus-greeter` | The greetd greeter integration. |

Installing `argvus` pulls in the other component packages as dependencies.
