'use strict'

module.exports = function (node) {
  return 'scope[' + JSON.stringify(node.name) + '] = ' + this.next(node.expr)
}
