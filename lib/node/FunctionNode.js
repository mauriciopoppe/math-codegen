'use strict'
var SymbolNode = require('mr-parser').nodeTypes.SymbolNode

var functionProxy = function (node) {
  return '$$mathCodegen.functionProxy(' + this.next(new SymbolNode(node.name)) + ', "' + node.name + '")'
}

module.exports = function (node) {
  var self = this
  // wrap in a helper function to detect the type of symbol it must be a function
  // NOTE: if successful the wrapper returns the function itself
  // NOTE: node.name should be a symbol so that it's correctly represented as a string in SymbolNode
  var method = functionProxy.call(this, node)
  var args = []
  this.rawify(this.options.rawCallExpressionElements, function () {
    args = node.args.map(function (arg) {
      return self.next(arg)
    })
  })
  return method + '(' + args.join(', ') + ')'
}

module.exports.functionProxy = functionProxy
