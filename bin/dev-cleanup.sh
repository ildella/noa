#!/usr/bin/env bash

echo "Cleanup local machine"

printf "\n\n--- xdg-mime ---\n"
xdg-mime query default x-scheme-handler/nostrsigner

printf "\n"
ls ~/.local/share/applications/NOA-handler.desktop
printf "\n--- USER ---\n"
cat ~/.local/share/applications/NOA-handler.desktop

printf "\n"
ls /usr/share/applications/NOA.desktop
printf "\n--- SYSTEM ---\n"
cat /usr/share/applications/NOA.desktop

printf "\n\n--- mimeapps.list ---\n"
cat  ~/.config/mimeapps.list |grep nostrs

# rm ~/.local/share/applications/NOA-handler.desktop
# sudo rm /usr/share/applications/NOA.desktop
# sudo update-desktop-database