<script>
  import {subDays, getUnixTime} from 'date-fns'
  import {subscribe, disconnect, publish} from '$lib/relays-pool-connection'

  const {data} = $props()
  const {posts, currentProfileHex} = data
  const receivedEvents = $state([])
  const displayedPosts = $derived([
    ...posts,
    ...receivedEvents,
  ])
  console.log(displayedPosts)

  $effect(async () => {
    const since = subDays(Date.now(), 200)
    console.log('Subscribe since:', since)
    await subscribe({
      authors: [currentProfileHex],
      kinds: [1],
      since: getUnixTime(since),
      onevent: event => {
        console.log(event)
        receivedEvents.push(event)
      },
    })
  })

</script>

<div id='chats'>
  <h2>Posts</h2>
  <ul class='space-y-4'>
    {#each displayedPosts as {
      id, content, created_at, pubkey, tags,
    } (id)}
      <li class='p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition duration-200'>
        <div class='text-sm font-medium text-gray-700'>{pubkey}</div>
        <p class='mt-1 text-gray-600'>{content}</p>
        <div class='mt-2 flex justify-between text-xs text-gray-500'>
          <span>at {created_at}</span>
          <span>{tags.join(', ')}</span> <!-- Assuming tags is an array -->
        </div>
      </li>
    {/each}
  </ul>
</div>
