import {generateSecretKey, getPublicKey} from 'nostr-tools/pure'
import {bytesToHex} from '@noble/hashes/utils'

export async function load () {
  const wallet = await localStorage.getItem('wallet')
  console.log({wallet})
  if (!wallet) {
    const sk = generateSecretKey()
    const publicKey = getPublicKey(sk)
    const secretKey = bytesToHex(sk)
    // const backToBytes = hexToBytes(secretKey)
    const wallet = {secretKey, publicKey}
    localStorage.setItem('wallet', JSON.stringify(wallet))
    return {wallet}
  }
  return {wallet: JSON.parse(wallet)}
}
