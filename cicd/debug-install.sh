#!/usr/bin/env bash

set -euo pipefail

VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
yarn desktop.build.deb -d
sudo dpkg -i src-tauri/target/debug/bundle/deb/NOA_"$VERSION"_amd64.deb

# yarn desktop.build.appimage -d
# ./src-tauri/target/release/bundle/appimage/NOA_"$VERSION"_amd64.AppImage
