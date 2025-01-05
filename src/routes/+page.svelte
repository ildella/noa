<script>
  import {message} from '@tauri-apps/plugin-dialog'
  import * as nip19 from 'nostr-tools/nip19'
  import {open} from '$lib/open-url'
  import AndroidStores from '$lib/layout/AndroidStores.svelte'
  import Apps from '$lib/layout/Apps.svelte'

  const {data} = $props()
  const {
    platform, identities, help, authorProfile,
  } = $derived(data)
  const isAndroid = $derived(platform === 'android')
  const {hex, npub} = $derived.by(() => {
    if (!identities) return {}
    const [{publicKey: hex}] = identities
    const npub = nip19.npubEncode(hex)
    return {hex, npub}
  })
  const sections = $state({
    identity: {},
    profile: {},
    stores: {},
    apps: {},
  })

  // const toggleCollapse = section => {
  //   sections[section].collapsed = !sections[section].collapsed
  //   const status = sections[section].collapsed
  //   sections[section].classes = status === true ? 'hidden' : ''
  // }

  const openNostrLink = async npub => {
    console.log({npub})
    if (!platform) return open(`https://njump.me/${npub}`)
    try {
      await open(`nostr://${npub}`)
    } catch (e) {
      console.debug(e)
      await open(`https://njump.me/${npub}`)
    }
  }

</script>

<div class='container'>
  <h2>Welcome</h2>
  <p>{help.welcome}</p>
</div>

<div class='container {sections.identity.classes}'>
  <h2>Identity</h2>
  <h5>Your personal key pair.
    <button
      aria-label='info'
      onclick={() => message(help.identity, {
        title: '',
        kind: 'info',
      })}
    >
    </button>
  </h5>
  <div
    id='actions'
    class='py-6'
  >
    <a
      class="custom-big-button {identities ? 'opacity-50 cursor-not-allowed' : ''}"
      disabled={identities}
      href='/auth/nostr'
    >Generate</a>
    <a
      class="custom-big-button {identities ? 'opacity-50 cursor-not-allowed' : ''}"
      disabled={identities}
      href='/auth/nostr/import'
    >Import
    </a>
    {#if identities}
      <a href={`/identities/${hex}`}>Manage</a>
    {/if}
  </div>
</div>

{#if identities}
  <div class='container'>
    <h2>Profile</h2>
    <h5>A personalized touch to your identity to make it into a nice User Profile.</h5>
    <div
      id='actions'
      class='py-6'
    >
      <a
        class='custom-big-button'
        href={`/profile/${hex}`}
      >Edit</a>
      <button
        class='clickable'
        aria-label='Open Nostr Profile'
        onclick={() => openNostrLink(npub)}
      >View (live)</button>
    </div>
  </div>

  {#if isAndroid}
    <AndroidStores />
  {/if}

  <Apps />
  <div class='container'>
    <h2>Now you are ready.</h2>
    <a
      class='text-xl text-noa-600'
      href='#/'
      tabindex='0'
      onclick={event => {
        event.preventDefault()
        openNostrLink(authorProfile)
      }}
    >
      Come say hello :)</a>
  </div>
  <!--
  <div class='container'>
    <h2>Advanced.</h2>
    <a
      class='text-xl text-noa-600'
      href='/signed'
    >
      See all past signed events.</a>
  </div>
   -->
{/if}
