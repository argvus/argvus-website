#!/bin/sh
set -eu

REPO_INSTALL_URL="https://argvus.github.io/repo-install.sh"

echo "==> Installing ARGVUS..."

curl -fsSL "$REPO_INSTALL_URL" | sh

if [ "$(id -u)" -eq 0 ]; then
    SUDO=""
else
    SUDO="sudo"
fi

echo "==> Installing ARGVUS packages..."

$SUDO pacman -Syu argvus

echo "==> ARGVUS installation completed."
echo "    Log out and select the ARGVUS session to start using it."
