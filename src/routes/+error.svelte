<script>
  import {onMount} from 'svelte'

  const {data} = $props()

  onMount(() => {
    console.error(data)
  })
</script>
<div>
  <h1>An error occurred</h1>
  <a
    class='text-blue-500'
    href='/'
  >Back to Home page</a>
</div>
