<script>
  import {onMount} from 'svelte'
  import {sha256} from '@noble/hashes/sha256'
  import {bytesToHex, hexToBytes} from '@noble/hashes/utils'
  import {gcm} from '@noble/ciphers/aes'
  import {utf8ToBytes} from '@noble/ciphers/utils'
  import {randomBytes} from '@noble/ciphers/webcrypto'

  import * as nip19 from 'nostr-tools/nip19'

  let npub = $state()
  let nsec = $state()

  const mints = ['https://8333.space:3338']
  const relays = ['wss://relay1.example.com', 'wss://relay2.example.com']

  let connections = $state([])

  const decryptContent = async encryptedText => {
  // const bufferData = Buffer.from(encryptedText, 'hex')
    // const iv = bufferData.slice(0, 12) // Extract IV used during encryption
    // const ciphertext = bufferData.slice(12)
    // return JSON.parse(await gcm.decrypt(nsec, iv, ciphertext))
  }

  const receiveToken = async tokenData => {
    const decryptedTokenData = await decryptContent(tokenData.content)

    console.log('Received Token Data:', decryptedTokenData)

  // Process token data here...
  }

  const handleMessage = message => {
    const eventObject = JSON.parse(message)

    if (eventObject.kind === 7375) {
      receiveToken(eventObject)
    } else {
      console.log('Unhandled Message:', eventObject)
    }
  }

  const connectToRelays = async () => {
    connections = await Promise.all(
      relays.map(relay => new Promise((resolve, reject) => {
        const ws = new WebSocket(relay)
        ws.onopen = () => {
          console.log(`Connected to ${relay}`)
          resolve(ws)
        }
        ws.onmessage = message => handleMessage(message.data)
        ws.onerror = error => {
          console.error(`Error on ${relay}:`, error)
          reject(error)
        }
      }))
    )
  }

  const encryptContent = content => {
    // const iv = crypto.getRandomValues(new Uint8Array(12)) // Generate random IV
    // const encryptedBytes = await gcm.encrypt(nsec, iv, JSON.stringify(content))
    // return Buffer.concat([iv, encryptedBytes]).toString('hex') // Prepend IV for decryption later
    const key = randomBytes(32)
    const nonce = randomBytes(24)
    const data = utf8ToBytes(content)
    const aes = gcm(key, nonce)
    const ciphertext = aes.encrypt(data)
    return aes.decrypt(ciphertext)
  }

  const createNip60Wallet = async () => {
    const content = [
      ['balance', '100', 'sat'],
      ['privkey', nsec],
    ]

    const encryptedContent = encryptContent(content)
    console.log({encryptContent})

    const walletEvent = {
      kind: 37375,
      content: encryptedContent,
      tags: [
        ['d', 'noa-test-wallet'],
        ...mints.map(mint => ['mint', mint]),
      // Add other tags as needed like name, description etc.
      ],
    }

    await Promise.all(connections.map(conn => conn.send(JSON.stringify(walletEvent))))

    console.log('Wallet event published:', walletEvent)
  }

  import {CashuMint, CashuWallet, MintQuoteState} from '@cashu/cashu-ts'
  // import * as bip39 from 'bip39'
  import * as bip39 from '@scure/bip39'
  import {wordlist} from '@scure/bip39/wordlists/english'

  // const mintQuote = {
    //   expiry: null,
    //   paid: true,
    //   pubkey: 'npub1z4vdnms0r2m0txrd8z8k8x74rrkusxtdvwgjsf9nslvrdz8wrlts7rvy2k',
    //   quote: 'zW0snEmQKEXHzdrM7RacdrPfDsx6Pj1E0SLeimRB',
    //   request: 'lnbc1u1pnemq6ppp53p8qenstznv8kr3r2fedjqxzr0dy7xxq90xscc7xt4qzc8ekuwqsdq8w3jhxaqcqzpuxqr8pqsp5qhtxh4atyja40h7ue4r68q72vpc6dlmquxwfzz8ecrlvqlkshu2s9qxpqysgq2kza4zprdefpguf756nptpn0xzfnsswjreqmujdxpq94rczd3k59f4mepycsqys34zktykql3dngdhl395u42hwapacy27yhkzks0zqq932fvc',
    //   state: 'PAID',
    // }

  // const mintUrl = 'https://8333.space:3338'
  const mintUrl = 'https://mint.minibits.cash/Bitcoin'
  // const mnemonic = ''
  // const mnemonic = bip39.generateMnemonic()
  // if (!bip39.validateMnemonic(mnemonic, wordlist)) {
  //   throw new Error('Invalid seed')
  // }
  const mint = new CashuMint(mintUrl)

  const createCashuWallet = async () => {
    // const bip39seed = await bip39.mnemonicToSeed(mnemonic)
    // console.log(bip39seed instanceof Uint8Array, bip39seed)
    const wallet = new CashuWallet(mint, {})
    // console.log(wallet.keys, wallet.keysets)
    // console.log(wallet.keys.get('00500550f0494146'))
    // const info = await wallet.getMintInfo()
    // console.log(info.contact)
    // console.log(info.nuts)
    // console.log(info.version)
    await wallet.loadMint()
    // const mintQuote = await wallet.createMintQuote(64)
    const mintQuote = {
      expiry: null,
      paid: true,
      pubkey: 'npub1z4vdnms0r2m0txrd8z8k8x74rrkusxtdvwgjsf9nslvrdz8wrlts7rvy2k',
      quote: 'BNlt-xjMzvoPhYOXX8ZJZG8ZEXU70YaXnbYdOSXa',
      request: 'lnbc1u1pnemqlapp59r5spakkcpf32trxw82hv79v9yt28cp2ehduusgg53k4reauwcesdq8w3jhxaqcqzzsxqyz5vqrzjqvueefmrckfdwyyu39m0lf24sqzcr9vcrmxrvgfn6empxz7phrjxvrttncqq0lcqqyqqqqlgqqqqqqgq2qsp5dsaqlt555vq6qnyqlcr7cekvke6t74pe3f3ej2yusapee9xkza7s9qxpqysgqp936mmmr296wxtdw044tn3kxqfhjthuxstwuj5gkfvejaadwqfdyqxud68tc6kr0spcjqp90dagwf5dlx6rmz7dnlgluefyje5eavugqf0yf3z',
      state: 'PAID',
    }
    const mintQuoteChecked = await wallet.checkMintQuote(mintQuote.quote)
    console.log(mintQuoteChecked.state, MintQuoteState.PAID)
    if (mintQuoteChecked.state === MintQuoteState.PAID) {
      const {proofs} = await wallet.mintProofs(100, mintQuote.quote)
      console.log({proofs})
    }
  }

  onMount(async () => {
    const identities = await localStorage.getItem('identities')
    const [{secretKey, publicKey}] = JSON.parse(identities)
    // console.log({publicKey, secretKey})
    npub = nip19.npubEncode(publicKey)
    nsec = nip19.nsecEncode(hexToBytes(secretKey))
    // console.log({nsec, npub})
    // createCashuWallet()
    //   .then(() => console.log('Wallet created.'))
    //   .catch(error => console.error(error))
  })
// Usage Example:
// (async () => {
//   await connectToRelays();
//   await createWallet();
// })();

</script>

<div id='profile'>
  <h2 class='text-2xl font-semibold mb-4'>Money</h2>
</div>
