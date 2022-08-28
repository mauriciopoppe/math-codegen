'use strict'

module.exports = function (node) {
  const condition = '!!(' + this.next(node.condition) + ')'
  const trueExpr = this.next(node.trueExpr)
  const falseExpr = this.next(node.falseExpr)
  return '(' + condition + ' ? (' + trueExpr + ') : (' + falseExpr + ') )'
}
