'use strict';
// https://github.com/estree/estree/blob/master/spec.md#literal
module.exports = function (node) {
  var id = node.name;
  return '("' + id + '" in scope ? scope["' + id + '"] : ns["' + id + '"])';
};
