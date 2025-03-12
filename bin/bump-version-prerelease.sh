#!/usr/bin/env bash

set -euo pipefail

yarn version patch
yarn version prerelease
NEW_VERSION=$(< "package.json" jq -r .version)
git commit -am "Bump prerelease for new development cycle: $NEW_VERSION"
git push
cargo release "$NEW_VERSION" --manifest-path tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute

echo "New version: $NEW_VERSION"
