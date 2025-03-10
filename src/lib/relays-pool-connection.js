import {SimplePool} from 'nostr-tools/pool'

import {relayURLs} from './relays'

const pool = new SimplePool()

const disconnect = () => pool.close(relayURLs)

const subscribe = ({
  authors, kinds, since, onEvent, onClose,
}) => {
  // console.log({authors, kinds, since})
  return pool.subscribeMany(relayURLs, [{authors, kinds, since}], {
    onevent (event) {
      console.debug('Event received:', event)
      onEvent(event)
    },
    onclose () {
      console.debug('Closing relays subscriptions.')
      if (onClose) onClose()
    },
  })
}

const querySync = async ({authors, kinds, limit = 2}) => {
  const events = await pool.querySync(relayURLs, {
    authors,
    kinds,
    limit,
  })
  // console.debug({events})
  return events
  // const uniqueEvents = new Set(events.map(evt => evt.id))
  // return uniqueEvents
}

const publish = event => Promise
  .all(pool.publish(relayURLs, event))
  .then(publishResult => {
    console.log({publishResult})
    return publishResult
  })

export {
  // connect,
  subscribe,
  publish,
  disconnect,
  querySync,
}
