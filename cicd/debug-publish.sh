#!/usr/bin/env bash

set -euo pipefail

yarn android.build.aarch64 -d
yarn desktop.build.deb -d
./bin/publish.sh debug
