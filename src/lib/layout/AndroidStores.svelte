<script>
  import {stores} from '$lib/stores'
  import {open} from '$lib/open-url'
</script>
<div class='container'>
  <div class='mb-4'>
    <h2>Stores</h2>
    <h5>A Nostr friendly app store is optional, but strongly recommended.</h5>
    <p>(Click will download and install.)</p>
  </div>
  <div class='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
    {#each stores as appStore}
      <div class='bg-white p-4 rounded-sm shadow-sm'>
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
