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
  let lnQRCodeURL = $state()
  let cashuPaymentRequest = $state()
  let cashuQRCodeURL = $state()
  let mintInfo = $state({})
  let cashuWallet = $state()
  // let nsec = $state()
  // let npub = $state()
  const {
    address, mnemonic,
  } = $derived(data)
  const {
    // publicKey: walletPubHex,
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

  const createNip60Wallet = () => {
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
  // const mintUrl = 'https://mint.minibits.cash/Bitcoin'
  const mintUrl = 'http://localhost:3338'

  const createCashuWallet = async () => {
    const mint = new CashuMint(mintUrl)
    const bip39seed = await bip39.mnemonicToSeed(mnemonic)
    const wallet = new CashuWallet(mint, {bip39seed})
    await wallet.loadMint()
    mintInfo = await wallet.getMintInfo()
    console.info(mintInfo)
    // console.log(wallet.keys, wallet.keysets)
    // console.log(wallet.keys.get('00500550f0494146'))
    return wallet
  }

  const receiveMintedLNPayment = async ({quote, amount}) => {
    const mintQuote = await cashuWallet.checkMintQuote(quote)
    console.log({mintQuote, amount})
    if (mintQuote.state === MintQuoteState.PAID) {
      const proofs = await cashuWallet.mintProofs(amount, quote)
      console.log({proofs})
    // TODO: store JSON.stringify(proofs) to Dexie/IndexDB
    }
  }

  const generateLNPaymentRequest = async ({amount = 21} = {}) => {
    const mintQuote = await cashuWallet.createMintQuote(amount)
    const {request, quote} = mintQuote
    const quoteUpdatesCallback = mintQuoteResponse => {
      const {
        unit, amount, state, created_time, expiry,
      } = mintQuoteResponse
      console.debug('callback:', {
        unit,
        amount,
        state,
        created_time,
        expiry,
      })
      receiveMintedLNPayment({quote, amount})
    }
    const errorCallback = error => {
      console.warn(error)
    }
    console.info({quote})
    // onMintQuotePaid also available
    const subscription = await cashuWallet.onMintQuoteUpdates(
      [quote],
      quoteUpdatesCallback,
      errorCallback
    )
    // const subscription = await cashuWallet.onMintQuotePaid(
    //   [quote],
    //   quoteUpdatesCallback,
    //   errorCallback
    // )
    console.debug({subscription})
    return request
  }
  const generateCashuPaymentRequest = ({amount = 21} = {}) => {
    const request = new PaymentRequest(
      [
        {
          type: PaymentRequestTransportType.NOSTR,
          target: nprofile,
          tags: [['n', '17']],
        },
      ],
      '4840f51e',
      amount,
      'sat',
      [mintUrl],
      'bribe me, bitch!',
      true // single use
    )
    const pr = request.toEncodedRequest()
    return pr
  }

  const regeneratePaymentRequests = async () => {
    lnPaymentRequest = await generateLNPaymentRequest()
    cashuPaymentRequest = generateCashuPaymentRequest()
    lnQRCodeURL = await QRCode.toDataURL(lnPaymentRequest)
    cashuQRCodeURL = await QRCode.toDataURL(cashuPaymentRequest)
  }

  onMount(async () => {
    console.log('data.identities:', data.identities)
    const [{secretKey, publicKey}] = data.identities
    console.log({publicKey, secretKey})
    // secretHex = secretKey
    identityPublicHex = publicKey
    // npub = nip19.npubEncode(publicKey)
    // nsec = nip19.nsecEncode(hexToBytes(secretKey))
    // console.log({nsec, npub})
    cashuWallet = await createCashuWallet()
    console.debug('Wallet created.')
  // regeneratePaymentRequests(cashuWallet)
  // createNip60Wallet()
    //   .then(() => console.log('NIP-60 wallet created.'))
    //   .catch(error => console.error(error))
    // await generateLNInvoice()
  })

  let quote = $state('Ys2krWjlnBN-7wjI_AHOaVWnuIgTkleSYKRA3oqV')
  let amount = $state(21)

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
  <div class='flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md'>
    <input
      type='text'
      bind:value={quote}
      placeholder='Quote Identifier'
      class='p-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500'
    />
    <input
      type='text'
      bind:value={amount}
      placeholder='Amount in Sats'
      class='p-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500'
    />
    <button
      class='custom-mid-button p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500'
      onclick={() => receiveMintedLNPayment({quote, amount})}
    >
      Receive
    </button>
  </div>
</div>
