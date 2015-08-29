'use strict'

import Scope from './scope.js';

export default function scopeFactory ($rootScope, $counter) {
    return function (parentScope) {
        $counter.increase();
        const newScope = new Scope(parentScope, $rootScope, $counter.getValue());

        Object.setPrototypeOf(newScope, parentScope);
        parentScope.addChild(newScope);

        return newScope;
    };
}

