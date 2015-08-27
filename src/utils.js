'use strict'

export default {
    clone (obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            return;
        }
    },

    equals (val1, val2) {
        return JSON.stringify(val1) === JSON.stringify(val2);
    }
};
