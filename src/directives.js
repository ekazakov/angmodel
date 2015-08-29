'use strict'

import Provider from './provider.js';

export default {
    'ngl-bind': function nglBind (provider) {
        return () => ({
            scope: false,
            link: function (el, scope, exp) {
                el.innerHTML = scope.$eval(exp);
                scope.$watch(exp, (val) => el.innerHTML = val);
            }
        })
    },

    'ngl-model': function nglModel (provider) {
        return () => ({
            link: function (el, scope, exp) {
                el.addEventListener('input', () => {
                    scope[exp] = el.value;
                    scope.$apply();
                });

                scope.$watch(exp, (val) => el.value = val);
            }
        })
    },

    'ngl-controller': function nglBind (provider) {
        return () => ({
            scope: true,
            link: function (el, scope, exp) {
                const ctrl = provider.getController(exp);
                provider.invoke(ctrl, {$scope: scope});
            }
        })
    },

    'ngl-click': function nglClick (provider) {
        return () => ({
            scope: false,
            link: function (el, scope, exp) {
                el.onclick = function () {
                    scope.$eval(exp);
                    scope.$apply();
                };
            }
        })
    }

}

