/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

// https://github.com/estree/estree/blob/master/spec.md#binaryoperator
var operators = {
  '=': equalOperator
};

function equalOperator(node) {
  return '(scope["' + node.left.name + '"] = ' + this.next(node.right) + ')';
}

module.exports = function (node) {
  if (!(node.operator in operators)) {
    throw SyntaxError(node.operator + ' not implemented');
  }
  return operators[node.operator].call(this, node);
};
