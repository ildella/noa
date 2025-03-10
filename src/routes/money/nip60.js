import {randomBytes} from '@noble/ciphers/webcrypto'
import {v2} from 'nostr-tools/nip44'

const createNip60Wallet = ({walletSecretHex, identityPublicHex}) => {
  const content = [
    ['balance', '100', 'sat'],
    ['privkey', walletSecretHex],
  ]
  // console.log({secretHex, walletPubHex})
  const conversationKey = v2.utils.getConversationKey(walletSecretHex, identityPublicHex)
  // console.log({conversationKey})
  const nonce = randomBytes(32)
  // console.log({nonce})
  const encryptedContent = v2.encrypt(content, conversationKey, nonce)
  // console.log({encryptedContent})
  const nip60NewWalletEvent = {
    kind: 37375,
    content: encryptedContent,
    tags: [
      ['d', 'noa-test-wallet'],
      ...mints.map(mint => ['mint', mint]),
      ['name', 'NOA embedded NIP-60 wallet'],
      ...relays.map(relay => ['relay', `wss://${relay}`]),
      // ['deleted'],
    ],
  }
  // console.log(walletEvent)
  // const decryptedContent = v2.decrypt(encryptedContent, conversationKey)
  // console.log(decryptedContent)
}
