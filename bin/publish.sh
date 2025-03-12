#!/usr/bin/env bash

target=${1:-'release'}
echo Target: "$target"

androidTarget=tauri/gen/android/app/build/outputs
desktopBundleFolder=tauri/target/$target/bundle/
apkFilename=app-arm64-$target.apk
apkFilePath="$androidTarget/apk/arm64/$target/$apkFilename"

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

## Not using this anymore, deprecated
# if [ "$target" == "debug" ]; then
#   echo "Copying to local folders as well."
#   cp "$apkFilePath" "$apkTargetPath"
#   cp "$desktopBundleFolder"/deb/NOA_"$VERSION"_amd64.deb "$debTargetPath"
#   cp release.json "$packagesFolder"
# fi

debFilePath="$desktopBundleFolder"deb/NOA_"$VERSION"_amd64.deb
rpmFilePath="$desktopBundleFolder"rpm/NOA-"$VERSION"-1.x86_64.rpm
destinationBase=root@"$FRANKIE_DOMAIN"

echo "
Publishing to $destinationBase
  
  $apkFilePath
  $debFilePath
  $rpmFilePath

"

scp "$apkFilePath" "$destinationBase":"$apkTargetPath"
scp "$debFilePath" "$destinationBase":"$debTargetPath"
scp release.json "$destinationBase":"$packagesFolder"

if [ "$target" == "release" ]; then
  scp "$rpmFilePath" "$destinationBase":"$rpmTargetPath"
  # scp "$desktopBundleFolder"appimage/NOA_"$VERSION"_amd64.AppImage "$destinationBase":"$appimageTargetPath"
  echo "
  Run this to publish to ZapStore:

    $ zapstore publish -a $apkFilePath -v $VERSION

"
fi

rm release.json
echo "Completed: $target"
