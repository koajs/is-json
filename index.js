
/**
 * Check if `body` should be interpreted as json.
 *
 */

module.exports = function isJSON (body) {
  return !(
    body === undefined ||
    body === null ||
    typeof body === 'string' ||
    (body && typeof body.pipe === 'function') ||
    Buffer.isBuffer(body)
  )
}
