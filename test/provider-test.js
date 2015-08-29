'use strict'

import tape from 'tape';
import Provider from '../src/provider';
import Counter from '../src/counter.js';

const test = tape.test;

function providerHarnes (cb) {
    return function (t) {
        cb(t);

        t.end();
    };
}

test('Provider register service', providerHarnes((t) => {
    const provider = new Provider();
    function FooService () {
        return {x: 1};
    }
    provider.service('foo', FooService);
    t.equal(provider._providers.get('foo'), FooService);
}));

test('Provider get service', providerHarnes((t) => {
    function FooService () { return {x: 1}; }
    const provider = new Provider();

    provider.service('foo', FooService);
    t.deepEqual(provider.get('foo'), {x: 1});
}));

test('Provider get service with dependencies', providerHarnes((t) => {
    const provider = new Provider();

    function FooService () {
        return {x: 1};
    }

    function BarService (foo) {
        return Object.assign({y: 2}, foo);
    }

    provider.service('foo', FooService);
    provider.service('bar', BarService);
    t.deepEqual(provider.get('bar'), {x: 1, y: 2});
}));

test('Provider instaniate counter class', (t) => {
    const provider = new Provider();
    provider.service('counter', () => new Counter());

    const counter = provider.get('counter');
    counter.increase();
    t.equal(counter.getValue(), 1);
    t.end();
});

//test('Register service', t => { t.end(); });
//test('Register service', t => { t.end(); });
//test('Register service', t => { t.end(); });
//test('Register service', t => { t.end(); });
//test('Register service', t => { t.end(); });
