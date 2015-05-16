'use strict';

var operators = require('../misc/BinaryOperator');

module.exports = function (node) {
  if (this.options.raw) {
    return ['(' + this.next(node.left), node.operator, this.next(node.right) + ')'].join(' ');
  }

  if (!(node.operator in operators)) {
    throw SyntaxError(node.operator + ' not implemented');
  }

  // transform to CallExpression
  var binaryNode = {
    callee: {
      type: 'Identifier',
      name: operators[node.operator]
    },
    arguments: [node.left, node.right]
  };

  return this.CallExpression(binaryNode);
};
