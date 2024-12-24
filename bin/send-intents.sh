#!/usr/bin/env bash

set -euo pipefail

url='nostrsigner:%7B%22kind%22%3A1%2C%22created_at%22%3A1734031095%2C%22content%22%3A%22Authenticate%20me%22%2C%22tags%22%3A%5B%5D%7D%3FcompressionType%3Dnone%26returnType%3Dsignature%26type%3Dsign_event%26callbackUrl%3Dhttps%3A%2F%2Fchat.frankie-gpt.com%2Fauth%2Fcallback%3Fevent%3D'

xdg-open "$url"

# adb \
#   shell am start \
#   -a android.intent.action.VIEW \
#   -d "$url" \
#   tools.frankie.nostr.noa
