/**
 * Created by mauricio on 5/12/15.
 */
'use strict';

var esprima = require('esprima');
var Interpreter = require('./Interpreter');
var extend = require('extend');

function CodeGenerator(options, defs) {
  this.statements = [];
  this.options = extend({
    factory: 'ns.factory',
    raw: false,
    rawArrayExpressionElements: true,
    rawCallExpressionElements: false
  }, options);
  this.defs = defs || {};
  this.interpreter = new Interpreter(this);
}

CodeGenerator.prototype.setDefs = function (defs) {
  this.defs = extend(this.defs, defs);
  return this;
};

CodeGenerator.prototype.compile = function () {
  if (typeof this.defs.ns !== 'object') {
    throw Error('"ns" property needs to be defined on defs');
  }

  // default process scope hook
  this.defs._processScope = this.defs._processScope || function () {};

  var defsCode = Object.keys(this.defs).map(function (name) {
    return 'var ' + name + ' = defs["' + name + '"];';
  });

  // statement join
  if (!this.statements.length) {
    throw Error('there are no statements saved in this generator');
  }

  // last statement is always a return statement
  this.statements[this.statements.length - 1] = 'return ' + this.statements[this.statements.length - 1];

  var code = this.statements.join(';\n');
  var factoryCode =
    defsCode.join(' ') +
    'return {' +
    '  eval: function (scope) {' +
    '    scope = scope || {};' +
    '    _processScope(scope);' +
    '    ' + code +
    '  },' +
    '  code: \'' + code + '\'' +
    '};';

  /* eslint-disable */
  var factory = new Function('defs', factoryCode);
  /* eslint-enable */
  return factory(this.defs);
};

CodeGenerator.prototype.parse = function (code) {
  var self = this;
  var program = esprima.parse(code);
  this.statements = program.body.map(function (statement) {
    return self.interpreter.next(statement);
  });
  return this;
};

module.exports = CodeGenerator;
