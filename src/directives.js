'use strict'

import Provider from './provider.js';

export default {
    'ngl-bind': function nglBind () {
        return {
            scope: false,
            link: function (el, scope, exp) {
                el.innerHTML = scope.$eval(exp);
                scope.$watch(exp, (val) => el.innerHTML = val);
            }
        };
    },

    'ngl-model': function nglModel () {
        return {
            link: function (el, scope, exp) {
                el.addEventListener('input', () => {
                    scope[exp] = el.value;
                    scope.$apply();
                });

                scope.$watch(exp, (val) => el.value = val);
            }
        };
    },

    'ngl-controller': function nglBind () {
        return {
            scope: true,
            link: function (el, scope, exp) {
                const ctrl = Provider.getController(exp);
                Provider.invoke(ctrl, {$scope: scope});
            }
        };
    },

    'ngl-click': function nglClick () {
        return {
            scope: false,
            link: function (el, scope, exp) {
                el.onclick = function () {
                    scope.$eval(exp);
                    scope.$apply();
                };
            }
        };
    }

}

