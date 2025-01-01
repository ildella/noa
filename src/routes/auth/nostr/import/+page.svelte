<script>
  import {page} from '$app/state'
  import {goto} from '$app/navigation'
  import {uploadFile, importSecretKey} from '$lib/download-keys'

  const {data: {help}} = page

  let secretKey = $state('')
  let files = $state()
  let password = $state()
  const hasFiles = $derived(files?.length > 0)
  const hasSecretKey = $derived(secretKey?.length > 0)
  const importDisabled = $derived(!hasSecretKey && !hasFiles)
  const uploadDisabled = $derived(hasSecretKey)
  $effect(() => {
    if (files) {
      // Note that `files` is of type `FileList`, not an Array:
      // https://developer.mozilla.org/en-US/docs/Web/API/FileList
      console.log(files)
      for (const file of files) {
        console.log(`${file.name}: ${file.size} bytes`)
      }
    }
  })

  const importFile = () => {
    if (hasSecretKey === true) {
      const success = importSecretKey({secretKey})
      if (success === true)
        return goto('/')
    }
    if (hasFiles === true) {
      const file = files[0]
      console.log(file)
      return uploadFile({file, password})
    }
  }

</script>

<div class='container mx-auto'>
  <h1 class='text-2xl font-bold mb-4'>Import an Existing Nostr Identity</h1>
  <p class='text-lg mb-4'>{help.import}</p>

  <div class='text-lg space-y-4'>
    <div class='flex flex-col space-y-2 mb-8'>
      <label
        for='password'
        class='text-lg'
      >Password (optional)</label>
      <input
        id='password'
        type='password'
        bind:value={password}
        placeholder='Leave blank for no password.'
        disabled={uploadDisabled}
        class='custom-input-text'
      />
      <p class='text-sm text-gray-500'>The optional password used during file export from NOA.</p>
    </div>

    <div class='flex flex-col space-y-2 mb-8'>
      <label
        for='nostr-keys'
        class='text-lg'
      >Upload a file</label>
      <input
        type='file'
        id='nostr-keys'
        name='nostr-keys'
        accept='application/octet-stream'
        disabled={uploadDisabled}
        bind:files
        class='custom-input-file'
      />
      <p class='text-sm text-gray-500'>Accepted only files exported by NOA.</p>
    </div>

    <div class='flex flex-col space-y-2 mb-8'>
      <label
        for='secretKey'
        class='text-lg'
      >...or insert your Secret Key (not encrypted)</label>
      <input
        id='secretKey'
        type='text'
        placeholder='Nsec format.'
        bind:value={secretKey}
        class='custom-input-text'
      />
    </div>

    <button
      disabled={importDisabled}
      class='custom-big-button'
      onclick={() => importFile()}
    >
      Import
    </button>
  </div>
</div>

<!-- {#if files}
  <h2>Selected files:</h2>
  {#each Array.from(files) as file}
    <p>{file.name} ({file.size} bytes)</p>
  {/each}
{/if}
 -->
