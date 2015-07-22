'use strict'

module.exports = function (node) {
  return 'scope["' + node.name + '"] = ' + this.next(node.expr)
}
