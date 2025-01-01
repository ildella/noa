#!/usr/bin/env bash

# set -euo pipefail

xdg-mime query default x-scheme-handler/nostrsigner

ls ~/.local/share/applications/NOA-handler.desktop
ls /usr/share/applications/NOA.desktop

# rm ~/.local/share/applications/NOA-handler.desktop
# sudo rm /usr/share/applications/NOA.desktop
# sudo update-desktop-database

cat  ~/.config/mimeapps.list |grep nostrs
