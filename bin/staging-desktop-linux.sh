#!/usr/bin/env bash

build=${1:-'yes'}
target=debug

echo "Staging $target with build? $build"

desktopTarget=src-tauri/target/$target/bundle
packagesFolder=/var/www/noa/$target
linuxFolder=$packagesFolder/linux
debTargetPath="$linuxFolder"/NOA_amd64-$target.deb
# rpmTargetPath="$linuxFolder"NOA.x86_64-$target.rpm
# appimageTargetPath="$linuxFolder"NOA_amd64-$target.AppImage

mkdir -p "$packagesFolder"/linux

set -euo pipefail

if [ "$build" = "yes" ]; then
  yarn desktop.build.deb -d
else
  echo "Skip build as requested."
fi

VERSION=$(jq -r .version package.json)
APP_NAME=$(jq -r .name package.json)
cat <<EOF > release.json
{
  "name": "$APP_NAME",
  "version": "$VERSION"
}
EOF

echo "Copying to local folders as well."
cp "$desktopTarget"/deb/NOA_"$VERSION"_amd64.deb "$debTargetPath"
# cp "$desktopTarget"rpm/NOA-"$VERSION"-1.x86_64.rpm "$rpmTargetPath"
# cp "$desktopTarget"appimage/NOA_"$VERSION"_amd64.AppImage "$appimageTargetPath"
cp release.json "$packagesFolder"

rm release.json

echo "Completed: $target"

sudo apt install "$debTargetPath" -Vy
