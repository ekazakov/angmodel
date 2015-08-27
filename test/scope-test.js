//'use strict'

import test from 'tape';

import Scope from '../src/scope.js';
import {getCounter, resetCounter} from '../src/scope.js';

function noop () {}

function scopeHarnes (fn) {
    return function (t) {
        resetCounter();
        fn(t);
        t.end();
    }
}

test.test('Scope $eval string expression', scopeHarnes(t => {
    const rootScope = new Scope();
    rootScope.x = 1;
    rootScope.y = 2;

    const result = rootScope.$eval('x + y + 2');

    t.equal(result, 5);
}));


test.test('Scope $eval function expression', scopeHarnes(t => {
    const rootScope = new Scope();
    rootScope.y = 2;
    rootScope.foo = function () {
        return 3 * this.y;
    };

    const result = rootScope.$eval(rootScope.foo);

    t.equal(result, 6);
}));

test.test('Scope $watch', scopeHarnes(t => {
    const rootScope = new Scope();
    function foo() { return this.x + this.y; }

    rootScope.x = 1;
    rootScope.y = 2;

    rootScope.$watch('x', noop);
    rootScope.$watch('y', noop);
    rootScope.$watch(foo, noop);

    t.deepEqual(rootScope.$$watchers[0], {exp: 'x', fn: noop, last: 1});
    t.deepEqual(rootScope.$$watchers[1], {exp: 'y', fn: noop, last: 2});
    t.deepEqual(rootScope.$$watchers[2], {exp: foo, fn: noop, last: 3});
}));

test.test('Scope $digest', scopeHarnes(t => {
    const rootScope = new Scope();
    function foo() { return this.x + this.y; }

    rootScope.x = 1;
    rootScope.y = 2;
    rootScope.$watch('x', (x) => t.equal(x, 2));
    rootScope.$watch('y', y => t.equal(y, 3));
    rootScope.$watch(foo, val => t.equal(val, 5));

    rootScope.x++;
    rootScope.y++;

    rootScope.$digest();
}));

test.test('Child scope', scopeHarnes(t => {
    const rootScope = new Scope();
    const childScope = rootScope.$new();

    rootScope.x = 1;
    childScope.y = 2;

    rootScope.$watch('x', (x) => t.equal(x, 2));
    childScope.$watch('y', (y) => t.equal(y, 3));

    rootScope.x++;
    childScope.y++;

    rootScope.$digest();
}));
