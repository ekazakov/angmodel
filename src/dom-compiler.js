'use strict'

import Provider from './provider.js';

export default {
    bootstrap () {
        this.compile(document.children[0], Provider.get('$rootScope'));
    },

    compile (el, scope) {
        const directiveDescriptors = this._getElDirectives(el);
        let scopeCreated = false;

        directiveDescriptors.forEach(descriptor => {
            const directive = Provider.getDirective(descriptor.name);

            if (directive == null) return;

            if (directive.scope && !scopeCreated) {
                scope = scope.$new(Provider.get('$rootScope'));
                scopeCreated = true;
            }

            directive.link(el, scope, descriptor.value);
        });

        for (let child of el.children) {
            this.compile(child, scope);
        }
    },

    _getElDirectives (el) {
        const attrs = [...el.attributes];
        const result = [];

        for (attr of attrs) {
            if (Provider.getDirective(attr.name)) {
                result.push({name: attr.name, value: attr.value});
            }
        }

        return result;
    }
}
