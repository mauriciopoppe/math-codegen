'use strict'
const CodeGenerator = require('../')

const interval = {
  factory: function (a) {
    // a = [lo, hi]
    if (typeof a === 'number') {
      return [a, a]
    }
    return [a[0], a[1]]
  },
  add: function (x, y) {
    return [x[0] + y[0], x[1] + y[1]]
  },
  mul: function (x, y) {
    const ac = x[0] * y[0]
    const ad = x[0] * y[1]
    const bc = x[1] * y[0]
    const bd = x[1] * y[1]
    return [Math.min(ac, ad, bc, bd), Math.max(ac, ad, bc, bd)]
  }
}

const instance = new CodeGenerator()

// [1, 1] + [2, 2] * [-1, 2]
// [1, 1] + [-2, 4]
// [-1, 5]
console.log(
  instance
    .parse('1 + 2 * x')
    .compile(interval)
    .eval({ x: [-1, 2] })
)
