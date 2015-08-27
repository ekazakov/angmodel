"use strict";

import Scope from './scope.js';

export const DIRECTIVE_SUFFIX = 'Directive';
export const CONTROLLER_SUFFIX = 'Controller';

export default  {
    _providers: new Map(),

    _cache: new Map([['$rootScope', new Scope()]]),

    _reset () {
        this._cache = new Map([['$rootScope', new Scope()]]);
        this._providers = new Map();
        return this;
    },

    directive (name, fn) {
        this._register(name + DIRECTIVE_SUFFIX, fn);
    },

    controller (name, fn) {
        this._register(name + CONTROLLER_SUFFIX, () => fn);
    },

    service (name, fn) {
        this._register(name, fn);
    },

    get (name, locals) {
        if (this._cache.has(name)) return this._cache.get(name);
        const provider = this._providers.get(name);
        if (provider == null || typeof provider !== 'function') return null;
        this._cache.set(name, this.invoke(provider, locals));

        return this._cache.get(name);
    },

    getDirective (name, locals) {
        return this.get(name + DIRECTIVE_SUFFIX, locals);
    },

    getController (name, locals) {
        return this.get(name + CONTROLLER_SUFFIX, locals);
    },

    annotate (fn) {
        const comments = new RegExp(/(\/\/.*$)|(\/\*[\s\S]*\*\/)/, 'mg');
        const fnParams = new RegExp(/\((.*)\)\s*\{/);
        const params = fn.toString()
            .replace(comments, '')
                //.replace(/(\s+)/ig, '')
            .match(fnParams)
        ;

        if (params && params[1]) {
            return params[1]
                .split(',')
                .map((param) => param.trim())
            ;
        }

        return [];
    },

    invoke (fn, locals = {}) {
        const deps = this
            .annotate(fn)
            .map((dependency) =>
                locals[dependency] || this.get(dependency, locals));

        return fn.apply(null, deps);
    },

    _register (name, factory) {
        this._providers.set(name, factory);
    }
}
