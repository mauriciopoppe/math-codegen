'use strict';
module.exports = function (node) {
  var id = node.name;
  return '(scope["' + id + '"] || ' +
    'ns["' + id + '"] || ' + id + ' )';
};
