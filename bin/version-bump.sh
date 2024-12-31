#!/usr/bin/env bash

set -euo pipefail

target=${1:-'patch'}

VERSION=$(jq -r .version package.json)

echo "Tag $VERSION"

git tag "$VERSION"
git push --tags

echo "Update to version $target"

# ?? cargo release beta --manifest-path src-tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute
cargo release "$target" --manifest-path src-tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute
# ?? yarn version prerelease
yarn version "$target"

NEW_NODE_VERSION=$(jq -r .version package.json)
NEWCARGO_VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')

git commit -am "New development cycle. Node $NEW_NODE_VERSION | Cargo $NEWCARGO_VERSION"
git push

echo "New version: $NEWCARGO_VERSION - $NEW_NODE_VERSION"
