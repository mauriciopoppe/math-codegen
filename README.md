# math-codegen 

[![Build Status][travis-image]][travis-url] 
[![NPM][npm-image]][npm-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Stability](https://img.shields.io/badge/stability-unstable-yellow.svg)]()

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Generates JavaScript code from mathematical expressions

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  * generated with [DocToc](https://github.com/thlorenz/doctoc) *

- [Description](#description)
  - [Lifecycle](#lifecycle)
    - [Parse](#parse)
    - [Compile](#compile)
    - [Eval](#eval)
  - [Differences with math.js expression parser](#differences-with-mathjs-expression-parser)
  - [Operators](#operators)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [`var instance = new CodeGenerator([options])`](#var-instance--new-codegeneratoroptions)
  - [`instance.parse(code)`](#instanceparsecode)
  - [`instance.compile(namespace)`](#instancecompilenamespace)
  - [`instance.setDefs(defs)`](#instancesetdefsdefs)
- [Examples](#examples)
  - [built-in math](#built-in-math)
  - [imaginary](#imaginary)
  - [interval arithmetic](#interval-arithmetic)
- [Inspiration projects](#inspiration-projects)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

An interpreter for mathematical expressions which allows the programmer to change the usual semantic of an
operator bringing the operator overloading polymorphism to JavaScript (emulated with function calls),
in addition an expression can be evaluated under any adapted namespace providing expression portability between numeric libraries 

### Lifecycle

- `parse`: a mathematical expression is parsed with [`mr-parse`](https://github.com/maurizzzio/mr-parser), in the ideal scenario
it would use [math.js expression parser](http://mathjs.org/docs/expressions/index.html) however it's not modularized yet
and including all math.js is just an overkill, probably `mr-parse` will be replaced with math.js expression parser when
it reaches npm as a module :)
- `compile`: the parsed string is compiled against a namespace producing executable JavaScript code
- `eval`: the executable JavaScript code is evaluated against a context

#### Parse

For example let's consider the following expression with the variable `x` which is defined by the user:

```javascript
'1 + 2 * x'
```

the expression can be emulated with function calls instead of operators, math-codegen will map many mathematical
operators to callable methods

```javascript
'add(1, mul(2, x))'
```

now we can introduce the namespace `ns` where `add` and `multiply` come from

```javascript
'ns.add(1, ns.mul(2, x))'
```

the variables (which for the parser are `symbols`
come from a context called `scope` but they might also be constant values defined in the namespace:

```javascript
'ns.add(1, ns.mul(2, (scope["x"] || ns["x"]) ))'
```

the constant values might have different meanings for different namespaces therefore a `factory` is needed
on the namespace to transform these values into values the namespace can operate with

```javascript
'ns.add(ns.factory(1), ns.mul(ns.factory(2), (scope["x"] || ns["x"]) ))'
```

#### Compile

Now that we have a parsed expression we have to compile it against a namespace to produce
executable JavaScript code
 
```javascript
parse('1 + 2 * x').compile(namespace)

// returns something like this
(function (definitions) {
  var ns = definitions.namespace
  return {
    eval: function (scope) {
      // scope processing
      // ...
      // the string parsed above goes here
      return ns.add(ns.factory(1), ns.mul(ns.factory(2), (scope["x"] || ns["x"]) ))
    }
  }
})(definitions)   // definitions created by math-codegen    
```

#### Eval

The object returned above can be evaluated within a context

```javascript
parse('1 + 2 * x').compile(namespace).eval(scope)
```

### Differences with math.js expression parser

Math.js expression parser API is quite similar having the same lifecycle however there are some
important facts I've found:

- `math.js` v1.x arrays can represent matrices with `ns.matrix` or as a raw arrays, `math-codegen` doesn't
make any assumptions of the arrays and treats them just like any other literal allowing the namespace to 
decide what to do with an array in its `factory` method

### Operators

The following operators recognized by `mr-parser` are named as follows when compiled

```javascript
'+': 'add'
'-': 'sub'
'*': 'mul'
'/': 'div'
'^': 'pow'
'%': 'mod'
'!': 'factorial'

// misc operators
'|': 'bitwiseOR'
'^|': 'bitwiseXOR'
'&': 'bitwiseAND'

'||': 'logicalOR'
'xor': 'logicalXOR'
'&&': 'logicalAND'

// comparison
'<': 'lessThan'
'>': 'greaterThan'
'<=': 'lessEqualThan'
'>=': 'greaterEqualThan'
'===': 'strictlyEqual'
'==': 'equal'
'!==': 'strictlyNotEqual'
'!=': 'notEqual'

// shift
'>>': 'shiftRight'
'<<': 'shiftLeft'
'>>>': 'unsignedRightShift'

// unary
'+': 'positive'
'-': 'negative'
'~': 'oneComplement'
```

## Install

```sh
$ npm install --save math-codegen
```

## Usage

```js
var CodeGenerator = require('math-codegen');
new CodeGenerator([options]).parse(code).compile(namespace).eval(scope)
```

## API

### `var instance = new CodeGenerator([options])`
**properties**
* `statements` {Array} An array of statements parsed from an expression
* `interpreter` {Interpreter} Instance of the Interpreter class
* `defs` {Object} An object with additional definitions available during the compilation
that exist during the instance lifespan
 
**params**
* `options` {Object} Options available for the interpreter
  * `[options.factory="ns.factory"]` {string} factory method under the namespace 
  * `[options.raw=false]` {boolean} True to interpret OperatorNode, UnaryNode and ArrayNode
   in a raw way without wrapping the operators with identifiers e.g. `-1` will be compiled as
   `-1` instead of `ns.negative(ns.factory(1))`
  * `[options.rawArrayExpressionElements=true]` {boolean} true to interpret the array elements in a raw way
  * `[options.rawCallExpressionElements=false]` {boolean} true to interpret call expression
   elements in a raw way

### `instance.parse(code)`

**chainable**
**params**
* `code` {string} string to be parsed
 
Parses a program using [`mr-parse`](https://github.com/maurizzzio/mr-parser), each Expression Statement is saved in
`instance.statements`

The documentation for the available nodes is described in [`mr-parse`](https://github.com/maurizzzio/mr-parser) 
  
### `instance.compile(namespace)`
  
**chainable**
**params**
* `namespace` {Object}

Compiles the code making `namespace`'s properties available during evaluation, **it's required
to have the `factory` property defined**
 
**returns** {Object}
* `return.code` {string} the body of the function to be evaluated with `eval`
* `return.eval` {Function} Function to be evaluated under a context
 **params**
  * `scope` {Object}

### `instance.setDefs(defs)`

**params**
* `defs` {Object}

An object whose properties will be available during evaluation, properties can be accessed by
the property name in the program

## Examples

### built-in math

```javascript
'use strict'
var CodeGenerator = require('math-codegen')

var numeric = {
  factory: function (a) { return a },
  add: function (a, b) { return a + b },
  mul: function (a, b) { return a * b }
}

// 1 + 2 * 3 = 7
new CodeGenerator()
  .parse('1 + 2 * x')
  .compile(numeric)
  .eval({x: 3})
)
```

### imaginary

```javascript
'use strict'
var CodeGenerator = require('math-codegen')

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
instance
  .parse('1 + 2 * x')
  .compile(imaginary)
  .eval({x : [1, 1]})

// because of the way the factory works it can also receive an array as a parameter
// [1, 0] + [2, 0] * [1, 1]
// [1, 0] + [2, 2]
// [3, 2]
instance
  .parse('[1, 0] + [2, 0] * x')
  .compile(imaginary)
  .eval({x : [1, 1]});
```

### interval arithmetic

```javascript
'use strict'
var CodeGenerator = require('math-codegen')

var interval = {
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
    var ac = x[0] * y[0]
    var ad = x[0] * y[1]
    var bc = x[1] * y[0]
    var bd = x[1] * y[1]
    return [Math.min(ac, ad, bc, bd), Math.max(ac, ad, bc, bd)]
  }
}

var instance = new CodeGenerator()

// [1, 1] + [2, 2] * [-1, 2]
// [1, 1] + [-2, 4]
// [-1, 5]
instance
  .parse('1 + 2 * x')
  .compile(interval)
  .eval({x: [-1, 2]})
```

## Inspiration projects

- [math.js expression parser](http://mathjs.org/docs/expressions/index.html)
- [angular v1.x parser](https://github.com/angular/angular.js/blob/master/src/ng/parse.js)

## License

2015 MIT © [Mauricio Poppe]()

[npm-image]: https://img.shields.io/npm/v/math-codegen.svg?style=flat
[npm-url]: https://npmjs.org/package/math-codegen
[travis-image]: https://travis-ci.org/maurizzzio/math-codegen.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/math-codegen
[coveralls-image]: https://coveralls.io/repos/maurizzzio/math-codegen/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/maurizzzio/math-codegen?branch=master
