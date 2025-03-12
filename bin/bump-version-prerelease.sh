#!/usr/bin/env bash

set -euo pipefail

yarn version prerelease
NEW_VERSION=$(< "package.json" jq -r .version)
cd tauri && cargo set-version "$NEW_VERSION"
git commit -am "Bump prerelease for new development cycle: $NEW_VERSION"
# git push

echo "New version: $NEW_VERSION"
