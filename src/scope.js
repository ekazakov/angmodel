import Utils from './utils.js';

//let counter = 0;
//
//function incCounter () {
//    counter++;
//}
//
//export function getCounter () {
//    return counter;
//}
//
//export function resetCounter () {
//    counter = 0;
//}

export default class Scope {
    constructor(parent, rootScope, id = 0) {
        Object.assign(this, {
            $$watchers: [],
            $$children: [],
            $parent: parent,
            $id: id,
            $rootScope: rootScope
        });
    }

    $watch (exp, fn) {
        this.$$watchers.push({
            exp,
            fn,
            last: Utils.clone(this.$eval(exp))
        });
    }

    addChild (childScope) {
        this.$$children.push(childScope);
    }

    $destroy () {
        const children = this.$parent.$$children;
        children.splice(children.indexOf(this), 1);
    }

    $eval (exp) {
        if (typeof exp === 'function') {
            return exp.call(this);
        } else {
            try {
                with (this) {
                    return eval(exp);
                }
            } catch (e) {
                return;
            }
        }
    }

    $digest () {
        let dirty;

        do {
            dirty = false;

            for (let watcher of this.$$watchers) {
                const expressionResult = this.$eval(watcher.exp);

                if (!Utils.equals(watcher.last, expressionResult)) {
                    watcher.last = Utils.clone(expressionResult);
                    dirty = true;
                    watcher.fn(expressionResult)
                }
            }
        } while (dirty)

        for (let child of this.$$children) {
            child.$digest();
        }
    }

    $apply () {
       this.$rootScope.$digest();
    }
}
