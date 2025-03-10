<script>
  import {onMount} from 'svelte'
  // import {sha256} from '@noble/hashes/sha256'
  // import {bytesToHex, hexToBytes} from '@noble/hashes/utils'
  // import {gcm} from '@noble/ciphers/aes'
  // import {utf8ToBytes} from '@noble/ciphers/utils'
  import QRCode from 'qrcode'
  import * as bip39 from '@scure/bip39'
  import {
    CashuMint, CashuWallet, MintQuoteState,
    PaymentRequest, PaymentRequestTransportType,
  } from '@cashu/cashu-ts'

  import {db} from '$lib/db'

  let identityPublicHex = $state()
  let lnPaymentRequest = $state()
  let lnPaymentQuote = $state()
  let lnQRCodeURL = $state()
  let cashuPaymentRequest = $state()
  let cashuQRCodeURL = $state()
  let mintInfo = $state({})
  let cashuWallet = $state()
  let balance = $state(0)
  // let nsec = $state()
  // let npub = $state()
  const {data} = $props()
  const {address, mnemonic, incoming} = $derived(data)
  const {
    // publicKey: walletPubHex,
    secretKey: walletSecretHex,
    nprofile,
  } = $derived(address)

  const sumProofs = proofs => proofs.reduce((acc, proof) => acc + proof.amount, 0)

  incoming.subscribe(proofs => {
    // console.log('Incoming changed:')
    balance = sumProofs(proofs)
  })

  const mintUrl = 'http://localhost:3338'

  const createCashuWallet = async () => {
    console.debug('Starting wallet...')
    const mint = new CashuMint(mintUrl)
    const bip39seed = await bip39.mnemonicToSeed(mnemonic)
    const wallet = new CashuWallet(mint, {bip39seed})
    await wallet.loadMint()
    mintInfo = await wallet.getMintInfo()
    console.log({mintInfo})
    // console.log(wallet.keys, wallet.keysets)
    // console.log(wallet.keys.get('00500550f0494146'))
    return wallet
  }

  // let quote = $state('Ys2krWjlnBN-7wjI_AHOaVWnuIgTkleSYKRA3oqV')
  const amount = $state(21)

  const receiveMintedLNPayment = async () => {
    const {
      paid, state, quote, request,
    } = await cashuWallet.checkMintQuote(lnPaymentQuote)
    console.log(quote === lnPaymentQuote, request === lnPaymentRequest)
    console.log({state, amount})
    if (state === MintQuoteState.PAID) {
      const proofs = await cashuWallet.mintProofs(amount, quote)
      // console.log({proofs})
      await db.incoming.add({quote, amount, proofs})
    }
  }

  const generateLNPaymentRequest = async ({amount = 21} = {}) => {
    const mintQuote = await cashuWallet.createMintQuote(amount)
    const {request, quote} = mintQuote
    const quoteUpdatesCallback = mintQuoteResponse => {
      const {
        unit, amount, state, created_time, expiry,
      } = mintQuoteResponse
      console.log('Mint callback:', {
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
    await cashuWallet.onMintQuoteUpdates(
      [quote],
      quoteUpdatesCallback,
      errorCallback
    )
    // await cashuWallet.onMintQuotePaid(
    //   [quote],
    //   quoteUpdatesCallback,
    //   errorCallback
    // )
    // console.debug({subscription})
    return {request, quote}
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
    const {request, quote} = await generateLNPaymentRequest()
    lnPaymentRequest = request
    lnPaymentQuote = quote
    cashuPaymentRequest = generateCashuPaymentRequest()
    lnQRCodeURL = await QRCode.toDataURL(lnPaymentRequest)
    cashuQRCodeURL = await QRCode.toDataURL(cashuPaymentRequest)
  }

  onMount(async () => {
    console.debug('data.identities:', data.identities)
    const [{secretKey, publicKey}] = data.identities
    // console.log({publicKey, secretKey})
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

</script>

<div id='profile'>
  <p>Balance: {balance}</p>
  <p>{mintInfo.name} - running {mintInfo.version}</p>
  <!-- <ul>
    {#if $incoming}
      {#each $incoming as friend (friend.id)}
        <li>{friend.amount}</li>
      {/each}
    {/if}
  </ul> -->
  <h2 class='text-2xl font-semibold mb-4'>Money</h2>
  <p>Wallet pubkey: {address.publicKey}</p>
  <!-- <p>Profile: {address.nprofile}</p> -->
  <!-- <p>Wallet seed: {mnemonic}</p> -->
  <!-- <p>{mintInfo.description}</p> -->
  <div class='flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md'>
    <h3>Receive cash from quote</h3>
    <input
      type='text'
      bind:value={lnPaymentQuote}
      placeholder='Quote Identifier'
      class='p-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500'
    /><!--
    <input
      type='text'
      bind:value={amount}
      placeholder='Amount in Sats'
      class='p-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500'
    /> -->
    <button
      class='custom-mid-button p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500'
      onclick={() => receiveMintedLNPayment()}
    >
      Receive
    </button>
  </div>

  <button
    class='custom-mid-button'
    onclick={regeneratePaymentRequests}
  >New invoice.
  </button>
  <p>Pay with Ligthning: {lnPaymentRequest}</p>
  <p>Quote: {lnPaymentQuote}</p>
  <div>
    <img
      class='w-64 h-64 object-contain'
      src={lnQRCodeURL}
      alt='QRCode should be displayed here.'
    />
  </div>
  <p>Pay with Cashu: {cashuPaymentRequest}</p>
  <div>
    <img
      class='w-64 h-64 object-contain'
      src={cashuQRCodeURL}
      alt='QRCode should be displayed here.'
    />
  </div>
</div>
