# [**@koa/is-json**](https://github.com/koajs/is-json)

[![npm version][npm-image]][npm-url]
[![build status][github-action-image]][github-action-url]
[![OpenCollective Backers][backers-image]][open-collective-url]
[![OpenCollective Sponsors][sponsors-image]][open-collective-url]

> Check if a body is JSON.

## Install

```sh
npm install @koa/is-json
```

## Usage

```js
import { createReadStream } from 'node:fs'
import isJSON from '@koa/is-json'

isJSON({ message: 'hello' }) // true
isJSON([1, 2, 3]) // true
isJSON('hello') // false
isJSON(Buffer.from('hello')) // false
isJSON(createReadStream('file.txt')) // false
isJSON(null) // false
isJSON(1n) // true
```

CommonJS:

```js
const { isJSON } = require('@koa/is-json')
```

## API

### `isJSON(body?)`

`isJSON` returns `true` for truthy values, except strings, buffers, and values
with a callable `pipe` property. It returns `false` otherwise.

### Types

Use `JsonValue` for JSON data: strings, numbers, booleans, `null`, and arrays or
objects containing those values.

Use `Jsonifiable` when your data also contains values with a `toJSON` method,
such as `Date` objects.

Use `JsonBody` for a body that could be `Jsonifiable`, a buffer, a readable
stream, or an object with a callable `pipe` method. A value with this type can
still return `false` from `isJSON`.

```ts
import { Buffer } from 'node:buffer'
import type { JsonValue, Jsonifiable, JsonBody } from '@koa/is-json'

const value: JsonValue = { message: 'hello', count: 2 }
const serializable: Jsonifiable = { createdAt: new Date() }
const body: JsonBody = Buffer.from('hello')
```

The package also exports `JsonPrimitive`, `JsonObject`, and `JsonArray` for
individual JSON shapes, and `PipeableBody` for objects with a callable `pipe`
method.

## Breaking changes

Moving from `koa-is-json` to `@koa/is-json` is low effort.

Replace `koa-is-json` with `@koa/is-json` in your dependencies.

> `koa-is-json` assigns the function to `module.exports` where
> `@koa/is-json` ships named and default exports.

so just do this:

```diff
-const isJSON = require('koa-is-json')
+const { isJSON } = require('@koa/is-json')
```

ESM callers are unaffected: `import isJSON from '@koa/is-json'` still works.

## License

[MIT](/LICENSE)

[npm-image]: https://img.shields.io/npm/v/%40koa%2Fis-json.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@koa/is-json
[github-action-image]: https://github.com/koajs/is-json/actions/workflows/ci.yml/badge.svg
[github-action-url]: https://github.com/koajs/is-json/actions/workflows/ci.yml
[backers-image]: https://opencollective.com/koajs/backers/badge.svg?style=flat-square
[sponsors-image]: https://opencollective.com/koajs/sponsors/badge.svg?style=flat-square
[open-collective-url]: https://opencollective.com/koajs
