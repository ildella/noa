import {Dexie} from 'dexie'

export const db = new Dexie('Noa')

db.version(1).stores({
  incoming: '++id, proofs, quote, amount',
  quotes: '++id, quote, amount, request',
  proofs: 'id, amount',
})
