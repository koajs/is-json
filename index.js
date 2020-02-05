
/**
 * Check if `body` should be interpreted as json.
 *
 */

module.exports = function isJSON (body) {
  return !(
    !body ||
    typeof body === 'string' ||
    typeof body.pipe === 'function' ||
    Buffer.isBuffer(body)
  )
}
