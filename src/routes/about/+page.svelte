<script>
  import {page} from '$app/state'
  const {data: {platform, about: {currentVersion}}} = page
</script>
<div class='p-6'>
  <h1 class='text-2xl font-bold mb-4'>NOA</h1>
  <h2 class='text-xl font-semibold mb-4'>Nostr Onboarding App</h2>
  <a
    href='https://github.com/ildella/noa'
    target='_blank'
    rel='noopener noreferrer'
    class='flex items-center text-blue-600 hover:underline'
  >
    <img
      src='https://img.icons8.com/material-outlined/24/000000/github.png'
      alt='GitHub Icon'
      class='mr-2'
    />
    <span class='font-semibold'>NOA on GitHub</span>
  </a>
  <p>Version: {currentVersion} {platform}</p>
</div>
