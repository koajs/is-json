import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import type * as CommonJSIsJSON from '@koa/is-json' with {
  'resolution-mode': 'require'
}

const packageName = '@koa/is-json'
const require = createRequire(import.meta.url)

export type CommonJSConsumerFixture = [
  CommonJSIsJSON.Jsonifiable,
  typeof CommonJSIsJSON.default,
  typeof CommonJSIsJSON.isJSON
]
export type ESMConsumerFixture = [
  import('@koa/is-json').Jsonifiable,
  typeof import('@koa/is-json').isJSON
]

test('exposes named and default ESM exports', async () => {
  const { default: esmDefault, isJSON: esmNamed } = await import(packageName)
  assert.equal(typeof esmNamed, 'function')
  assert.equal(esmDefault, esmNamed)
})

test('exposes named and default CommonJS exports', () => {
  const commonJS = require(packageName)
  assert.equal(typeof commonJS.isJSON, 'function')
  assert.equal(commonJS.default, commonJS.isJSON)
})

test('classifies bodies through both package entrypoints', async () => {
  const { isJSON: esmNamed } = await import(packageName)
  const commonJS = require(packageName)
  assert.equal(esmNamed({ message: 'hello' }), true)
  assert.equal(esmNamed(Buffer.from('hello')), false)
  assert.equal(esmNamed(1n), true)
  assert.equal(commonJS.isJSON({ message: 'hello' }), true)
  assert.equal(commonJS.isJSON(Buffer.from('hello')), false)
  assert.equal(commonJS.isJSON(1n), true)
})
