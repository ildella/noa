<script>
  import {onMount} from 'svelte'
  // import {sha256} from '@noble/hashes/sha256'
  // import {bytesToHex, hexToBytes} from '@noble/hashes/utils'
  import {randomBytes} from '@noble/ciphers/webcrypto'
  // import {gcm} from '@noble/ciphers/aes'
  // import {utf8ToBytes} from '@noble/ciphers/utils'
  import QRCode from 'qrcode'
  import {
    CashuMint, CashuWallet, MintQuoteState,
    PaymentRequest, PaymentRequestTransportType,
  } from '@cashu/cashu-ts'
  import * as bip39 from '@scure/bip39'

  import {v2} from 'nostr-tools/nip44'

  const {data} = $props()
  const {
    address, mnemonic,
  } = $derived(data)
  // let secretHex = $state()
  let identityPublicHex = $state()
  let lnPaymentRequest = $state()
  let cashuPaymentRequest = $state()
  let lnQRCodeURL = $state()
  let cashuQRCodeURL = $state()
  const {
    publicKey: walletPubHex,
    secretKey: walletSecretHex,
    nprofile,
  } = $derived(address)

  // const qrCodeURL = $derived.by(async () => {
  //   // console.log({lnPaymentRequest})
  //   if (!lnPaymentRequest) return ''
  //   const url = await QRCode.toDataURL(lnPaymentRequest)
  //   console.log({url})
  //   return url
  // })
  let mintInfo = $state({})

  // let nsec = $state()
  // let npub = $state()

  const mints = [
    'https://mint.minibits.cash/Bitcoin',
    'https://8333.space:3338',
  ]
  const relays = [
    'relay.damus.io',
    'relay.primal.net',
    'eden.nostr.land',
    'relay.vengeful.eu',
    'relay.nostr.band',
  ]

  const createNip60Wallet = async () => {
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

  const createCashuWallet = async () => {
    const mint = new CashuMint(mintUrl)
    const bip39seed = await bip39.mnemonicToSeed(mnemonic)
    const wallet = new CashuWallet(mint, {bip39seed})
    await wallet.loadMint()
    mintInfo = await wallet.getMintInfo()
    // console.log(wallet.keys, wallet.keysets)
    // console.log(wallet.keys.get('00500550f0494146'))
    return wallet
  }

  // const receiveMinted = async cashuWallet => {
  //   const mintQuote = {
  //     expiry: null,
  //     paid: true,
  //     pubkey: 'npub1z4vdnms0r2m0txrd8z8k8x74rrkusxtdvwgjsf9nslvrdz8wrlts7rvy2k',
  //     quote: 'BNlt-xjMzvoPhYOXX8ZJZG8ZEXU70YaXnbYdOSXa',
  //     request: 'lnbc1u1pnemqlapp59r5spakkcpf32trxw82hv79v9yt28cp2ehduusgg53k4reauwcesdq8w3jhxaqcqzzsxqyz5vqrzjqvueefmrckfdwyyu39m0lf24sqzcr9vcrmxrvgfn6empxz7phrjxvrttncqq0lcqqyqqqqlgqqqqqqgq2qsp5dsaqlt555vq6qnyqlcr7cekvke6t74pe3f3ej2yusapee9xkza7s9qxpqysgqp936mmmr296wxtdw044tn3kxqfhjthuxstwuj5gkfvejaadwqfdyqxud68tc6kr0spcjqp90dagwf5dlx6rmz7dnlgluefyje5eavugqf0yf3z',
  //     state: 'PAID',
  //   }
  //   const mintQuoteChecked = await cashuWallet.checkMintQuote(mintQuote.quote)
  //   console.log(mintQuoteChecked.state, MintQuoteState.PAID)
  //   if (mintQuoteChecked.state === MintQuoteState.PAID) {
  //     const {proofs} = await cashuWallet.mintProofs(100, mintQuote.quote)
  //     console.log({proofs})
  //   }
  // }

  const generateLNInvoice = async cashuWallet => {
    // const cashuWallet = await createCashuWallet()
    const mintQuote = await cashuWallet.createMintQuote(21)
    // console.log(mintQuote)
    lnPaymentRequest = mintQuote.request
    lnQRCodeURL = await QRCode.toDataURL(lnPaymentRequest)
    const {quote} = mintQuote
    // console.debug({quote})
    const callback = mintQuoteResponse => {
      const {
        unit, amount, state, created_time, expiry,
      } = mintQuoteResponse
      console.info({unit, amount, state})
    }
    const errorCallback = error => {
      console.warn(error)
    }
    return cashuWallet.onMintQuoteUpdates([quote], callback, errorCallback)
  }

  const generateCashuPaymentRequest = () => {
    const request = new PaymentRequest(
      [
        {
          type: PaymentRequestTransportType.NOSTR,
          target: nprofile,
          tags: [['n', '17']],
        },
      ],
      '4840f51e',
      21,
      'sat',
      [mintUrl],
      'bribe me, bitch!',
      true // single use
    )
    const pr = request.toEncodedRequest()
    return pr
  }

  onMount(async () => {
    const identities = await localStorage.getItem('identities')
    const [{secretKey, publicKey}] = JSON.parse(identities)
    // console.log({publicKey, secretKey})
    // secretHex = secretKey
    identityPublicHex = publicKey
    // npub = nip19.npubEncode(publicKey)
    // nsec = nip19.nsecEncode(hexToBytes(secretKey))
    // console.log({nsec, npub})
    createCashuWallet()
      .then(cashuWallet => {
        console.log('Wallet created.')
        // generateLNInvoice(cashuWallet)
        cashuPaymentRequest = generateCashuPaymentRequest()
        console.log({cashuPaymentRequest})
        return QRCode.toDataURL(cashuPaymentRequest)
      })
      .then(qrCodeURL => {
        cashuQRCodeURL = qrCodeURL
      })
      .catch(error => console.error(error))
  // createNip60Wallet()
    //   .then(() => console.log('NIP-60 wallet created.'))
    //   .catch(error => console.error(error))
    // await generateLNInvoice()
  })

</script>

<div id='profile'>
  <h2 class='text-2xl font-semibold mb-4'>Money</h2>
  <p>Wallet pubkey: {address.publicKey}</p>
  <p>Profile: {address.nprofile}</p>
  <p>Wallet seed: {mnemonic}</p>
  <p>{mintInfo.name} - running {mintInfo.version}</p>
  <!-- <p>{mintInfo.description}</p> -->
  <button
    class='custom-mid-button'
    onclick={generateLNInvoice}
  >New invoice.
  </button>
  <p>Pay with Cashu: {cashuPaymentRequest}</p>
  <div>
    <img
      class='w-64 h-64 object-contain'
      src={cashuQRCodeURL}
      alt='QRCode should be displayed here.'
    />
  </div>
  <p>Pay with Ligthning: {lnPaymentRequest}</p>
  <div>
    <img
      class='w-64 h-64 object-contain'
      src={lnQRCodeURL}
      alt='QRCode should be displayed here.'
    />
  </div>
</div>
