
module.exports = isJSON

/**
 * Check if `body` should be interpreted as json.
 */

function isJSON (body) {
  if (!body) return false
  if (typeof body === 'string') return false
  if (typeof body.pipe === 'function') return false
  if (Buffer.isBuffer(body)) return false
  return true
}
