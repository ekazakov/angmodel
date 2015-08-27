'use strict'

import test from 'tape';
import Provider from '../src/provider';

const setup = () => {
    return Provider._reset();
}

const teardown = () => {
    return Provider._reset();
}

function providerHarnes (cb) {
    return function (t) {
        const Provider = setup();

        cb(t, Provider);

        teardown();
        t.end();
    };
}

test.test('annotate', {skip: true}, providerHarnes((t, Provider) => {
    function FooService (foo1,
     /*fdf*/ foo2,
    //sdfsf
     foo3
    ) { }

    t.deepEqual(Provider.annotate(FooService), ['foo1', 'foo2', 'foo3']);
}));

test.test('Provider register service', providerHarnes((t, Provider) => {
    function FooService () {
        return {x: 1};
    }
    Provider.service('foo', FooService);
    t.equal(Provider._providers.get('foo'), FooService);
}));

test.test('Provider get service', providerHarnes((t, Provider) => {
    function FooService () {
        return {x: 1};
    }
    Provider.service('foo', FooService);
    t.deepEqual(Provider.get('foo'), {x: 1});
}));

test.test('Provider get service with dependencies', providerHarnes((t, Provider) => {
    function FooService () {
        return {x: 1};
    }

    function BarService (foo) {
        return Object.assign({y: 2}, foo);
    }

    Provider.service('foo', FooService);
    Provider.service('bar', BarService);
    t.deepEqual(Provider.get('bar'), {x: 1, y: 2});
}));

//test.test('Register service', t => { t.end(); });
//test.test('Register service', t => { t.end(); });
//test.test('Register service', t => { t.end(); });
//test.test('Register service', t => { t.end(); });
//test.test('Register service', t => { t.end(); });
