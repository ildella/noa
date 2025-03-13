<script>
  import {page} from '$app/state'
  const {data: {platform, about: {currentVersion}}} = page
</script>
<div class='p-4 text-gray-700'>
  <h1 class='text-2xl font-bold'>NOA</h1>
  <h2 class='text-xl font-semibold'>a Nostr Onboarding App</h2>
  <a
    href='https://github.com/ildella/noa'
    target='_blank'
    rel='noopener noreferrer'
    class='flex items-center clickable'
  >
    <img
      src='/github.png'
      alt='GitHub Icon'
      class='mr-2'
    />
    <span class=''>NOA on GitHub</span>
  </a>
  <p class='mt-6'>{platform} {currentVersion}</p>
</div>
