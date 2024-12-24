import {sha256} from '@noble/hashes/sha256'
import {gcm} from '@noble/ciphers/aes'
import {utf8ToBytes, bytesToUtf8} from '@noble/ciphers/utils'
import {randomBytes} from '@noble/ciphers/webcrypto'

const nonceLength = 24

const encrypt = async ({content, password}) => {
  console.log({password})
  if (!password) return content
  const key = await sha256(new TextEncoder().encode(password))
  const nonce = randomBytes(nonceLength)
  const aes = gcm(key, nonce)
  const bytes = utf8ToBytes(content)
  const encrypted = aes.encrypt(bytes)
  const ciphertext = new Uint8Array(nonce.length + encrypted.length)
  ciphertext.set(nonce, 0)
  ciphertext.set(encrypted, nonce.length)
  return ciphertext
}

const decrypt = async ({arrayBuffer, password}) => {
  const ciphertext = new Uint8Array(arrayBuffer)
  const nonce = ciphertext.slice(0, nonceLength)
  const encrypted = ciphertext.slice(nonceLength)
  const key = await sha256(new TextEncoder().encode(password))
  const aes = gcm(key, nonce)
  const decryptedBytes = aes.decrypt(encrypted)
  return bytesToUtf8(decryptedBytes)
}

export {
  decrypt,
  encrypt,
}
