'use strict'

module.exports = function (node) {
  var id = node.name
  return '$$mathCodegen.getProperty("' + id + '", scope, ns)'
}
