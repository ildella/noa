import {Dexie} from 'dexie'

export const db = new Dexie('Noa')

db.version(1).stores({
  incoming: '++id, proofs, quote, amount',
})
