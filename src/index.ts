
/**
 * Check if `body` should be interpreted as json.
 *
 */
export const isJSON = (body?: any): boolean => {
  return !(
    !body ||
    typeof body === 'string' ||
    typeof body.pipe === 'function' ||
    Buffer.isBuffer(body)
  )
}

export default isJSON;
