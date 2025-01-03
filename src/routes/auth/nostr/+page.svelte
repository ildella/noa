<script>
  const {data} = $props()
</script>

<div class='container mx-auto p-4'>
  <h1 class='text-3xl font-bold mb-6 text-center'>Nostr Identity Generated</h1>
  <div class='text-lg space-y-4'>
    <p class='text-center'>Congratulations! This was easy, right?</p>

    <div class='flex items-center space-x-3 bg-gray-100 p-4 rounded-lg shadow-md'>
      <i class='fas fa-user-circle text-4xl text-blue-600'></i>
      <div class='flex-1'>
        <div class='flex items-center space-x-1'>
          <a
            href={`/profile/${data.publicKey}`}
            class='clickable font-semibold text-blue-600'
          >Complete Profile</a>
          <span>associated with this identity.</span>
        </div>
      </div>
    </div>

    <div class='flex items-center space-x-3 bg-gray-100 p-4 rounded-lg shadow-md'>
      <i class='fas fa-lock text-4xl text-green-600'></i>
      <div class='flex-1'>
        <div class='flex items-center space-x-1'>
          <a
            href={`/identities/${data.publicKey}`}
            class='clickable font-semibold text-green-600'
          >View and Backup</a>
          <span>this new identity.</span>
        </div>
      </div>
    </div>
  </div>
</div>
