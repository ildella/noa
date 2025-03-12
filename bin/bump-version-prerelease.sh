#!/usr/bin/env bash

set -euo pipefail

yarn version patch
yarn version prerelease
NEW_VERSION=$(< "package.json" jq -r .version)
cargo release "$NEW_VERSION" --manifest-path tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute

git commit -am "Bump prerelease for new development cycle: $NEW_VERSION"
git push

echo "New version: $NEW_VERSION"
