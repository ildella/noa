#!/usr/bin/env bash

set -uo pipefail

target=${1:-'release'}
# params if debug -> -d
params=
VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
echo "Target: $target | version: $VERSION"
# This handler is installed by `yarn tauri dev`. 
# Removed to avoid collision with the installed debug version. 
rm ~/.local/share/applications/NOA-handler.desktop

set -euo pipefail
yarn desktop.build
sudo dpkg -i src-tauri/target/debug/bundle/deb/NOA_"$VERSION"_amd64.deb
