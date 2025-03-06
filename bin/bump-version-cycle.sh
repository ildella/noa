#!/usr/bin/env bash

set -euo pipefail

cargo release beta --manifest-path tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute
NEW_VERSION=$(grep '^version =' tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
yarn version "$NEW_VERSION"
yarn version "$NEW_VERSION"
git commit -am "Update version for release: $NEW_VERSION"
git push

echo "New version: $NEW_VERSION"
