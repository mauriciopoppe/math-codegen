/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
function equalOperator(node) {
  return '(scope["' + node.left.name + '"] = ' + node.right + ')';
}

function equalPreProcessOperator(node) {
  node.right = this.next(node.right);
  return equalOperator(node);
}

function binaryProxy(node, operator) {
  var right = {
    type: 'BinaryExpression',
    operator: operator,
    left: node.left,
    right: node.right
  };
  return equalOperator({
    left: node.left,
    right: this.next(right)
  });
}

function binaryEqualOperator(operator) {
  return function (node) {
    // `this` is the Interpreter instance here
    return binaryProxy.call(this, node, operator);
  };
}

// https://github.com/estree/estree/blob/master/spec.md#binaryoperator
var operators = {
  '=': equalPreProcessOperator,
  '+=': binaryEqualOperator('+'),
  '-=': binaryEqualOperator('-'),
  '*=': binaryEqualOperator('*'),
  '/=': binaryEqualOperator('/'),
  '%=': binaryEqualOperator('%'),

  '<<=': binaryEqualOperator('<<'),
  '>>=': binaryEqualOperator('>>'),
  '>>>=': binaryEqualOperator('>>>'),

  '|=': binaryEqualOperator('|'),
  '^=': binaryEqualOperator('^'),
  '&=': binaryEqualOperator('&')
};

module.exports = function (node) {
  return operators[node.operator].call(this, node);
};
