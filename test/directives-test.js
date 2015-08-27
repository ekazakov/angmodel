'use strict'

import test from 'tape';
import DomBuilder from 'DOMBuilder';

import {resetCounter} from '../src/scope.js';
import Scope from '../src/scope.js';
import Provider from '../src/provider.js';
import directives from '../src/directives.js';
import DomCompiler from '../src/dom-compiler.js';


function compilerHarness (fn) {
    return function (t) {
        resetCounter();
        Provider._reset();
        Object.keys(directives).forEach((dirName) => {
            Provider.directive(dirName, directives[dirName]);
        });
        fn(t);
        t.end();
    };
}

function dom (dom) {
    const root = document.createElement('div');
    root.innerHTML = DomBuilder.build(dom, 'html').toString();

    return root.children[0];
}

test.test('============ Direcitrve ngl-click', compilerHarness(t => {
    const root = dom(['div', {style: 'background: #fff; padding: 10px;', 'ngl-controller': 'FooCtrl'},
        ['button', {'ngl-click': 'foo()'}, 'Increment'],
        ['span', {'ngl-bind': 'bar'}, '0'],
    ]);

    const rootScope = Provider.get('$rootScope')

    Provider.controller('FooCtrl', function FooCtrl ($scope) {
        $scope.bar = 0;
        $scope.foo = () => {
            $scope.bar++;
        }

        $scope.$watch('bar', (val) => t.equal(val, 1));
    });


    document.body.appendChild(root);
    DomCompiler.compile(root, rootScope);
    document.querySelector('button').dispatchEvent(new Event('click'));
}));
