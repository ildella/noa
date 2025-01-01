#!/usr/bin/env bash

set -euo pipefail

yarn desktop.build.deb -d
VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
sudo dpkg -i src-tauri/target/debug/bundle/deb/NOA_"$VERSION"_amd64.deb
