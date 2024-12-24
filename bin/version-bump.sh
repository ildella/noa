#!/usr/bin/env bash

set -euo pipefail

target=${1:-'patch'}

VERSION=$(jq -r .version package.json)

echo "Tag $VERSION"

git tag "$VERSION"
git push --tags

echo "Update to version $target"

cargo release "$target" --manifest-path src-tauri/Cargo.toml --no-publish --no-tag --no-push --execute
yarn version "$target"
git commit -am "Bump version to $target"
git push

echo "Completed."

NEW_NODE_VERSION=$(jq -r .version package.json)
NEWCARGO_VERSION=$(grep '^version =' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')

echo "New version: $NEWCARGO_VERSION - $NEW_NODE_VERSION"
