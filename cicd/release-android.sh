#!/usr/bin/env bash

set -euo pipefail

GIT_TAG_RELEASE=$(< "package.json" jq -r .version)
echo "Build and Publish Android APK to GitHub: v$GIT_TAG_RELEASE"

yarn android.build.aarch64

gh release upload noa-v"$GIT_TAG_RELEASE" tauri/gen/android/app/build/outputs/apk/arm64/release/app-arm64-release.apk
