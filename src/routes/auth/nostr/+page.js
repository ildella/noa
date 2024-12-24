import {generateSecretKey, getPublicKey} from 'nostr-tools/pure'
import {bytesToHex} from '@noble/hashes/utils'

export function load () {
  const sk = generateSecretKey()
  const publicKey = getPublicKey(sk)
  const secretKey = bytesToHex(sk)
  // const backToBytes = hexToBytes(secretKey)
  localStorage.setItem('identities', JSON.stringify([{secretKey, publicKey}]))
  return {publicKey}
}
