'use strict';

var operators = require('../misc/UnaryOperator');

module.exports = function (node) {
  if (this.options.raw) {
    return node.operator + this.next(node.argument);
  }

  if (!(node.operator in operators)) {
    throw new SyntaxError(node.operator + ' not implemented');
  }

  // transform to CallExpression
  var unaryNode = {
    callee: {
      type: 'Identifier',
      name: operators[node.operator]
    },
    arguments: [node.argument]
  };

  /* eslint-disable new-cap */
  return this.CallExpression(unaryNode);
  /* eslint-enable new-cap */
};
