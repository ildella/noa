#!/usr/bin/env bash

# echo "$ANDROID_KEY_BASE64"
# echo "$ANDROID_KEY_PASSWORD"
# echo "$ANDROID_KEY_ALIAS"

keytool -list -v \
  -keystore ~/upload-keystore.jks \
  -alias "$ANDROID_KEY_ALIAS" \
  -storepass "$ANDROID_KEY_PASSWORD"

set -euo pipefail

cd src-tauri/gen/android
echo "keyAlias=$ANDROID_KEY_ALIAS" > keystore.properties
echo "password=$ANDROID_KEY_PASSWORD" >> keystore.properties
base64 -d <<< "$ANDROID_KEY_BASE64" > ./keystore.jks
echo "storeFile=../keystore.jks" >> keystore.properties

# echo '--- KEYSTORE PROPERTIES FILE CONTENT ---'
# cat keystore.properties
