
/**
 * Check if `body` should be interpreted as json.
 *
 */

module.exports = function (body) {
  return !(
    !body ||
    typeof body === 'string' ||
    typeof body.pipe === 'function'
  )
}
