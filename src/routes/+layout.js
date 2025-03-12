import {app} from '@tauri-apps/api'
import {
  onOpenUrl,
  // getCurrent as getCurrentDeepLinkUrls,
} from '@tauri-apps/plugin-deep-link'
import {goto} from '$app/navigation'

// eslint-disable-next-line no-undef
const platform = PLATFORM

/* eslint-disable @stylistic/js/max-len */
const help = {
  welcome: 'We self-generate a new Identity and then fill the associated social Profile.',
  dashboard: 'Your Nostr command center.',
  what: 'We are about to get rid of platform-based communication and go back to protocol-based communication. Like it was with email.',
  why: 'Platforms are built and owned by someone, typically a very large company. They hold the keys and the access to the network and can play as they please. Protocols are public and open, anyone can build on it.',
  identity: 'An Identity is a self-generated digital key pair, here represented as plain text. You have complete control over it.',
  keypair: 'The identity is represented by a key pair: a public key that you can share with others, and a secret key that you keep safe and private.',
  import: 'Import your Nostr identity either by uploading a file or pasting your secret key.',
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
  return {appName: 'NOA', currentVersion: 'Web'}
}

const platforms = [
  'web',
  'ios',
  'android',
  'linux',
  'osx',
  'windows',
]

const loadItentities = () => {
  const identities = JSON.parse(localStorage.getItem('identities'))
  if (!identities)
    return {}
  const [{publicKey: currentProfileHex}] = identities
  return {identities, currentProfileHex}
}

export async function load ({url, route, params}) {
  const detectedLanguage = navigator.language || navigator.userLanguage
  const about = await appInfo()
  const {identities, currentProfileHex} = loadItentities()
  const {pathname} = url
  // console.log('platform:', platform)
  // console.log('url:', url)
  // console.log('pathname:', pathname)
  // console.log('route:', Object.keys(route))
  // console.log('route:', route.id, route.errors)
  // console.log('params:', params.event)
  if (platform) {
    await onOpenUrl(async urls => {
      console.debug('urls:', urls)
      if (!identities || identities.length === 0) {
        console.info('Generate an identity first.')
        return
      }
      const [url] = urls
      // console.log('first url:', url)
      const decoded = decodeURIComponent(url.replaceAll('nostrsigner:', ''))
      if (pathname === '/signer') {
        console.warn('Already on signer page. Ignoring Deep Link.')
        return
      }
      return goto(`/signer/${decoded}`, {replaceState: true})
    })
  }

  return {
    about,
    // eslint-disable-next-line @stylistic/js/max-len
    authorProfile: 'nprofile1qqsfux7stm2pu74zmks7ndjt3wjgk6dmp7445gk5g2jftvdljj5mqvqpz3mhxue69uhhyetvv9ujuerpd46hxtnfduqs6amnwvaz7tmwdaejumr0dsz52mx4',
    chosenLanguage: detectedLanguage,
    help,
    identities,
    currentProfileHex,
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
