<script>
  import {fade} from 'svelte/transition'

  export let onClick = () => 'Replace me'
  export let isDisabled = false
  export let label = 'Click me!'
  export let duration = 1000
  export let icon = 'fa-share'
  export let message = 'Copied to clipboard.'
  export let style = ''
  export let aria = ''
  export let title = ''

  let copied = false

  const copyToClipboard = async () => {
    const text = await onClick()
    await navigator.clipboard.writeText(text)
    copied = true
    setTimeout(() => {
      copied = false
    }, duration)
  }
</script>

{#if copied}
  <div
    transition:fade={{duration}}
    class='custom-overlay-text-transition'
  >
    {message}
  </div>
{/if}

<button
  on:click={copyToClipboard}
  aria-label={aria}
  title={title}
  class={style}
  disabled={isDisabled}
>
  <i class='fa {icon} mr-2'></i>
  <span>{label}</span>
</button>
