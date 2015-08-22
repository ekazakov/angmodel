'use strict'

require('tap-browser-color')();
import test from 'tape';
import provider from '../src/provider';


var globalEval = eval;
var _global = globalEval('this');

test('Exports window', function (t) {
    t.equal(_global, global);
    t.end();
});

test('Foo', function (t) {
    t.equal(1, 2);
    t.end();
});

test('Provider not null', function (t) {
    t.notEqual(provider, null);
    t.end()
});
