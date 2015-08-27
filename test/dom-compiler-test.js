'use strict'

import test from 'tape';
import DomBuilder from 'DOMBuilder';
import DomCompiler from '../src/dom-compiler.js';
import {resetCounter} from '../src/scope.js';
import Provider from '../src/provider';


function compilerHarness (fn) {
    return function (t) {
        resetCounter();
        Provider._reset();
        fn(t);
        t.end();
    };
}

function dom (dom) {
    const root = document.createElement('div');
    root.innerHTML = DomBuilder.build(dom, 'html').toString();

    return root.children[0];
}

test.test('DOM Compiler get element directives', compilerHarness(t => {
    Provider.directive('ngl-foo', () => true);
    const el = dom(['div', {'ngl-foo': 'xyz'}]);

    const [directive] = DomCompiler._getElDirectives(el);
    t.equal(directive.name, 'ngl-foo');
    t.equal(directive.value, 'xyz');
}));

test.test('DOM Compiler compile', compilerHarness(t => {
    Provider.directive('ngl-foo', () => {
        return {
            link (el, scope, exp) {
                t.equal(el, root);
                t.equal(scope, rootScope);
                t.equal(exp, 'xyz');
            }
        };
    });

    const rootScope = Provider.get('$rootScope');
    const root = dom(['div', {'ngl-foo': 'xyz'}]);

    DomCompiler.compile(root, rootScope);
}));

test.test('DOM Compiler compile + scope', compilerHarness(t => {
    Provider.directive('ngl-foo', () => {
        return {
            scope: true,
            link (el, scope, exp) {
                t.equal(el, root.children[0].children[0]);
                t.equal(scope.$parent, rootScope);
                t.equal(exp, 'xyz');
            }
        };
    });

    const rootScope = Provider.get('$rootScope');
    const root = dom(['div', ['div', ['div', {'ngl-foo': 'xyz'}]]]);

    DomCompiler.compile(root, rootScope);
}));


test.test('DOM Compiler directive + watch', compilerHarness(t => {
    Provider.directive('ngl-foo', () => {
        return {
            link (el, scope, exp) {
                t.equal(scope.$eval(exp), 1);
                scope.$watch(exp, (val) => t.equal(val, 2));
            }
        };
    });

    const rootScope = Provider.get('$rootScope');
    const root = dom(['div', ['div', ['div', {'ngl-foo': 'xyz'}]]]);
    rootScope.xyz = 1;

    DomCompiler.compile(root, rootScope);

    rootScope.xyz = 2;
    rootScope.$digest();
}));
