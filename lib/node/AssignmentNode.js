'use strict'
function equalOperator (node) {
  return '(scope["' + node.name + '"] = ' + node._expr + ')'
}

function equalPreProcessOperator (node) {
  node._expr = this.next(node.expr)
  return equalOperator(node)
}

var operators = {
  '=': equalPreProcessOperator
}

module.exports = function (node) {
  return operators['='].call(this, node)
}
