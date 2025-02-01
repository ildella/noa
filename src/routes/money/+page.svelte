<script>
  import {onMount} from 'svelte'
  // import {sha256} from '@noble/hashes/sha256'
  import {bytesToHex, hexToBytes} from '@noble/hashes/utils'
  import {randomBytes} from '@noble/ciphers/webcrypto'
  // import {gcm} from '@noble/ciphers/aes'
  // import {utf8ToBytes} from '@noble/ciphers/utils'

  import * as nip19 from 'nostr-tools/nip19'
  import {v2} from 'nostr-tools/nip44'

  const {data} = $props()
  const {
    wallet,
  } = $derived(data)
  let secretHex = $state()
  let nsec = $state()
  let npub = $state()

  const mints = ['https://mint.minibits.cash/Bitcoin', 'https://8333.space:3338']
  const relays = [
    'relay.damus.io',
    'relay.primal.net',
    'relay.nostr.bg',
    'eden.nostr.land',
    'relay.vengeful.eu',
    'relay.nostr.band',
  ]

  const createNip60Wallet = async () => {
    const {publicKey: walletPubHex} = wallet
    const content = [
      ['balance', '100', 'sat'],
      ['privkey', secretHex],
    ]
    console.log({secretHex, walletPubHex})
    const conversationKey = v2.utils.getConversationKey(secretHex, walletPubHex)
    console.log({conversationKey})
    const nonce = randomBytes(32)
    console.log({nonce})
    const encryptedContent = v2.encrypt(content, conversationKey, nonce)
    console.log({encryptedContent})
    const walletEvent = {
      kind: 37375,
      content: encryptedContent,
      tags: [
        ['d', 'noa-test-wallet'],
        ...mints.map(mint => ['mint', mint]),
        ['name', 'NOA embedded wallet'],
        ...relays.map(relay => ['relay', `wss://${relay}`]),
      // ['deleted'],
      ],
    }
    console.log(walletEvent)
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
    secretHex = secretKey
    npub = nip19.npubEncode(publicKey)
    nsec = nip19.nsecEncode(hexToBytes(secretKey))
    // console.log({nsec, npub})
    // createCashuWallet()
    //   .then(() => console.log('Wallet created.'))
    //   .catch(error => console.error(error))
    createNip60Wallet()
      .then(() => console.log('NIP-60 wallet created.'))
      .catch(error => console.error(error))
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
