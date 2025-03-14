#!/usr/bin/env bash

set -uo pipefail

# This handler is installed by `yarn tauri dev`. 
# Removed to avoid collision with the installed debug version. 
rm ~/.local/share/applications/NOA-handler.desktop

set -euo pipefail
VERSION=$(grep '^version =' tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
yarn desktop.build.deb -d
sudo dpkg -i tauri/target/debug/bundle/deb/NOA_"$VERSION"_amd64.deb
