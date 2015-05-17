'use strict';
var CodeGenerator = require('../');

var numeric = {
  factory: function (a) { return a; },
  add: function (a, b) { return a + b; },
  mul: function (a, b) { return a * b; }
};

var instance = new CodeGenerator()
  .parse('1 + 2 * x')
  .compile(numeric);

console.log(instance.eval({x : 3}));     // 1 + 2 * 3 = 7
