<script>
  import {onMount} from 'svelte'
  import QRCode from 'qrcode'
  import {goto} from '$app/navigation'
  import CopyButton from '$lib/CopyButton.svelte'
  import {downloadFile} from '$lib/download-keys.js'

  const {data} = $props()
  const {
    secretKey, publicKey, shortPublicKey, npub, shortNpub,
  } = $derived(data)
  const {help} = $derived(data)
  // const qrCodeURL = $derived.by(() => QRCode.toDataURL(secretKey))
  let qrCodeURL = $state('')
  let showQRCode = $state(false)
  let password = $state()

  const deleteKey = () => {
    localStorage.removeItem(publicKey)
    localStorage.removeItem('identities')
    return goto('/')
  }

  const toggleQRCodeVisibility = () => {
    showQRCode = !showQRCode
  }

  onMount(async () => {
    qrCodeURL = await QRCode.toDataURL(secretKey)
  })

</script>

<div id='profile'>
  <h1>Identity</h1>
  <p class='m-2'>{help.identity}</p>
  <div class='m-2'>
    <h2>Public Key</h2>
    <p class='mb-2'>This is how people will find you.</p>
    <p>
      <span class='text-lg'>npub: {shortNpub}...</span>
      <CopyButton
        icon='fa-copy'
        label=''
        title='Copy public key'
        onClick={() => npub}
      />
    </p>
    <p>
      <span class='text-lg'>hex: {shortPublicKey}...</span>
      <CopyButton
        icon='fa-copy'
        label=''
        title='Copy public key'
        onClick={() => publicKey}
      />
    </p>
  </div>
  <div class='p-2'>
    <h2>Secret Key</h2>
    <p class='mb-2'>You NEVER share this.</p>
    <button
      class='custom-mid-button'
      onclick={() => toggleQRCodeVisibility()}
    >Show/Hide QR Code</button>
    <CopyButton
      style='custom-mid-button'
      label='Copy to clipboard'
      icon='fa-copy'
      onClick={() => secretKey}
    />
    <div class={showQRCode ? '' : 'hidden'}>
      <img
        class='w-64 h-64 object-contain'
        src={qrCodeURL}
        alt='QRCode should be displayed here.'
      />
    </div>
  </div>
  <div class='flex flex-col space-y-4 p-2'>
    <div class='flex flex-col space-y-2 mb-8'>
      <h2>Export key pair for backup.</h2>
      <label
        for='password'
        class='text-lg'
      >Encrypt with password</label>
      <input
        id='password'
        type='password'
        bind:value={password}
        placeholder='Leave blank for no encryption.'
        class='custom-input-text'
      />
      <button
        id='download-keys'
        class='custom-big-button'
        onclick={() => downloadFile({secretKey, publicKey, password})}
      >
        Download Keys
        <i class='fa-solid fa-download'></i>
      </button>
    </div>
    <button
      class='custom-mid-warn-button'
      onclick={() => deleteKey()}
    >
      Delete to start over.
      <i class='fa-solid fa-recycle'></i>
    </button>
  </div>
</div>
