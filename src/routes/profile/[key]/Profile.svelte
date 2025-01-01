<script>
  import {onMount} from 'svelte'
  import {subDays, getUnixTime} from 'date-fns'
  import {finalizeEvent, verifyEvent} from 'nostr-tools/pure'
  import {page} from '$app/state'
  import {invalidateAll} from '$app/navigation'
  import {connect, publish, subscribe} from '$lib/relay-connection'

  const {identities, publicKey: hex} = page.data
  const since = getUnixTime(subDays(Date.now(), 200))
  const property = 'profile'
  // const {[property]: storedData} = $derived(page.data)
  let propertyState = $state(page.data[property])
  // const formModel = $derived.by(() => {
  //   // const state = $state(page.data[property])
  //   return propertyState
  // })
  const formModel = $derived(propertyState)
  let sending = $state(false)
  let profileFound = $state(false)
  const unchanged = $derived(
    JSON.stringify(formModel) === JSON.stringify(page.data[property]))
  const submitDisabled = $derived(sending || unchanged)

  const send = async () => {
    console.log(identities)
    const [{secretKey, publicKey}] = identities
    console.debug('Store and send to backend.')
    const formModelString = JSON.stringify(formModel)
    await localStorage.setItem(publicKey, formModelString)
    const signedEvent = finalizeEvent({
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: formModelString,
    }, secretKey)
    const eventOk = verifyEvent(signedEvent)
    // console.debug(signedEvent.content)
    console.debug('eventOk', eventOk)
    await publish(signedEvent)
    sending = true
    setTimeout(() => {
      invalidateAll()
      sending = false
      console.log('Updated.')
    }, 1000)
  }

  const infoBorders = $derived(profileFound
    ? 'border-green-500 bg-green-100 text-green-800 shadow-green-300'
    : 'border-yellow-500 bg-yellow-100 text-yellow-800 shadow-yellow-300')
  const title = $derived(profileFound
    ? 'Profile found on the Network.'
    : 'Looking for existing profile...')
  onMount(async () => {
    await connect()
    subscribe({
      authors: [hex],
      kinds: [0],
      since,
      onEvent: event => {
        const {content} = event
        propertyState = JSON.parse(content)
        profileFound = true
      },
    })
  })

</script>

<div class='p-4 mb-4 border-l-4 shadow-md {infoBorders}'>
  {title}
</div>

<form
  class='space-y-4'
  onsubmit={send}
>
  <div>
    <label
      for='name'
      class='custom-label'
    >
      Name (really a nickname)
    </label>
    <input
      id='name'
      bind:value={formModel.name}
      type='text'
      autocomplete='off'
      required
      placeholder='Enter your name'
      class='custom-input-text'
    />
  </div>
  <div>
    <label
      for='display_name'
      class='custom-label'
    >
      Display Name
    </label>
    <input
      id='display_name'
      bind:value={formModel.display_name}
      type='text'
      placeholder='Enter your Display Name'
      class='custom-input-text'
    />
  </div>
  <div>
    <label
      for='about'
      class='custom-label'
    >
      About (short description)
    </label>
    <input
      id='about'
      bind:value={formModel.about}
      type='text'
      placeholder='Something about yourself'
      class='custom-input-text'
    />
  </div>
  <div>
    <label class='inline-flex items-center'>
      <input
        type='checkbox'
        bind:checked={formModel.bot}
        class='custom-input-checkbox'
      />
      <span class='ml-2 text-gray-700'>Is this a Bot?</span>
    </label>
  </div>
  <!--     <div>
      <label
        for='website'
        class='custom-label'>
        Website
      </label>
      <input
        id='website'
        bind:value={formModel.website}
        type='text'
        placeholder='Enter your Website URL'
        class='custom-input-text'
      />
    </div> -->
  <!--     <div>
      <label
        for='banner'
        class='custom-label'>
        Banner
      </label>
      <input
        id='banner'
        bind:value={formModel.banner}
        type='text'
        placeholder='Enter your Banner URL'
        class='custom-input-text'
      />
    </div> -->
  <!--     <div
      id="upload-avatar"
      class='custom-drop-area'>
      <p class="text-gray-600">Drag & drop your image here, or</p>
      <label class="cursor-pointer text-blue-500 underline">
        <input type="file" accept="image/*" class="hidden" onchange={uploadFile} />
        <span>Upload avatar</span>
      </label>
    </div> -->
  <button
    type='submit'
    class='custom-big-button'
    disabled={submitDisabled}
  >Update
  </button>
</form>

<!-- <div id='status'>
  <p class='text-lg text-green-600'>Unchanged: {unchanged}</p>
  <p class='text-lg text-green-600'>Sending: {sending}</p>
</div>
 -->
