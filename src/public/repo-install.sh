#!/bin/sh
set -eu

REPO_URL="https://argvus.github.io/packages/arch"
KEY_URL="$REPO_URL/argvus.gpg"
REPO_CONF_URL="$REPO_URL/argvus.conf"

KEY_FILE="/tmp/argvus.gpg"
REPO_CONF="/etc/pacman.d/argvus.conf"
PACMAN_CONF="/etc/pacman.conf"

echo "==> Installing ARGVUS repository..."

if [ "$(id -u)" -eq 0 ]; then
    SUDO=""
else
    SUDO="sudo"
fi

echo "==> Downloading signing key..."
curl -fsSLo "$KEY_FILE" "$KEY_URL"

echo "==> Importing signing key..."
$SUDO pacman-key --add "$KEY_FILE"

ARGVUS_KEY="$(
    gpg --show-keys --with-colons "$KEY_FILE" \
        | awk -F: '$1 == "pub" { print $5; exit }'
)"

if [ -z "$ARGVUS_KEY" ]; then
    echo "ERROR: Could not determine ARGVUS signing key." >&2
    exit 1
fi

echo "==> Locally signing ARGVUS key..."
$SUDO pacman-key --lsign-key "$ARGVUS_KEY"

echo "==> Installing repository configuration..."
curl -fsSL "$REPO_CONF_URL" \
    | $SUDO tee "$REPO_CONF" >/dev/null

if ! grep -Fxq "Include = $REPO_CONF" "$PACMAN_CONF"; then
    echo "Include = $REPO_CONF" \
        | $SUDO tee -a "$PACMAN_CONF" >/dev/null
fi

echo "==> ARGVUS repositories configured successfully."
echo "    Enabled: argvus (main) and argvus-extras."
