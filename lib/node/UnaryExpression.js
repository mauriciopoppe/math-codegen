'use strict';

var operators = require('../misc/UnaryOperator');

module.exports = function (node) {
  if (this.options.raw) {
    if (node.prefix) {
      return node.operator + this.next(node.argument);
    } else {
      return this.next(node.argument) + node.operator;
    }
  }

  if (!(node.operator in operators)) {
    throw SyntaxError(node.operator + ' not implemented');
  }

  // transform to CallExpression
  var unaryNode = {
    callee: {
      type: 'Identifier',
      name: operators[node.operator]
    },
    arguments: [node.argument]
  };

  return this.CallExpression(unaryNode);
};
