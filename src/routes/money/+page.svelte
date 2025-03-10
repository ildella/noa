<script>
  /*
    eslint-disable max-lines
  */
  import {onMount} from 'svelte'
  // import exstream from 'exstream.js'
  // const {__} = exstream

  // import {sha256} from '@noble/hashes/sha256'
  // import {bytesToHex, hexToBytes} from '@noble/hashes/utils'
  // import {gcm} from '@noble/ciphers/aes'
  // import {utf8ToBytes} from '@noble/ciphers/utils'
  import QRCode from 'qrcode'
  import * as bip39 from '@scure/bip39'
  import {
    CashuMint, CashuWallet, MintQuoteState, CheckStateEnum,
    PaymentRequest, PaymentRequestTransportType,
    getEncodedTokenV4,
  } from '@cashu/cashu-ts'

  import {db} from '$lib/db'
  import SendToken from './SendToken.svelte'

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
    // secretKey: walletSecretHex,
    nprofile,
  } = $derived(address)

  const sumProofs = proofs => proofs.reduce((acc, proof) => acc + proof.amount, 0)
  let currentProofs = $state([])

  incoming.subscribe(quotes => {
    // console.log('Incoming changed:', quotes)
    balance = sumProofs(quotes)
    currentProofs = quotes.map(({proofs}) => proofs).flat()
    console.log('proofs:', currentProofs.length)
  // currentProofs.forEach(proof => console.log(proof))
  })

  const mintUrl = 'http://localhost:3338'

  const createCashuWallet = async () => {
    console.debug('Starting wallet...')
    const mint = new CashuMint(mintUrl)
    const bip39seed = await bip39.mnemonicToSeed(mnemonic)
    const wallet = new CashuWallet(mint, {bip39seed})
    await wallet.loadMint()
    mintInfo = await wallet.getMintInfo()
    console.debug({mintInfo})
    // console.log(wallet.keys, wallet.keysets)
    // console.log(wallet.keys.get('00500550f0494146'))
    return wallet
  }

  const mintLnPayment = async ({quote}) => {
    const {paid, state, request} = await cashuWallet.checkMintQuote(quote)
    // console.log({state})
    if (state === MintQuoteState.PAID) {
      const {amount} = await db.quotes
        .where('quote').equals(quote)
        .first()
      console.log('Minting: ', {quote, amount})
      const proofs = await cashuWallet.mintProofs(amount, quote)
      await db.incoming.add({quote, amount, proofs})
    // console.log(proofs)
      // proofs.forEach(proof => {
      //   console.log(proof)
      //   db.proofs
      //     .add({id: 'ciao', amount: 1, fuck: 'you'})
      //     .then(id => {
      //       console.log('new proof', id)
      //     })
      //     .catch(error => console.warn(error))
      // })
    }
  }

  const quoteUpdatesCallback = mintQuoteResponse => {
    const {
      unit, amount, state, created_time, expiry,
      quote, request,
    } = mintQuoteResponse
    console.log('Mint updated notfication:', {
      quote,
      unit,
      amount,
      state,
      created_time,
      expiry,
    })
  }

  const generateLNPaymentRequest = async ({amount = 21} = {}) => {
    const mintQuote = await cashuWallet.createMintQuote(amount)
    const {request, quote} = mintQuote
    await db.quotes.add({quote, request, amount})
    const errorCallback = error => {
      console.warn(error)
    }
    await cashuWallet.onMintQuoteUpdates(
      [quote],
      quoteUpdatesCallback,
      errorCallback
    )
    await cashuWallet.onMintQuotePaid(
      quote,
      params => {
        console.log('onMintQuotePaid', params)
        mintLnPayment(params)
      },
      error => {
        console.error(error)
      }
    )
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
    const {request, quote} = await generateLNPaymentRequest({amount: 50})
    lnPaymentRequest = request
    lnPaymentQuote = quote
    cashuPaymentRequest = generateCashuPaymentRequest()
    lnQRCodeURL = await QRCode.toDataURL(lnPaymentRequest)
    cashuQRCodeURL = await QRCode.toDataURL(cashuPaymentRequest)
  }

  const markSpent = proof => {
    console.log('spent:', proof)
  }

  const sendCash = async ({amount}) => {
    // console.log(currentProofs)
    const total = sumProofs(currentProofs)
    console.log('Sending:', {total, amount})
    const response = await cashuWallet.send(amount, currentProofs, {includeFees: false})
    console.log(response)
    const encoded = getEncodedTokenV4({mint: mintUrl, proofs: response.send})
    console.log(encoded)
    cashuWallet.onProofStateUpdates(
      response.send,
      ({state, proof}) => {
        console.log({state})
        if (state === CheckStateEnum.SPENT) {
          markSpent(proof)
        }
      },
      error => {
        console.warn(error)
      }
    )
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
  // regeneratePaymentRequests(cashuWallet)
  // createNip60Wallet()
    //   .then(() => console.log('NIP-60 wallet created.'))
    //   .catch(error => console.error(error))
    // await generateLNInvoice()
  })

  const clear = () => db.incoming.clear()

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
  <button
    class='custom-mid-button'
    onclick={clear}
  >Clear
  </button>
</div>
<SendToken {sendCash}/>
<div id='new-invoice'>
  <h3>New invoice</h3>
  <button
    class='custom-mid-button'
    onclick={regeneratePaymentRequests}
  >Generate new invoice.
  </button>
  <p>Ligthning request: {lnPaymentRequest}</p>
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
