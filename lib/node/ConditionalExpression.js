/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

module.exports = function (node) {
  var condition = '!!(' + this.next(node.test) + ')';
  var trueExpr = this.next(node.consequent);
  var falseExpr = this.next(node.alternate);
  return '(' + condition + ' ? (' + trueExpr + ') : (' + falseExpr + ') )';
};
