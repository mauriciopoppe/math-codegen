/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
function equalOperator(node) {
  return '(scope["' + node.left.name + '"] = ' + this.next(node.right) + ')';
}

// https://github.com/estree/estree/blob/master/spec.md#binaryoperator
var operators = {
  '=': equalOperator
};

module.exports = function (node) {
  if (!(node.operator in operators)) {
    throw new SyntaxError(node.operator + ' not implemented');
  }
  return operators[node.operator].call(this, node);
};
