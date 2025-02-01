import {generateSecretKey, getPublicKey} from 'nostr-tools/pure'
import {bytesToHex} from '@noble/hashes/utils'
import * as bip39 from '@scure/bip39'
import {wordlist} from '@scure/bip39/wordlists/english'

const generatePublicAddress = () => {
  const sk = generateSecretKey()
  const publicKey = getPublicKey(sk)
  const secretKey = bytesToHex(sk)
  const address = JSON.stringify({secretKey, publicKey})
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
export function load () {
  const hasAddress = localStorage.getItem('address')
  const address = hasAddress || generatePublicAddress()
  const hasMnemonic = localStorage.getItem('mnemonic')
  const mnemonic = hasMnemonic || generateMnemonic()
  return {
    address: JSON.parse(address),
    mnemonic,
  }
}
