'use strict'

import Provider from './provider.js';
import DIRECTIVE_SUFFIX from './provider.js';


export default {
    bootstrap () {
        this.compile(document.children[0], Provider.get('$rootScope'));
    },

    compile (el, scope) {
        const directiveDescriptors = this._getElDirectives(el);
        let scopeCreated = false;

        directiveDescriptors.forEach(descriptor => {
            const directive = Provider.getDirective(descriptor.name);

            if (directive.scope && !scopeCreated) {
                scope = scope.$new();
                scopeCreated = true;
            }

            directive.link(el, scope, descriptor.value);
        });

        for (let child of el.children) {
            this.compile(child, scope);
        }
    },

    _getElDirectives (el) {

    }
}
