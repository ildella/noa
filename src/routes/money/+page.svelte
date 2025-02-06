<script>
  import {onMount} from 'svelte'
  // import {sha256} from '@noble/hashes/sha256'
  // import {bytesToHex, hexToBytes} from '@noble/hashes/utils'
  import {randomBytes} from '@noble/ciphers/webcrypto'
  // import {gcm} from '@noble/ciphers/aes'
  // import {utf8ToBytes} from '@noble/ciphers/utils'
  import QRCode from 'qrcode'
  import * as bip39 from '@scure/bip39'
  import {v2} from 'nostr-tools/nip44'
  import {
    CashuMint, CashuWallet, MintQuoteState,
    PaymentRequest, PaymentRequestTransportType,
  } from '@cashu/cashu-ts'

  const {data} = $props()
  let identityPublicHex = $state()
  let lnPaymentRequest = $state()
  let cashuPaymentRequest = $state()
  let lnQRCodeURL = $state()
  let cashuQRCodeURL = $state()
  let mintInfo = $state({})
  // let nsec = $state()
  // let npub = $state()
  const {
    address, mnemonic,
  } = $derived(data)
  const {
    publicKey: walletPubHex,
    secretKey: walletSecretHex,
    nprofile,
  } = $derived(address)

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

  const generateLNPaymentRequest = async cashuWallet => {
    const mintQuote = await cashuWallet.createMintQuote(21)
    const {request, quote} = mintQuote
    const callback = mintQuoteResponse => {
      const {
        unit, amount, state, created_time, expiry,
      } = mintQuoteResponse
      console.info({unit, amount, state})
    }
    const errorCallback = error => {
      console.warn(error)
    }
    const subscription = cashuWallet.onMintQuoteUpdates([quote], callback, errorCallback)
    console.log({subscription})
    return request
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

  const regeneratePaymentRequests = async cashuWallet => {
    console.debug('Wallet created.')
    cashuPaymentRequest = generateCashuPaymentRequest(cashuWallet)
    lnPaymentRequest = await generateLNPaymentRequest(cashuWallet)
    cashuQRCodeURL = await QRCode.toDataURL(cashuPaymentRequest)
    lnQRCodeURL = await QRCode.toDataURL(lnPaymentRequest)
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
    const cashuWallet = await createCashuWallet()
    regeneratePaymentRequests(cashuWallet)
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
    onclick={regeneratePaymentRequests}
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
