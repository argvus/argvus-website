<!-- markdownlint-disable MD033 -->

# ARGVUS

> Under development

## Introduction

ARGVUS is a complete, ready-to-use desktop environment focused on [Hyprland](https://hypr.land), packaged for [Arch Linux](https://archlinux.org).

It is not just a personal configuration: the project assembles a rich, integrated Wayland environment with a top [Waybar](https://github.com/Alexays/Waybar) bar, [Rofi](https://github.com/davatorium/rofi) and [Wofi](https://hg.sr.ht/~scoopta/wofi) launchers, a system information sidebar built with [Quickshell](https://quickshell.outfoxxed.de)/QML, a Rust-powered removable storage manager for Waybar, and a native calendar popup. Eight theme families — dark, dark silver, light and slate (plus their float variants) — unify GTK, terminal, rofi, dunst, waybar and Hyprland itself, all driven by a shared accent-color system.

The desktop is split into focused component packages: `argvus` (configuration), `argvus-session` (session launchers), `argvus-appearance` (wallpapers and fonts), `argvus-storage`, `argvus-calendar` and `argvus-greeter`.

## Themes and accent colors

Available themes: `argvus-dark`, `argvus-dark-float`,
`argvus-dark-silver`, `argvus-dark-silver-float`, `argvus-light`,
`argvus-light-float`, `argvus-slate` and `argvus-slate-float`. Accent
changes affect borders, titles, selections, and other highlights without
replacing the theme background.

Open the selector with `SUPER + SHIFT + A`, use the **Accent** control in the
sidebar, or run:

```sh
~/.config/argvus/sh/accent-switch.sh
```

You can also apply one of the supported colors directly:

```sh
~/.config/argvus/sh/accent-switch.sh '#17d174'
```

Palette: `#996548`, `#3590bd`, `#7391a5`, `#17d174`, `#cb17d1`, `#d1174f`,
`#d1ce17`, `#9617d1` and `#595959`. The default accents are `#3590bd` for
Dark, `#595959` for Dark Silver, `#181818` for Light, and `#7391a5` for
Slate. Switching themes replaces any custom accent with the selected theme's
default.

Dark themes use `default.png`; Light uses `argvus-light.png`; Slate uses
`argvus-slate.png`; and Dark Silver uses `argvus-dark-silver.png`. Normal and
Float variants in each family share the same wallpaper.

## Weather

The weather card uses automatic IP detection by default. Use its **Configure**
button or `SUPER + SHIFT + W` to choose a city through Rofi. Select
**Automatic (by IP)** to restore automatic detection.

## Install

Packages are published to the public [argvus/packages](https://github.com/argvus/packages) repository, served by GitHub Pages at `https://argvus.github.io/packages/`. The `argvus` package and its dependencies are published to the same pacman repository — including the vendored packages (`pwvucontrol`, `snappy-switcher` and `wlogout`) and the official component packages `argvus-appearance`, `argvus-calendar`, `argvus-greeter`, `argvus-session` and `argvus-storage` — so plain `pacman` resolves everything automatically.

Add the repository and install:

```sh
curl -fsSL https://argvus.github.io/packages/arch/argvus.conf \
  | sudo tee /etc/pacman.d/argvus.conf
echo "Include = /etc/pacman.d/argvus.conf" | sudo tee -a /etc/pacman.conf
sudo pacman -Syu argvus
```

## Update

```sh
curl -fsSL https://argvus.github.io/packages/arch/argvus.conf \
  | sudo tee /etc/pacman.d/argvus.conf
sudo pacman -Syu argvus
```

## Remove

```sh
sudo pacman -Rns argvus
sudo sed -i '\|^Include = /etc/pacman.d/argvus.conf$|d' /etc/pacman.conf
sudo rm -f /etc/pacman.d/argvus.conf
sudo pacman -Syy
```

## GDM session

After installing, select the **ARGVUS** session in GDM/display manager. The session launchers are provided by the `argvus-session` package. `argvus-session` prepares the environment and starts Hyprland with `start-hyprland`, loading the Lua config from `~/.config/hypr/hyprland.lua` when the user override exists, otherwise the packaged `/usr/share/argvus/hypr/hyprland.lua`, which still reads the theme and accent chosen in `~/.config`.

If GDM returns to the login screen, check the logs:

```sh
sed -n '1,320p' ~/.local/state/argvus/session.log
journalctl --user -b -u 'wayland-wm@*' --no-pager
```

On VirtualBox, power off the VM and select **VMSVGA**, at least **128 MB** of
video memory, and **Enable 3D Acceleration** under `Settings > Display`. Keep
drivers and Mesa up to date on the Arch guest:

```sh
sudo pacman -Syu --needed virtualbox-guest-utils mesa
sudo systemctl enable --now vboxservice.service
```

The launcher detects virtual machines, clears physical GPU overrides, enables
the rendering fallbacks accepted by Hyprland, and uses the current packaged
Lua. The user-selected theme keeps loading. Hyprland support in VMs still
depends on the virtual GPU provided by the hypervisor.

The package does not write to `$HOME` during installation. Defaults live in `/usr/share/argvus/`.

## Updating User Configs

ARGVUS does not copy dotfiles into `$HOME` before the desktop can start.
Runtime entrypoints read packaged defaults from `/usr/share/argvus` and user
overrides from `~/.config`.

`argvus-setup` is optional. Use it only when you want to copy packaged
defaults into your user config for customization:

```sh
argvus-setup --copy hypr
argvus-setup --copy waybar
argvus-setup --copy-all
```

Once copied, files are user-owned overrides that package upgrades never
replace. To refresh an existing config with the current package defaults, run
`argvus-setup --copy <app> --force`; the previous directory is backed up as
`~/.config/<app>.bak-<timestamp>`.

## TTY (without display manager)

ARGVUS can be started directly from a bare TTY without GDM or any
other display manager. The package does not start Hyprland automatically after
TTY login; the user decides when to start the session.

### How it works

After logging in on the TTY with your username and password, run:

```sh
argvus-tty
```

This command handles everything a display manager would normally do before
starting Hyprland:

- Registers the session with logind (`loginctl open-session`)
- Starts the D-Bus session bus
- Sets the environment variables (XDG, Qt, Electron, Wayland)
- Launches Hyprland

On exit, the script cleans up (D-Bus, logind) and returns to the TTY.

### Setup

To use without a display manager, disable GDM if it is active and reboot:

```sh
sudo systemctl disable gdm
sudo reboot
```

Log in with your username and password at the TTY login screen. Then start the
environment manually:

```sh
argvus-tty
```

For diagnostics:

```sh
argvus-tty --status
```

### Optional auto-start

The package does not configure TTY autologin and does not start Hyprland
automatically by default. If you want the environment to start automatically
after you log in manually on the TTY, add your own rule to `~/.bash_profile`
or `~/.zprofile`:

```sh
# ~/.bash_profile
if [ -z "${DISPLAY:-}" ] && [ -z "${WAYLAND_DISPLAY:-}" ] && [ "${XDG_VTNR:-}" = "1" ]; then
  exec argvus-tty
fi
```

There is also an opt-in profile shipped at `/usr/share/argvus/argvus/profile`. Copy it to `~/.config/argvus/profile` with `argvus-setup --copy argvus` and source it:

```sh
# ~/.bash_profile
[ -f ~/.config/argvus/profile ] && . ~/.config/argvus/profile
```

The profile auto-starts `argvus-tty` on the configured VT (default `1`) when no display manager is running. To disable it, export `ARGVUS_TTY_DISABLE=1`; to use a different VT, export `ARGVUS_TTY_VT=2`.

### Logs

TTY session logs are stored at:

```sh
cat ~/.local/state/argvus/tty.log
cat ~/.local/state/argvus/session.log
```

## Removable storage (Waybar)

The package ships `argvus-storage`, a Rust program that watches removable
storage over UDisks2 (D-Bus, zero polling) and feeds a compact Waybar module.

### Usage

The module comes pre-configured in the recording/microphone/audio group. The
bar shows a single Font Awesome icon when removable devices exist; when no
device is present the module hides. The Waybar tray is reserved for apps that
publish tray icons, such as Telegram and Steam.

| Button | Action |
|---|---|
| Left | Choose a device and open it in the file manager |
| Right | Context menu (Open/Mount/Unmount/Eject/Power Off/Unlock/Lock/Copy) |

### Commands

```sh
argvus-storage once      # print one JSON line and exit
argvus-storage list      # list removable volumes
argvus-storage devices   # choose a device and open it in the file manager
argvus-storage menu      # context menu (rofi/wofi/dmenu)
argvus-storage unmount   # actions: open mount unmount eject poweroff lock unlock copy
```

### Configuration

Defaults live in `/etc/argvus-storage/config.json` and
`/etc/argvus-storage/theme.css`. To customize, copy them to
`~/.config/argvus-storage/`.
Options: `show_name`, `show_capacity`, `hide_when_empty`, `show_hidden`,
`max_devices`, `sort` (`mount_time` | `insertion` | `name` | `size`),
`separator`, `format`, `tooltip_format`, `file_manager_command`,
`open_command` (compatibility alias), `copy_command`, `unlock_command`,
`menu` (`rofi` | `wofi` | `dmenu`), `menu_flags` and `icons`.

For LUKS volumes, `unlock_command` (default `kitty -e`) opens a terminal for
the passphrase. Runtime dependencies: `udisks2`, `glib2`, `rofi`/`wofi`/
`dmenu`, `wl-clipboard` and `libnotify`.

## Calendar (Waybar)

The `argvus-calendar` package ships the native ARGVUS calendar popup for
Wayland/Hyprland, written in Rust with Relm4 and GTK4 and positioned with
`gtk4-layer-shell`. Click the date in the Waybar top bar to toggle it.

It provides SQLite storage, ICS import/export, configurable reminders and an
internal CalDAV/WebDAV client foundation. Configuration lives in
`/etc/argvus-calendar/config.toml` and is edited with `argvus-calendar config`.
Reminders run through `argvus-calendar service` or the shipped user systemd
unit:

```sh
systemctl --user enable --now argvus-calendar.service
```

See [Calendar](/docs/calendar/) for the full usage and configuration.

## Repositories

The project is split across several repositories under the `argvus` organization:

- [argvus](https://github.com/argvus/argvus): desktop configuration (config, bin/argvus-setup, share).
- [argvus-session](https://github.com/argvus/argvus-session): session launchers and the Wayland session entry.
- [argvus-appearance](https://github.com/argvus/argvus-appearance): shared wallpapers and bundled fonts.
- [argvus-storage](https://github.com/argvus/argvus-storage): Rust removable-storage program.
- [argvus-calendar](https://github.com/argvus/argvus-calendar): Rust calendar popup for Waybar.
- [argvus-greeter](https://github.com/argvus/argvus-greeter): greetd greeter integration.
- [argvus-pkgbuild](https://github.com/argvus/argvus-pkgbuild): Arch PKGBUILDs for the desktop, its components and vendored dependencies.
- [packages](https://github.com/argvus/packages): binary package repository served at `https://argvus.github.io/packages/`.
- **site-src** (this repository): the Astro source of the site.
- [argvus.github.io](https://github.com/argvus/argvus.github.io): the published static site.

## Packaging

The site source lives in this repository (`site-src`); the published output lives in the `main` branch of [argvus.github.io](https://github.com/argvus/argvus.github.io):

- `site-src`: Astro site and Ruby publishing scripts.
- `argvus.github.io#main`: generated static site only.
- `packages#main`: `.pkg.tar.zst` packages and Arch repository metadata.

The Arch manifests live in [argvus-pkgbuild](https://github.com/argvus/argvus-pkgbuild). The packaging workflow in that repository builds the packages and publishes them to [packages](https://github.com/argvus/packages), under `arch/`. The site deploy workflow (this repository) builds the Astro site and mirrors `dist/` to [argvus.github.io](https://github.com/argvus/argvus.github.io). See [Packaging](/docs/packaging/) for the full flow.

## License

See [LICENSE](LICENSE).
