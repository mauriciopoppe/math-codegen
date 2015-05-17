'use strict';
// https://github.com/estree/estree/blob/master/spec.md#literal
module.exports = function (node) {
  var id = node.name;
  return '(scope["' + id + '"] || ' +
    'ns["' + id + '"] || ' + id + ' )';
};
