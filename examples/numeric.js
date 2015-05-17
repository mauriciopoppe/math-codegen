'use strict';
var CodeGenerator = require('../');

var numeric = {
  factory: function (a) { return a; },
  add: function (a, b) { return a + b; },
  mul: function (a, b) { return a * b; }
};

// 1 + 2 * 3 = 7
console.log(
  new CodeGenerator()
    .parse('1 + 2 * x')
    .compile(numeric)
    .eval({x : 3})
);
