'use strict'
var CodeGenerator = require('../')

var imaginary = {
  factory: function (a) {
    // a = [re, im]
    if (typeof a === 'number') {
      return [a, 0]
    }
    return [a[0] || 0, a[1] || 0]
  },
  add: function (a, b) {
    var re = a[0] + b[0]
    var im = a[1] + b[1]
    return [re, im]
  },
  mul: function (a, b) {
    var re = a[0] * b[0] - a[1] * b[1]
    var im = a[0] * b[1] + a[1] * b[0]
    return [re, im]
  }
}

var instance = new CodeGenerator()

// [1, 0] + [2, 0] * [1, 1]
// [1, 0] + [2, 2]
// [3, 2]
console.log(
  instance
    .parse('1 + 2 * x')
    .compile(imaginary)
    .eval({x: [1, 1]})
)
