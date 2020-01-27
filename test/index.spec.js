
const assert = require('assert')
const isJSON = require('..')

describe('koa-is-json test', () => {
  let body

  it('Condition 1: !body', () => {
    assert.ok(!isJSON())
  })

  it('Condition 2: \'string\' == typeof body', () => {
    body = 'hello world !'
    assert.ok(!isJSON(body))
  })

  it('Condition 3: \'function\' == typeof body.pipe', () => {
    body = {
      pipe: () => {
        return 'hello world !'
      }
    }

    assert.ok(!isJSON(body))
  })

  it('Condition 4: check null', () => {
    assert.ok(!isJSON(null))
  })

  it('Condition 5: check correct body', () => {
    body = JSON.parse(JSON.stringify({ msg: 'hello world !' }))
    assert.ok(isJSON(body))
  })
})
