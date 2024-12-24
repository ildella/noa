// const relayConnection = () => {
//   // console.log('setup relay connection.')
//   if ('serviceWorker' in navigator) {
//     console.log('Service workers available.')
//     addEventListener('load', function () {
//       console.log('Service worker listener: load')
//       navigator.serviceWorker.register('../service-worker.js')
//     })
//   }
// }

import {Relay} from 'nostr-tools/relay'
// import { SimplePool } from 'nostr-tools/pool'

let relay
let isConnected = false

const relays = ['wss://relay.damus.io']

const connect = async () => {
  if (!isConnected) {
    relay = await Relay.connect(relays[0])
    console.log(`Connected to Relay: ${relay.url}`)
    isConnected = true
  }
}

const subscribe = async ({
  authors, kinds, since, onEvent, onClose,
}) => {
  await connect()

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
