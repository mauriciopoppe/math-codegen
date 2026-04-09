'use strict'
module.exports = function (node) {
  if (this.options.raw) {
    return node.value
  }
  const value = node.valueType === 'string' ? JSON.stringify(node.value) : node.value
  return this.options.factory + '(' + value + ')'
}
