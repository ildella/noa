<script>
  // import {page} from '$app/state'
  // const {data: {about: {currentVersion}}} = page

  const platforms = [
    {name: 'Android', icon: 'https://cdn-icons-png.flaticon.com/512/226/226770.png', link: '#'},
    {name: 'macOS', icon: 'https://cdn.simpleicons.org/apple', link: '#'},
    {name: 'Linux', icon: 'https://cdn-icons-png.flaticon.com/512/6124/6124995.png', link: '#'},
    {name: 'Windows', icon: 'https://pngimg.com/uploads/windows_logos/windows_logos_PNG31.png', link: '#'},
  ]
</script>

<div class='bg-purple-50 p-8 text-center rounded-lg shadow-sm mb-12'>
  <h1 class='text-3xl font-bold text-gray-900'>
    Your Nostr Identity in Seconds
  </h1>
  <p class='text-lg text-gray-600'>
    The decentralized, uncensorable, and secure way to connect online.
  </p>
</div>

<div
  id='start-web'
  class='p-8'
>
  <div class='text-center'>
    <a
      href='/home'
      class='bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors'
    >
      Get Started Here
    </a>
    <p class='p-8 text-gray-600 font-semibold'>Create and use your new profile in just 2 steps, without leaving the browser.</p>
  </div>
</div>

<!-- <div
  id='download'
  class='text-center'
>
  <h2 class='text-2xl font-semibold text-gray-700'>
    Download for Your Platform
  </h2>
  <div class='flex flex-wrap justify-center gap-4 sm:flex-col md:flex-row'>
    {#each platforms as {name, icon, link} (name)}
      <a
        href={link}
        class='flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'
      >
        <img
          src={icon}
          alt={name}
          class='w-12 h-12 mb-2'
        />
        <span class='text-gray-700 font-medium'>{name}</span>
      </a>
    {/each}
  </div>
</div>
 -->

<div class='p-8 text-center text-sm text-gray-500'>
  <p>
    Learn more at <a
      href='https://nostr.org'
      class='text-blue-500 hover:underline'
    >nostr.org</a>
  </p>
</div>
