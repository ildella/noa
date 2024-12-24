<script>
  import {fly} from 'svelte/transition'

  const {children, pathname = ''} = $props()

</script>

{#key pathname}
  <div in:fly={{x: -5, duration: 500, delay: 500}}>
    <!-- <slot /> -->
    {@render children?.()}
  </div>
{/key}
