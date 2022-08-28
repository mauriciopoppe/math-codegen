'use strict'
module.exports = function (node) {
  const self = this
  let arr = []
  this.rawify(this.options.rawArrayExpressionElements, function () {
    arr = node.nodes.map(function (el) {
      return self.next(el)
    })
  })
  const arrString = '[' + arr.join(',') + ']'

  if (this.options.raw) {
    return arrString
  }
  return this.options.factory + '(' + arrString + ')'
}
