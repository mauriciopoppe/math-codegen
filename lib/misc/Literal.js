'use strict';
module.exports = function (node) {
  // TODO: check the type of node.value/node.raw
  if (this.options.raw) {
    return node.raw;
  }
  return this.options.factory + '(' + node.raw + ')';
};
