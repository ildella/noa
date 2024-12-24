<script>
  const {data} = $props()
</script>

<div class='container mx-auto'>
  <h1 class='text-2xl font-bold mb-4'>Nostr identity generated.</h1>
  <div class='text-lg space-y-2'>
    <p>Congratulations! This was easy, right? :)</p>
    <p id='public-key'>{data.publicKey}</p>
    <div class='flex items-center space-x-1'>
      <a
        href={`/profile/${data.publicKey}`}
        class='clickable'
      >Complete a Profile</a>
      <span>associated with this identity.</span>
    </div>
    <div class='flex items-center space-x-1'>
      <a
        href={`/identities/${data.publicKey}`}
        class='clickable'
      >View and backup</a>
      <span>this new identity.</span>
    </div>
  </div>
</div>
