<script>
  import {onMount} from 'svelte'
  import {getCurrentWindow} from '@tauri-apps/api/window'
  import {open} from '@tauri-apps/plugin-shell'
  // import { getCurrentWebview } from '@tauri-apps/api/webview'
  import {finalizeEvent} from 'nostr-tools/pure'
  import {page} from '$app/state'
  import CopyButton from '$lib/CopyButton.svelte'

  let signedEventString = $state('')
  let fullCallbackUrl = $state('')
  let requestType = $state('')

  let eventLog = $state([])

  $effect(() => {
    const stored = localStorage.getItem('eventLog')
    if (stored) eventLog = JSON.parse(stored)
  })

  $effect(() => {
    localStorage.setItem('eventLog', JSON.stringify(eventLog))
  })

  const callback = () => {
    const [url] = fullCallbackUrl.split('?event=')
    const todo = {
      event: JSON.parse(signedEventString),
      requestType,
      action: 'callback',
      url,
      timestamp: Date.now(),
    }
    eventLog.push(todo)
    setTimeout(() => {
      location.href = '/'
    }, 2500)
    return open(fullCallbackUrl)
  }

  const copy = () => {
    const [url] = fullCallbackUrl.split('?event=')
    const todo = {
      event: JSON.parse(signedEventString),
      requestType,
      action: 'copy',
      url,
      timestamp: Date.now(),
    }
    eventLog.push(todo)
    setTimeout(() => {
      location.href = '/'
    }, 2500)
    return signedEventString
  }

  onMount(async () => {
    // eslint-disable-next-line no-undef
    if (PLATFORM === 'linux') {
      // console.debug('isFocused:', await getCurrentWindow().isFocused())
      await getCurrentWindow().setFocus()
      console.debug('isFocused:', await getCurrentWindow().isFocused())
    }
    const {
      event: unsigedEvent,
      callbackUrl,
      identities,
      type,
    } = page.data
    const [{secretKey}] = identities
    const signedEvent = finalizeEvent(unsigedEvent, secretKey)
    signedEventString = JSON.stringify(signedEvent)
    requestType = type
    const endpoint = encodeURIComponent(signedEventString)
    fullCallbackUrl = `${callbackUrl}${endpoint}`
    console.log('Authorization URL:', fullCallbackUrl)
  })
</script>

<div class='space-y-4 px-4'>
  <h1 class='text-2xl'>Signer</h1>
  <pre class='bg-gray-100 p-4 rounded overflow-x-auto max-w-full sm:max-w-md md:max-w-lg'>
    <code
      id='signed-event'
      class='language-json'
    >{signedEventString}</code>
  </pre>
  <CopyButton
    onClick={() => copy()}
    label='Copy signed event'
    icon=''
    message='Copied! Redirecting...'
    style='custom-big-button'
  />
  <button
    class='custom-big-button'
    onclick={() => callback()}
  >
    Sign
  </button>
</div>
<div>
  {#if eventLog}
    <h2>Event Log:</h2>
    {#each Array.from(eventLog) as todo}
      <p>{todo.requestType} {todo.action} {todo.url}</p>
    {/each}
  {/if}
</div>
