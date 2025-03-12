#!/usr/bin/env bash

set -euo pipefail

yarn version patch

NEW_VERSION=$(< "package.json" jq -r .version)
cd tauri
cargo set-version "$NEW_VERSION"
cd ..

git commit -am "Set release: $NEW_VERSION"
git push

GIT_RELEASE_TAG=v"$NEW_VERSION"
echo "Tag $GIT_RELEASE_TAG and push to repo."
git tag "$GIT_RELEASE_TAG"
git push --tags

echo "New version: $NEW_VERSION"
