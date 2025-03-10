import {generateSecretKey, getPublicKey} from 'nostr-tools/pure'
import {bytesToHex} from '@noble/hashes/utils'
import * as bip39 from '@scure/bip39'
import {wordlist} from '@scure/bip39/wordlists/english'
import * as nip19 from 'nostr-tools/nip19'
import {liveQuery} from 'dexie'
import {db} from '$lib/db'

import {relays} from '$lib/relays'

const generatePublicAddress = () => {
  const sk = generateSecretKey()
  const publicKey = getPublicKey(sk)
  const secretKey = bytesToHex(sk)
  const nprofile = nip19.nprofileEncode({pubkey: publicKey, relays})
  const address = JSON.stringify({secretKey, publicKey, nprofile})
  localStorage.setItem('address', address)
  return address
}

const generateMnemonic = () => {
  const mnemonic = bip39.generateMnemonic(wordlist)
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid seed')
  }
  localStorage.setItem('mnemonic', mnemonic)
  return mnemonic
}

const mints = [
  'https://mint.minibits.cash/Bitcoin',
  'https://8333.space:3338',
]

const incoming = liveQuery(
  () => db.incoming.toArray()
)

export function load () {
  const localAddress = localStorage.getItem('address')
  const address = localAddress || generatePublicAddress()
  const localMnemonic = localStorage.getItem('mnemonic')
  const mnemonic = localMnemonic || generateMnemonic()
  return {
    address: JSON.parse(address),
    mnemonic,
    incoming,
    relays,
    mints,
  }
}
