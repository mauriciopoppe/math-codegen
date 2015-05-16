'use strict';

var assert = require('assert');
var CodeGenerator = require('../');
var Identifier = require('../lib/misc/Identifier');

function cleanAssert(a, b) {
  a = a.replace(/\s/g, '');
  b = b.replace(/\s/g, '');
  assert(a === b);
}

function statement(instance, test) {
  var statements = instance.statements;
  //console.log(statements, test);
  for (var i = 0; i < statements.length; i += 1) {
    cleanAssert(statements[i], test[i]);
  }
}

function id(name) {
  var args = Array.prototype.slice.call(arguments, 1);
  /* eslint-disable new-cap */
  var identifier = Identifier({
    name: name
  });
  /* eslint-enable new-cap */
  if (args.length) {
    identifier += '(' + args.join(',') + ')';
  }
  return identifier;
}

describe('math-codegen', function () {
  var cg;

  describe('definitions', function () {
    beforeEach(function () {
      cg = new CodeGenerator();
    });

    it('should be sent to the constructor', function () {
      cg = new CodeGenerator(null, {ns: 1});
      assert(cg.defs.ns === 1);
    });

    it('should be updated', function () {
      cg.setDefs({ns: 1});
      assert(cg.defs.ns === 1);

      cg.setDefs({ns: null});
      assert(!cg.defs.ns);
    });
  });

  describe('parser', function () {
    describe('with default options', function () {
      beforeEach(function () {
        cg = new CodeGenerator();
      });

      it('should parse a constant', function () {
        statement(cg.parse('1'), ['ns.factory(1)']);
        statement(cg.parse('1e18'), ['ns.factory(1e18)']);
      });

      it('should parse unary expressions', function () {
        statement(cg.parse('-1'), [id('negative', 'ns.factory(1)')]);
        statement(cg.parse('+1'), [id('positive', 'ns.factory(1)')]);
        statement(cg.parse('-+1'), [id('negative', id('positive', 'ns.factory(1)'))]);
      });

      it('should parse an array', function () {
        // rawArrayElements is set to true by default
        statement(cg.parse('[1,2]'), ['ns.factory([1, 2])']);
        statement(cg.parse('[+1,-2]'), ['ns.factory([+1, -2])']);
      });

      it('should parse literals', function () {
        statement(cg.parse('PI'), [id('PI')]);
        statement(cg.parse('sin'), [id('sin')]);
      });

      it('should parse function calls', function () {
        statement(cg.parse('sin()'), [id('sin', '')]);
        statement(cg.parse('sin(1)'), [id('sin', 'ns.factory(1)')]);
        statement(cg.parse('sin(1, 2)'), [id('sin', 'ns.factory(1)', 'ns.factory(2)')]);
      });

      it('should parse binary expression calls', function () {
        statement(cg.parse('1 + 2'), [id('add', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(cg.parse('1 - 2'), [id('sub', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(cg.parse('1 * 2'), [id('mul', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(cg.parse('1 / 2'), [id('div', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(cg.parse('1 ^ 2'), [id('pow', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(cg.parse('1 % 2'), [id('mod', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(cg.parse('1 < 2'), [id('lessThan', 'ns.factory(1)', 'ns.factory(2)')]);
        statement(
          cg.parse('(1 + 2) * (2 + 3)'),
          [id('mul', id('add', 'ns.factory(1)', 'ns.factory(2)'), id('add', 'ns.factory(2)', 'ns.factory(3)'))]
        );
      });

      it('should throw on a not implemented binary operator', function () {
        assert.throws(function () {
          cg.parse('1 & 2');
        });
      });

      it('should parse a conditional expression', function () {
        statement(
          cg.parse('1 < 2 ? 1 : 2'),
          ['(!!(' + id('lessThan', 'ns.factory(1)', 'ns.factory(2)') + ') ? ' +
          '( ns.factory(1) ) : ( ns.factory(2) ) )']
        );
      });

      it('should parse an assignment expression', function () {
        statement(cg.parse('x = 1'), ['( scope["x"] = ns.factory(1) )']);
      });

      it('should parse multiple statements', function () {
        statement(
          cg.parse('sin(1);x = 1'),
          [id('sin', 'ns.factory(1)'), '( scope["x"] = ns.factory(1) )']
        );
      });
    });

    describe('with raw set to true', function () {
      beforeEach(function () {
        cg = new CodeGenerator({
          raw: true
        });
      });

      it('should parse a constant', function () {
        statement(cg.parse('1'), ['1']);
        statement(cg.parse('1e18'), ['1e18']);
      });

      it('should parse unary expressions', function () {
        statement(cg.parse('-1'), ['-1']);
        statement(cg.parse('+1'), ['+1']);
        statement(cg.parse('-+1'), ['-+1']);
      });

      it('should parse an array', function () {
        // rawArrayElements is set to true by default
        statement(cg.parse('[1,2]'), ['[1, 2]']);
        statement(cg.parse('[+1,-2]'), ['[+1, -2]']);
      });

      it('should parse literals', function () {
        statement(cg.parse('PI'), [id('PI')]);
        statement(cg.parse('sin'), [id('sin')]);
      });

      it('should parse function calls', function () {
        statement(cg.parse('sin()'), [id('sin', '')]);
        statement(cg.parse('sin(1)'), [id('sin', '1')]);
        statement(cg.parse('sin(1, 2)'), [id('sin', '1', '2')]);
      });

      it('should parse binary expression calls', function () {
        statement(cg.parse('1 + 2'), ['(1 + 2)']);
        statement(cg.parse('1 - 2'), ['(1 - 2)']);
        statement(cg.parse('1 * 2'), ['(1 * 2)']);
        statement(cg.parse('1 / 2'), ['(1 / 2)']);
        statement(cg.parse('1 ^ 2'), ['(1 ^ 2)']);
        statement(cg.parse('1 % 2'), ['(1 % 2)']);
        statement(cg.parse('1 < 2'), ['(1 < 2)']);
        statement(
          cg.parse('(1 + 2) * (2 + 3)'),
          ['((1 + 2) * (2 + 3))']
        );

      });

      it('should not throw on a not implemented binary operator', function () {
        statement(cg.parse('1 & 2'), ['(1 & 2)']);
      });

      it('should parse a conditional expression', function () {
        statement(
          cg.parse('1 < 2 ? 1 : 2'),
          ['(!!((1 < 2)) ? ( 1 ) : ( 2 ) )']
        );
      });

      it('should parse an assignment expression', function () {
        statement(cg.parse('x = 1'), ['( scope["x"] = 1 )']);
      });

      it('should parse multiple statements', function () {
        statement(
          cg.parse('sin(1);x = 1'),
          [id('sin', '1'), '( scope["x"] = 1 )']
        );
      });

    });

    describe('with rawArrayExpressionElements set to false', function () {
      beforeEach(function () {
        cg = new CodeGenerator({
          rawArrayExpressionElements: false
        });
      });

      it('should parse an array', function () {
        statement(cg.parse('[1,2]'), ['ns.factory([ns.factory(1), ns.factory(2)])']);
      });
    });

    describe('with rawCallExpressionElements set to true', function () {
      beforeEach(function () {
        cg = new CodeGenerator({
          rawCallExpressionElements: true
        });
      });

      it('should use raw parameters', function () {
        statement(cg.parse('sin()'), [id('sin', '')]);
        statement(cg.parse('sin(1)'), [id('sin', '1')]);
        statement(cg.parse('sin(1, 2)'), [id('sin', '1', '2')]);
      });
    });
  });

  describe('compile', function () {
    beforeEach(function () {
      cg = new CodeGenerator().setDefs({ns: {}});
    });

    it('should throw when ns is not defined', function () {
      assert.throws(function () {
        cg = new CodeGenerator();
        cg.parse('1 + 2').compile();
      });
    });

    it('should throw when there are no statements', function () {
      cg.parse('');
      assert.throws(function () {
        cg.compile();
      });
    });

    it('should return an eval method', function () {
      var code = cg.parse('1 + 2').compile();
      assert(code.eval.toString().indexOf('return ') > 0);
    });

    it('should throw if a method is not defined in the scope or in the ns', function () {
      var code = cg.parse('1 + 2').compile();
      assert.throws(function () {
        code.eval();
      });
    });
  });
});
