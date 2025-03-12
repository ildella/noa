<script>
  import {onMount} from 'svelte'
  import QRCode from 'qrcode'
  import {goto} from '$app/navigation'
  import CopyButton from '$lib/CopyButton.svelte'
  import {downloadFile} from '$lib/download-keys.js'

  const {data} = $props()
  const {secretKey, publicKey, npub} = $derived(data)
  const {help} = $derived(data)
  // const qrCodeURL = $derived.by(() => QRCode.toDataURL(secretKey))
  let qrCodeURL = $state('')
  let publicQRCodeURL = $state('')
  let showPublicQRCode = $state(false)
  let showQRCode = $state(false)
  let password = $state()

  const deleteKey = () => {
    localStorage.removeItem(publicKey)
    localStorage.removeItem('identities')
    return goto('/')
  }

  onMount(async () => {
    qrCodeURL = await QRCode.toDataURL(secretKey)
    publicQRCodeURL = await QRCode.toDataURL(publicKey)
  })

</script>

<div id='profile'>
  <h1>Identity</h1>
  <p class='m-2'>{help.identity}</p>
  <!-- <div class='m-2'>
    <h2>Public Key</h2>
    <p class='mb-2'>This is how people find you.</p>
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
  </div> -->
  <div class='p-2'>
    <h3>Public Key</h3>
    <p class='mb-2'>This is how people find you.</p>
    <button
      class='custom-mid-button'
      onclick={() => {
        showPublicQRCode = !showPublicQRCode
      }}
    >QR Code</button>
    <CopyButton
      style='custom-mid-button'
      label='Copy'
      icon='fa-copy'
      onClick={() => npub}
    />
    {#if showPublicQRCode}
      <div>
        <img
          class='w-64 h-64 object-contain'
          src={publicQRCodeURL}
          alt='QRCode should be displayed here.'
        />
      </div>
    {/if}
  </div>
  <div class='p-2'>
    <h3>Secret Key</h3>
    <p class='mb-2'>You NEVER share this.</p>
    <button
      class='custom-mid-button'
      onclick={() => {
        showQRCode = !showQRCode
      }}
    >QR Code</button>
    <CopyButton
      style='custom-mid-button'
      label='Copy'
      icon='fa-copy'
      onClick={() => secretKey}
    />
    {#if showQRCode}
      <div>
        <img
          class='w-64 h-64 object-contain'
          src={qrCodeURL}
          alt='QRCode should be displayed here.'
        />
      </div>
    {/if}
  </div>
  <div class='flex flex-col space-y-4 p-2'>
    <div class='flex flex-col space-y-2 mb-8'>
      <h2>
        <i class='fa-solid fa-key'></i>
        Export key (backup)
      </h2>
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
        <i class='fa-solid fa-cloud-arrow-down'></i>
        Download Keys
      </button>
    </div>
    <h2>
      <i class='fa-solid fa-triangle-exclamation'></i>
      Danger area!
    </h2>
    <button
      class='custom-mid-warn-button'
      onclick={() => deleteKey()}
    >
      <i class='fa-solid fa-recycle'></i>
      Delete to start over.
    </button>
  </div>
</div>
