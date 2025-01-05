<script>
  import {page} from '$app/state'
  import {categories} from '$lib/apps'
  import {toMap} from '$lib/util'

  const {platform, platforms} = page.data

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

</script>
<div class='container'>
  <div class='mb-4'>
    <h2>Apps</h2>
    <h5>A short selection of Nostr apps.</h5>
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
