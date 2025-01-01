#!/usr/bin/env bash

set -euo pipefail

CURRENT_VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
echo "Releasing from: $CURRENT_VERSION"

cargo release release --manifest-path src-tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute
RELEASED_VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
echo "Bump package.json -> $RELEASED_VERSION"
yarn version "$RELEASED_VERSION"
## LOL, I know. But it messes up if I run it only once.
yarn version "$RELEASED_VERSION"

echo "Tag $RELEASED_VERSION and push to repo."
git commit -am "Update version for release: $RELEASED_VERSION"
git push
git tag "$RELEASED_VERSION"
git push --tags

echo "New version: $RELEASED_VERSION"
