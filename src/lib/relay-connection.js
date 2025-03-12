import {Relay} from 'nostr-tools/relay'

let relay
let isConnected = false

const relays = [
  'relay.damus.io',
  'relay.primal.net',
  // 'eden.nostr.land',
  'relay.vengeful.eu',
  'relay.nostr.band',
]

const connect = async () => {
  const max = relays.length - 1
  const random = Math.floor(Math.random() * max)
  if (!isConnected) {
    console.debug({isConnected, random})
    relay = await Relay.connect(`wss://${relays[random]}`)
    isConnected = true
  }
  return relay
}

const subscribe = ({
  authors, kinds, since, onEvent, onClose,
}) => {
  // await connect()

  const sub = relay.subscribe(
    [{authors, kinds, since}],
    {
      onevent (event) {
        console.debug('We got the event we wanted:', event)
        onEvent(event)
      },
      onclose () {
        console.debug('Closing relay subscription.')
        // sub.close()
        if (onClose) onClose()
      },
    }
  )

  console.log(`Listening for kinds: ${kinds} for authors: ${authors}`)
  return sub
}

const publish = event => relay.publish(event)

const closeConnection = () => {
  if (relay) {
    relay.close()
    isConnected = false
    console.log('Relay connection closed.')
  }
}

export {
  connect,
  subscribe,
  publish,
  closeConnection,
}
