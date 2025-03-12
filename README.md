# NOA: Nostr Onboarding App

The simplest possible experience to onboard pre-nostr people to Nostr and let them sign-in to other Nostr services.

NOA is a multi platform app, with [packages](https://github.com/ildella/noa/releases/latest) already available for Android, Linux, Windows and OSX. 

A [Web](https://nostr.frankie.tools/) version is available as well. The Android app can also be installed by [Zapstore](https://zapstore.dev/)

Built on Tauri 2 and Svelte 5.

## Setup

```sh
yarn
```

## Development

Start locally in dev mode:

```sh
yarn web
yarn desktop
yarn android

# You can specify the host, if needed.
yarn android --host 192.168.x.x
```

Build:

```sh
## Check package.json for all available shortcut scripts.

yarn desktop.build
yarn android.build

```

## Onboarding and migration from Legacy platforms

* https://nostr.org/
* Migrate from Twitter: https://exit.pub/
