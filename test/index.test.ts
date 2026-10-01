import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { Readable } from 'node:stream'
import { describe, it } from 'node:test'

import isJSON, {
  type JsonArray,
  type JsonBody,
  type Jsonifiable,
  type JsonObject,
  type JsonValue,
  type PipeableBody
} from '../src/index.ts'

describe('isJSON', () => {
  it('returns false when no body is provided', () => {
    assert.equal(isJSON(), false)
  })

  const rejectedBodies: Array<{ name: string; body: JsonBody | undefined }> = [
    { name: 'undefined', body: undefined },
    { name: 'null', body: null },
    { name: 'false', body: false },
    { name: 'zero', body: 0 },
    { name: 'an empty string', body: '' },
    { name: 'a string', body: 'hello' },
    { name: 'a Buffer', body: Buffer.from('hello') },
    { name: 'a readable stream', body: Readable.from(['hello']) },
    { name: 'an object with a pipe method', body: { pipe: () => 'hello' } }
  ]

  rejectedBodies.forEach(({ name, body }) => {
    it(`returns false for ${name}`, () => {
      assert.equal(isJSON(body), false)
    })
  })

  const acceptedBodies: Array<{ name: string; body: JsonBody }> = [
    { name: 'true', body: true },
    { name: 'a non-zero number', body: 42 },
    { name: 'an empty object', body: {} },
    { name: 'a nested object', body: { message: 'hello', count: 2 } },
    { name: 'an empty array', body: [] },
    { name: 'an array', body: ['hello', 2, null] },
    {
      name: 'an object with a non-function pipe property',
      body: { pipe: 'value' }
    },
    { name: 'a Date', body: new Date('2024-01-01T00:00:00.000Z') },
    {
      name: 'an object with a toJSON method',
      body: { toJSON: () => ({ message: 'hello' }) }
    }
  ]

  acceptedBodies.forEach(({ name, body }) => {
    it(`returns true for ${name}`, () => {
      assert.equal(isJSON(body), true)
    })
  })

  it('does not narrow rejected strings to pipeable bodies', () => {
    const assertRejectedBody = (body: string | PipeableBody) => {
      if (isJSON(body)) assert.fail('Expected a rejected body')

      // @ts-expect-error A rejected body can still be a string.
      const pipeable: PipeableBody = body
      assert.equal(pipeable, body)
    }

    assertRejectedBody('hello')
    assertRejectedBody({ pipe: () => 'hello' })
  })

  it('accepts unknown bodies without narrowing them', () => {
    const pipeableFunction = Object.assign(() => {}, {
      pipe: () => 'hello'
    })
    const unknownBodies: Array<{
      name: string
      body: unknown
      expected: boolean
    }> = [
      { name: 'NaN', body: Number.NaN, expected: false },
      {
        name: 'a function with a pipe method',
        body: pipeableFunction,
        expected: false
      },
      { name: 'a BigInt', body: 1n, expected: true },
      { name: 'a Symbol', body: Symbol('value'), expected: true },
      { name: 'a bare function', body: () => {}, expected: true }
    ]

    unknownBodies.forEach(({ name, body, expected }) => {
      const result: boolean = isJSON(body)

      if (result) {
        // @ts-expect-error Unknown inputs are classified but not narrowed.
        const jsonifiable: Jsonifiable = body
        assert.equal(jsonifiable, body)
      }

      assert.equal(result, expected, name)
    })
  })
})

describe('body inspection', () => {
  it('accepts circular bodies without traversing them', () => {
    const body: { self?: unknown } = {}
    body.self = body

    assert.equal(isJSON(body), true)
  })

  it('does not read nested properties', () => {
    const body = {
      nested: {
        get value() {
          return assert.fail('Nested properties should not be read')
        }
      }
    }

    assert.equal(isJSON(body), true)
  })

  it('does not call toJSON', () => {
    const body = {
      toJSON() {
        assert.fail('toJSON should only run during serialization')
      }
    }

    assert.equal(isJSON(body), true)
  })

  it('preserves errors from a pipe getter', () => {
    const error = new Error('Cannot read pipe')
    const body = {
      get pipe() {
        throw error
      }
    }

    assert.throws(() => isJSON(body), error)
  })
})

export const jsonValues: JsonValue[] = [
  null,
  true,
  false,
  0,
  1,
  '',
  'text',
  { nested: [null, false, 1, 'text'] },
  [null, true, 1, 'text']
]
export const jsonObject: JsonObject = { nested: { list: ['value'] } }
export const jsonArray: JsonArray = [jsonValues, jsonObject]
// @ts-expect-error Undefined is not a JSON value.
export const undefinedJsonValue: JsonValue = undefined
export const jsonifiables: Jsonifiable[] = [
  ...jsonValues,
  new Date(),
  { createdAt: new Date() },
  { toJSON: () => ({ status: 'ready' }) }
]
export const jsonBody: JsonBody = { status: 'ready' }

// @ts-expect-error BigInt is not JSON-compatible.
export const bigintJsonifiable: Jsonifiable = 1n
// @ts-expect-error Symbols are not JSON-compatible.
export const symbolJsonifiable: Jsonifiable = Symbol('value')
// @ts-expect-error Date is JSONifiable but not a plain JSON value.
export const dateJsonValue: JsonValue = new Date()
// @ts-expect-error Undefined is not JSONifiable as a top-level value.
export const undefinedJsonifiable: Jsonifiable = undefined
// @ts-expect-error Object properties must contain recursive JSON values.
export const invalidJsonObject: JsonObject = { value: undefined }
// @ts-expect-error Array elements must contain recursive JSON values.
export const invalidJsonArray: JsonArray = [Symbol('value')]
// @ts-expect-error Undefined is not a JSON array element.
export const undefinedJsonArray: JsonArray = [undefined]
// @ts-expect-error Jsonifiable object properties must be Jsonifiable.
export const invalidNestedJsonifiable: Jsonifiable = { value: [1n] }
// @ts-expect-error Functions are not JSONifiable without a supported object shape.
export const functionJsonifiable: Jsonifiable = () => ({ status: 'ready' })
