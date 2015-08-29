'use strict'

import tape from 'tape';
import DomBuilder from 'DOMBuilder';
import DomCompiler from '../src/dom-compiler.js';
import Provider from '../src/provider';
import Scope from '../src/scope.js';
import Counter from '../src/counter.js'
import scopeFactory from '../src/scope-factory.js';

const test = tape;

function compilerHarness (fn) {
    return function (t) {
        fn(t);
        t.end();
    };
}

function dom (dom) {
    const root = document.createElement('div');
    root.innerHTML = DomBuilder.build(dom, 'html').toString();

    return root.children[0];
}

function setup () {
    const provider = new Provider();
    const $rootScope = new Scope();
    const counter = new Counter();
    provider.service('$rootScope', () => $rootScope);
    provider.service('$scopeFactory', scopeFactory);
    provider.service('$counter', () => counter);

    return {
        provider,
        $rootScope,
        counter,
        domCompiler: new DomCompiler(provider)
    };
}

test('DOM Compiler get element directives', compilerHarness(t => {
    const {provider, domCompiler} = setup();
    provider.directive('ngl-foo', () => true);
    const el = dom(['div', {'ngl-foo': 'xyz'}]);

    const [directive] = domCompiler._getElDirectives(el);
    t.equal(directive.name, 'ngl-foo');
    t.equal(directive.value, 'xyz');
}));

test('DOM Compiler compile', compilerHarness(t => {
    const {provider, domCompiler} = setup();

    provider.directive('ngl-foo', () => {
        return {
            link (el, scope, exp) {
                t.equal(el, root);
                t.equal(scope, rootScope);
                t.equal(exp, 'xyz');
            }
        };
    });

    const rootScope = provider.get('$rootScope');
    const root = dom(['div', {'ngl-foo': 'xyz'}]);

    domCompiler.compile(root, rootScope);
}));

test('DOM Compiler compile + scope', compilerHarness(t => {
    const {provider, domCompiler} = setup();
    const rootScope = provider.get('$rootScope');
    provider.directive('ngl-foo', () => {
        return {
            scope: true,
            link (el, scope, exp) {
                t.equal(el, root.children[0].children[0]);
                t.equal(scope.$parent, rootScope);
                t.equal(exp, 'xyz');
            }
        };
    });

    const root = dom(['div', ['div', ['div', {'ngl-foo': 'xyz'}]]]);

    domCompiler.compile(root, rootScope);
}));


test('DOM Compiler directive + watch', compilerHarness(t => {
    const {provider, domCompiler} = setup();
    provider.directive('ngl-foo', () => {
        return {
            link (el, scope, exp) {
                t.equal(scope.$eval(exp), 1);
                scope.$watch(exp, (val) => t.equal(val, 2));
            }
        };
    });

    const rootScope = provider.get('$rootScope');
    const root = dom(['div', ['div', ['div', {'ngl-foo': 'xyz'}]]]);
    rootScope.xyz = 1;

    domCompiler.compile(root, rootScope);

    rootScope.xyz = 2;
    rootScope.$digest();
}));
