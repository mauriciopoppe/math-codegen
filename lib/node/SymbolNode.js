'use strict'

module.exports = function (node) {
  const id = node.name
  return '$$mathCodegen.getProperty(' + JSON.stringify(id) + ', scope, ns)'
}
