<script>

  import {subDays, getUnixTime} from 'date-fns'
  import {
    subscribe, querySync, disconnect, publish,
  } from '$lib/relays-pool-connection'
  import * as nip19 from 'nostr-tools/nip19'

  const {data} = $props()
  // console.log(data.messages)
  const {messages, currentProfileHex} = data
  const receivedEvents = $state([])
  const displayedMessages = $derived([
    ...messages,
    ...receivedEvents,
  ])
  console.log(displayedMessages)

  $effect(async () => {
    console.log('effect')
    await subscribe({
      authors: [currentProfileHex],
      kinds: [1],
      onevent: event => {
        console.log(event)
        receivedEvents.push(event)
      },
    })
  })

</script>

<div id='chats'>
  <h2>Chats</h2>
  <ul>
    {#if displayedMessages}
      {#each displayedMessages as {
        id, content, created_at, pubkey, tags,
      } (id)}
        <li>
          <span>{pubkey}: {content}</span>
          <span>at ${created_at}</span>
          <span>${tags}</span>
        </li>
      {/each}
    {/if}
  </ul>
</div>
