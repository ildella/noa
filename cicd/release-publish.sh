#!/usr/bin/env bash

set -euo pipefail

yarn desktop.build
yarn android.build.aarch64
./bin/publish.sh
