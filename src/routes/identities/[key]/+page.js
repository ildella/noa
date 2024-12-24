import * as nip19 from 'nostr-tools/nip19'

export async function load ({params}) {
  const {key} = params
  const identities = JSON.parse(await localStorage.getItem('identities'))
  const [{secretKey, publicKey}] = identities.filter(({publicKey}) => publicKey === key)
  console.log('selected public key:', publicKey)
  const npub = nip19.npubEncode(publicKey)
  const shortPublicKey = publicKey.slice(0, 12)
  const shortNpub = npub.slice(0, 12)
  // const nprofile = nip19.nprofileEncode({ pubkey: hex, relays })
  return {
    secretKey, publicKey, shortPublicKey, npub, shortNpub,
  }
}
