import { Buffer } from 'node:buffer'

export type JsonPrimitive = string | number | boolean | null
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[] | readonly JsonValue[]
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

type JsonifiableObject =
  | { [Key in string]?: Jsonifiable }
  | { toJSON: () => Jsonifiable }

type JsonifiableArray = readonly Jsonifiable[]

export type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray

export type PipeableBody = {
  pipe: (...args: never[]) => unknown
}

export type JsonBody =
  | Jsonifiable
  | Buffer
  | NodeJS.ReadableStream
  | PipeableBody

const hasPipeMethod = (body: NonNullable<unknown>): body is PipeableBody => {
  if (typeof body !== 'object' && typeof body !== 'function') return false

  return typeof Reflect.get(body, 'pipe') === 'function'
}

export function isJSON(body?: unknown): boolean {
  if (!body || typeof body === 'string') return false

  return !hasPipeMethod(body) && !Buffer.isBuffer(body)
}

export default isJSON
