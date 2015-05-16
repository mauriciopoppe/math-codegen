'use strict';

module.exports = function (node) {
  return this.next(node.expression);
};
