import {app} from '@tauri-apps/api'
import {
  onOpenUrl,
  // getCurrent as getCurrentDeepLinkUrls,
} from '@tauri-apps/plugin-deep-link'

// eslint-disable-next-line no-undef
const platform = PLATFORM

/* eslint-disable @stylistic/js/max-len */
const help = {
  welcome: 'To use Nostr services we create a unique, universal "key" and then install apps of your choice.',
  what: 'We are about to get rid of platform-based communication and go back to protocol-based communication. Like it was with email.',
  why: 'Platforms are built and owned by someone, typically a very large company. They hold the keys and the access to the network and can play as they please. Protocols are public and open, anyone can build on it.',
  identity: 'An Identity is just a self-generated digital key pair, here represented as simple "piece of text". It’s yours alone, and you have complete control over it.',
  keypair: 'The identity is represented by a key pair: a public key that you can share with others, and a secret key that you keep safe and private.',
  // identity: 'It is almost like an email address or a phone number, but there is no central authority involved to issue it. This software will generate a unique one for you. Remember: you are the only one to hold it. Be responsible.',
}
/* eslint-enable @stylistic/js/max-len */

const appInfo = async () => {
  try {
    // console.log(await app.getTauriVersion())
    const appName = await app.getName()
    const currentVersion = await app.getVersion()
    return {appName, currentVersion}
  } catch (error) {
    console.debug('No tauri app:', error.message)
  }
  return {appName: 'NOA', currentVersion: '1000.0.0'}
}

export async function load ({url}) {
  const detectedLanguage = navigator.language || navigator.userLanguage
  const identitiesString = await localStorage.getItem('identities')
  const identities = JSON.parse(identitiesString)
  const {pathname} = url
  if (platform) {
    await onOpenUrl(async urls => {
      if (!identities || identities.length === 0) {
        console.info('Geenrate an identity first.')
        return
      }
      const [url] = urls
      console.debug('url:', url)
      const decoded = decodeURIComponent(url.replaceAll('nostrsigner:', ''))
      console.debug('decoded:', decoded)
      if (pathname === '/signer') {
        console.warn('Already on signer page. Ignoring Deep Link.')
        return
      }
      location.href = `/signer/${decoded}`
    })
  }

  const about = await appInfo()
  const platforms = [
    'web',
    'ios',
    'android',
    'linux',
    'osx',
    'windows',
  ]

  return {
    about,
    // eslint-disable-next-line @stylistic/js/max-len
    authorProfile: 'nprofile1qqsfux7stm2pu74zmks7ndjt3wjgk6dmp7445gk5g2jftvdljj5mqvqpz3mhxue69uhhyetvv9ujuerpd46hxtnfduqs6amnwvaz7tmwdaejumr0dsz52mx4',
    chosenLanguage: detectedLanguage,
    help,
    identities,
    // eslint-disable-next-line no-undef
    platform: PLATFORM,
    platforms,
  }
}

// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
// export const prerender = true
export const ssr = false
