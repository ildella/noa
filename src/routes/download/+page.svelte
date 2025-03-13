<script>
  const {data} = $props()
  const {platforms} = data
</script>

<div class='container mx-auto p-4 max-w-sm'>
  <h1 class='text-3xl font-bold text-gray-700'>Downloads</h1>
  {#each Object.entries(platforms) as [platform, packages] (platform)}
    <div
      id={platform.toLowerCase()}
      class='mb-8 py-1'
    >
      <h2 class='text-xl font-semibold text-gray-600 flex items-center'>
        <!-- <img
          src={`../${platform.toLowerCase()}.png`}
          alt={platform}
          class='w-6 h-auto mr-2'
        /> -->
        {platform}
      </h2>
      <div class='flex flex-col mt-4 space-y-4'>
        {#each packages as {link, icon, name} (name)}
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            class='flex items-center bg-purple-50 hover:bg-gray-300 rounded-lg p-3 shadow-md transition duration-200 ease-in-out'
          >
            <img
              src={`../${icon}`}
              alt={name}
              class='w-6 h-auto mr-2'
            />
            <span>{name}</span>
          </a>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
</style>
