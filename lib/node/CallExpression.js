'use strict';
module.exports = function (node) {
  var self = this;
  var method = self.next(node.callee);
  var args = [];
  this.rawify(this.options.rawCallExpressionElements, function () {
    args = node.arguments.map(function (arg) {
      return self.next(arg);
    });
  });
  return method + '(' + args.join(', ') + ')';
};
