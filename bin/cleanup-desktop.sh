#!/usr/bin/env bash

# set -euo pipefail

printf "\n\n--- xdg-mime ---\n"
xdg-mime query default x-scheme-handler/nostrsigner

printf "\n\n--- USER ---\n"
# ls ~/.local/share/applications/NOA-handler.desktop
cat ~/.local/share/applications/NOA-handler.desktop

printf "\n\n--- SYSTEM ---\n"
# ls /usr/share/applications/NOA.desktop
cat /usr/share/applications/NOA.desktop

# rm ~/.local/share/applications/NOA-handler.desktop
# sudo rm /usr/share/applications/NOA.desktop
# sudo update-desktop-database

printf "\n\n--- mimeapps.list ---\n"
cat  ~/.config/mimeapps.list |grep nostrs
