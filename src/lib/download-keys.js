import {save} from '@tauri-apps/plugin-dialog'
import {writeTextFile, BaseDirectory} from '@tauri-apps/plugin-fs'
import {getPublicKey} from 'nostr-tools/pure'
import * as nip19 from 'nostr-tools/nip19'

import {encrypt, decrypt} from './cipher'

const {Download} = BaseDirectory
const defaultPath = 'nostr-keys'

const askForPath = () => {
  try {
    return save({
      directory: true,
      defaultPath,
      // defaultPath: `${Download}/${defaultPath}`,
      // filters: [
      //   {
      //     name: 'Text',
      //     extensions: ['txt'],
      //   },
      // ],
    })
  } catch (error) {
    console.warn(error)
    console.debug('Fallback to default path:', defaultPath)
    return defaultPath
  }
}

// eslint-disable-next-line no-undef
const platform = PLATFORM

export const downloadFile = async ({secretKey, publicKey, password}) => {
  const content = JSON.stringify({secretKey, publicKey})
  const ciphertext = await encrypt({content, password})
  if (platform) {
    console.log('defaultPath:', defaultPath)
    const path = await askForPath()
    console.log('path:', path)
    return writeTextFile(path, ciphertext, {baseDir: Download})
  }
  const blob = new Blob([ciphertext], {type: 'application/octet-stream'})
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = defaultPath
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const uploadFile = ({file, password}) => {
  const reader = new FileReader()
  reader.onload = async ({target: {result: arrayBuffer}}) => {
    try {
      const content = await decrypt({arrayBuffer, password})
      console.debug(content)
      localStorage.setItem('identities', `[${content}]`)
      // TODO: horror, pass the listener as param
      location.href = '/'
    } catch (error) {
      console.error('Decryption failed:', error)
    }
  }
  reader.readAsArrayBuffer(file)
}

export const importSecretKey = ({secretKey: nsec}) => {
  // console.log(nsec)
  const {type, data: hex} = nip19.decode(nsec)
  console.log(hex)
  const publicKey = getPublicKey(hex)
  console.log(publicKey)
  localStorage.setItem('identities', JSON.stringify([{secretKey: hex, publicKey}]))
  return true
}
