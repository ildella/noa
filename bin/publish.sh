#!/usr/bin/env bash

target=${1:-'release'}
echo Target: "$target"

androidTarget=tauri/gen/android/app/build/outputs
desktopTarget=tauri/target/$target/bundle/
apkFilename=app-arm64-$target.apk
apkSourcePath="$androidTarget/apk/arm64/$target/$apkFilename"

packagesFolder=/var/www/noa/$target
apkFolder=$packagesFolder/apk/
linuxFolder=$packagesFolder/linux/
apkTargetPath="$apkFolder""noa-$apkFilename"
debTargetPath="$linuxFolder"NOA_amd64-$target.deb
# appimageTargetPath="$linuxFolder"NOA_amd64-$target.AppImage
rpmTargetPath="$linuxFolder"NOA.x86_64-$target.rpm

mkdir -p "$packagesFolder"/apk
mkdir -p "$packagesFolder"/linux

set -euo pipefail

VERSION=$(jq -r .version package.json)
APP_NAME=$(jq -r .name package.json)
cat <<EOF > release.json
{
  "name": "$APP_NAME",
  "version": "$VERSION"
}
EOF

if [ "$target" == "debug" ]; then
  echo "Copying to local folders as well."
  cp "$apkSourcePath" "$apkTargetPath"
  cp "$desktopTarget"/deb/NOA_"$VERSION"_amd64.deb "$debTargetPath"
  cp release.json "$packagesFolder"
fi

scp "$apkSourcePath" root@"$FRANKIE_DOMAIN":"$apkTargetPath"
scp "$desktopTarget"deb/NOA_"$VERSION"_amd64.deb root@"$FRANKIE_DOMAIN":"$debTargetPath"
scp release.json root@"$FRANKIE_DOMAIN":"$packagesFolder"

if [ "$target" == "release" ]; then
  scp "$desktopTarget"rpm/NOA-"$VERSION"-1.x86_64.rpm root@"$FRANKIE_DOMAIN":"$rpmTargetPath"
  # scp "$desktopTarget"appimage/NOA_"$VERSION"_amd64.AppImage root@"$FRANKIE_DOMAIN":"$appimageTargetPath"
  echo "Run this to publish to ZapStore:"
  echo "zapstore publish -a $apkSourcePath -v $VERSION"
fi

rm release.json
echo "Completed: $target"
