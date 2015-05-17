'use strict';

// https://github.com/estree/estree/blob/master/spec.md#unaryoperator
module.exports = {
  '+': 'positive',
  '-': 'negative',
  '!': 'logicalNegation',
  '~': 'oneComplement',
  'typeof': 'typeOf',
  'delete': 'del'
};
