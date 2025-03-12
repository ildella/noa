#!/usr/bin/env bash

set -euo pipefail

CURRENT_VERSION=$(grep '^version =' tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
echo "Releasing from: $CURRENT_VERSION"

cargo release release --manifest-path tauri/Cargo.toml --no-publish --no-tag --no-push --no-confirm --execute
RELEASED_VERSION=$(grep '^version =' tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
echo "Bump package.json -> $RELEASED_VERSION"
yarn version "$RELEASED_VERSION"
## LOL, I know. But it messes up if I run it only once.
yarn version "$RELEASED_VERSION"
git commit -am "Update version for release: $RELEASED_VERSION"
git push

GITHUB_RELEASE_TAG=v"$RELEASED_VERSION"
echo "Tag $GITHUB_RELEASE_TAG and push to repo."
git tag "$GITHUB_RELEASE_TAG"
git push --tags

echo "
  Release $GITHUB_RELEASE_TAG is ready.

  To create a GitHub release and trigger the bundle build:

    $ gh release create $GITHUB_RELEASE_TAG --generate-notes
"
