/* global describe, it */

import Parser from '../index';

import {
  Program,
  Routing,
  Source,
  Patch,
  Func,
  BinaryOp,
  Num,
  Sequence,
  Bus,
} from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('Parser', function () {
  it('parses a simple patch', function () {
    const program = dedent(`
                           time + 1 -> seq([ 2 1]) >> out;
                           `);

    const { ast, errors } = Parser.parse(program, { testing: true });

    const expected = Program([
      Routing(
        Patch(
          Source(BinaryOp('+', Source(Bus('time')), Source(Num(1)))),
          Func('seq', [Source(Sequence([2, 1], [2, 2], 1))])
        ),
        Bus('out')
      ),
    ]);

    assert.deepEqual(errors, []);
    assert.deepEqual(ast, expected);
  });

  it('parses a chain of functions', function () {
    const program = dedent(`
                           time -> seq([ 2 1]) -> slide([  1  ]) >> out;
                           `);

    const { ast, errors } = Parser.parse(program, { testing: true });

    const expected = Program([
      Routing(
        Patch(
          Patch(
            Source(Bus('time')),
            Func('seq', [Source(Sequence([2, 1], [2, 2], 1))])
          ),
          Func('slide', [Source(Sequence([1], [5], 2))])
        ),
        Bus('out')
      ),
    ]);

    assert.deepEqual(errors, []);
    assert.deepEqual(ast, expected);
  });
});
