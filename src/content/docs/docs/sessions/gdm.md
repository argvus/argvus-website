---
title: GDM session
description: Start ARGVUS from GDM or another display manager.
---

After installing, select the **ARGVUS** session in GDM/display manager.

The session launchers are provided by the `argvus-session` package. `argvus-session` prepares the session environment and executes `argvus-start`, which launches Hyprland with `start-hyprland` and loads the Lua config from `~/.config/hypr/hyprland.lua` when the user override exists, otherwise the packaged `/usr/share/argvus/hypr/hyprland.lua`. The user-selected theme and accent in `~/.config` keep loading.

If GDM returns to the login screen, check the logs:

```sh
sed -n '1,320p' ~/.local/state/argvus/session.log
journalctl --user -b -u 'wayland-wm@*' --no-pager
```

On VirtualBox, power off the VM and select **VMSVGA**, at least **128 MB** of video memory, and **Enable 3D Acceleration** under `Settings > Display`. Keep drivers and Mesa up to date on the Arch guest:

```sh
sudo pacman -Syu --needed virtualbox-guest-utils mesa
sudo systemctl enable --now vboxservice.service
```

The launcher detects virtual machines, clears physical GPU overrides, enables the rendering fallbacks accepted by Hyprland, and uses the current packaged Lua. The user-selected theme keeps loading. Hyprland support in VMs still depends on the virtual GPU provided by the hypervisor.

The package does not write to `$HOME` during installation. Defaults live in `/usr/share/argvus/`.
