'use strict'

export default class Counter {
    constructor(start) {
        this._val = start || 0;
    }

    increase() {
        this._val++;
    }

    getValue () {
        return this._val;
    }
}
