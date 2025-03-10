import {querySync} from '$lib/relays-pool-connection'
import * as nip19 from 'nostr-tools/nip19'

export async function load ({parent}) {
  // const {identities} = await parent()
  // const [{publicKey: hex}] = identities
  const {data: hex} = nip19.decode('npub1ncdaqhk5rea29hdpaxmyhzay3d5mkrattg3dgs4yjkcml99fkqcqz4r8ar')
  // console.log({hex})
  const messages = await querySync({
    authors: [hex],
    kinds: [1],
    // since,
    limit: 3,
  })
  return {messages}
}
