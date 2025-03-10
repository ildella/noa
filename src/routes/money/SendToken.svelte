<script>
  const {sendCash} = $props()

  const title = 'Send cash as token.'
  const actionLabel = 'Send.'
  let amount = $state()

</script>
<div class='flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow-md'>
  <h3>{title}</h3>
  <input
    type='number'
    bind:value={amount}
    placeholder='Quote Identifier'
    class='p-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500'
  /><!--
  <input
    type='text'
    bind:value={amount}
    placeholder='Amount in Sats'
    class='p-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500'
  /> -->
  <button
    class='custom-mid-button p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500'
    onclick={() => sendCash({amount})}
    disabled={!amount}
  >
    {actionLabel}
  </button>
</div>
