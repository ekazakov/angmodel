'use strict'

import tape from 'tape';
import DomBuilder from 'DOMBuilder';
import DomCompiler from '../src/dom-compiler.js';
import Provider from '../src/provider';
import Scope from '../src/scope.js';
import Counter from '../src/counter.js'
import scopeFactory from '../src/scope-factory.js';
import directives from '../src/directives.js';

const test = tape;

function setup () {
    const provider = new Provider();
    const $rootScope = new Scope();
    const counter = new Counter();

    provider.service('$rootScope', () => $rootScope);
    provider.service('$scopeFactory', scopeFactory);
    provider.service('$counter', () => counter);
    provider.service('$provider', () => provider);
    provider.service('$domCompiler', ($provider, $rootScope, $scopeFactory) => {
        return new DomCompiler($provider, $rootScope, $scopeFactory);
    });

    Object.keys(directives).forEach((dirName) => {
        provider.directive(dirName, directives[dirName](provider));
    });

    return {
        provider,
        $rootScope,
        counter,
        domCompiler: provider.get('$domCompiler')
    };
}

function dom (dom) {
    const root = document.createElement('div');
    root.innerHTML = DomBuilder.build(dom, 'html').toString();

    return root.children[0];
}

test('============ Direcitrve ngl-click', (t) => {
    const {provider, domCompiler, $rootScope} = setup();
    const root = dom(['div', {style: 'background: #fff; padding: 10px;', 'ngl-controller': 'FooCtrl'},
        ['button', {'ngl-click': 'foo()'}, 'Increment'],
        ['span', {'ngl-bind': 'bar'}, '0'],
    ]);

    provider.controller('FooCtrl', function FooCtrl ($scope) {
        $scope.bar = 0;
        $scope.foo = () => {
            $scope.bar++;
        }

        $scope.$watch('bar', (val) => {
            t.equal(val, 1);
            t.end();
        });
    });

    document.body.appendChild(root);
    domCompiler.compile(root, $rootScope);
    document.querySelector('button').dispatchEvent(new Event('click'));
});
