import {expect, test} from 'vitest'

import {toMap} from '../../src/lib/util'

test('You never know what is possible in Javascript.', () => {
  expect(1 + 2).toBe(3)
})

test('toMap exported properly', () => {
  const map = toMap({a: 1})
  console.log(map)
  expect(map.get('a')).toBe(1)
  expect(map.get('b')).toBeUndefined()
})
