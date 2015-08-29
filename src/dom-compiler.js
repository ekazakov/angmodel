'use strict'
import scopeFactory from './scope-factory.js';

export default class DomCompiler {
    constructor ($provider, $rootScope, $scopeFactory) {
        Object.assign(this, {$provider, $rootScope, $scopeFactory});
    }

    bootstrap (root) {
        this.compile(root, this.$rootScope);
    }

    compile (el, scope) {
        const directiveDescriptors = this._getElDirectives(el);
        let scopeCreated = false;

        directiveDescriptors.forEach(descriptor => {
            const directive = this.$provider.getDirective(descriptor.name);

            if (directive == null) return;

            if (directive.scope && !scopeCreated) {
                scope = this.$scopeFactory(scope);
                scopeCreated = true;
            }

            directive.link(el, scope, descriptor.value);
        });

        for (let child of el.children) {
            this.compile(child, scope);
        }
    }

    _getElDirectives (el) {
        const attrs = [...el.attributes];
        const result = [];

        for (attr of attrs) {
            if (this.$provider.getDirective(attr.name)) {
                result.push({name: attr.name, value: attr.value});
            }
        }

        return result;
    }
}
