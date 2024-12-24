<script>
  import {onMount} from 'svelte'
  import {message} from '@tauri-apps/plugin-dialog'
  import {categories} from '$lib/apps'
  import {stores} from '$lib/stores'
  import * as nip19 from 'nostr-tools/nip19'
  import {open} from '$lib/open-url'
  import {nostrsigner, biometric} from '$lib/support'

  const {data} = $props()
  const {
    platform, identities, help, authorProfile, platforms,
  } = $derived(data)
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

  const toMap = json => new Map(Object.entries(json))

  // const toggleCollapse = section => {
  //   sections[section].collapsed = !sections[section].collapsed
  //   const status = sections[section].collapsed
  //   sections[section].classes = status === true ? 'hidden' : ''
  // }

  const storeUrlByOs = toMap({
    android: identifier => `https://play.google.com/store/apps/details?id=${identifier}`,
    ios: identifier => `https://apps.apple.com/app/${identifier}`,
    // linux: identifier => `???/${identifier}`,
    windows: identifier => `ms-windows-store://pdp/?ProductId=${identifier}`,
    osx: identifier => `macappstore://itunes.apple.com/app/id${identifier}`,
  })

  const openInStore = async (os, identifier) => {
    console.log(os, identifier)
    if (os === 'web')
      return open(identifier)
    if (platform === 'android' && os === 'android') {
      try {
        await open(`zapstore://${identifier}`)
        return
      } catch (e) {
        console.debug(e)
      }
    }
    const url = storeUrlByOs.get(os)(identifier)
    return open(url)
  }

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

  onMount(() => {
    nostrsigner()
      .then(() => ({})).catch(error => console.error(error))
    biometric()
      .then(() => ({})).catch(error => console.error(error))
  })

</script>

<div class='container'>
  <h2>Welcome</h2>
  <p>{help.welcome}</p>
</div>

<div class='container {sections.identity.classes}'>
  <h2>Identity</h2>
  <h5>Your self-generated personal key pair.
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

<div class='container {identities ? '' : 'hidden'}'>
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

<div class='container {platform === 'android' ? '' : 'hidden'}'>
  <div class='mb-4'>
    <h2>Stores</h2>
    <h5>A Nostr friendly app store is optional, but strongly recommended.</h5>
    <p>(Click will download and install.)</p>
  </div>
  <div class='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
    {#each stores as appStore}
      <div class='bg-white p-4 rounded shadow'>
        <button onclick={() => open(appStore.download)}>
          <img
            src={appStore.logo}
            alt='{appStore.name} Logo'
            class='mb-2 w-32 h-32 object-cover'
          >
        </button>
        <h3 class='font-semibold'>{appStore.name}</h3>
        <p>{appStore.description}</p>
      </div>
    {/each}
  </div>
</div>

<div class='container'>
  <div class='mb-4'>
    <h2>Apps</h2>
    <h5>A short selection of Nostr apps, divided by category.</h5>
  </div>
  {#each categories as category}
    <div class='mb-8'>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <div class='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {#each category.apps as app}
          <div class='bg-white p-4 rounded shadow'>
            <img
              src={app.logo}
              alt='{app.name} Logo'
              class='mb-2 w-32 h-32 object-cover'
            >
            <h4>{app.name}</h4>
            {#each platforms as os}
              {#if app.identifiers[os]}
                <button
                  class='custom-mid-button m-1'
                  onclick={() => openInStore(os, app.identifiers[os])}
                >{os}</button>
              {/if}
            {/each}
            <p class='mt-2'>{app.description}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

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

<!-- <div class='container'>
  <h2>Advanced.</h2>
  <a
    class='text-xl text-noa-600'
    href='/signed'
  >
    See all past signed events.</a>
</div>
 -->
