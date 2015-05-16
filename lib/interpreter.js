'use strict';
var extend = require('extend');
var utils = require('./utils');

var types = {
  // node
  ArrayExpression: require('./node/ArrayExpression'),
  AssignmentExpression: require('./node/AssignmentExpression'),
  BinaryExpression: require('./node/BinaryExpression'),
  CallExpression: require('./node/CallExpression'),
  ConditionalExpression: require('./node/ConditionalExpression'),
  ExpressionStatement: require('./node/ExpressionStatement'),
  UnaryExpression: require('./node/UnaryExpression'),
  // misc
  Identifier: require('./misc/Identifier'),
  Literal: require('./misc/Literal')
};

var Interpreter = function (owner) {
  this.options = owner.options;
};

extend(Interpreter.prototype, types);

// run is the main method which decides which expression to call
Interpreter.prototype.next = function (node) {
  if (!(node.type in this)) {
    throw new TypeError('the node type ' + node.type + ' is not implemented');
  }
  return this[node.type](node);
};

Interpreter.prototype.rawify = utils.rawify;

module.exports = Interpreter;
