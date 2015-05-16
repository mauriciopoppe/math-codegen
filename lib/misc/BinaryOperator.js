'use strict';

// https://github.com/estree/estree/blob/master/spec.md#binaryoperator
module.exports = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '^': 'pow',
  '%': 'mod',
  '<': 'lessThan',
  '>': 'greaterThan',
  '<=': 'lessEqualThan',
  '>=': 'greaterEqualThan'
};
