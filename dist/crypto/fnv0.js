define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Currently only works for ASCII strings.
    function fnv0(value, init, prime) {
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var char = value_1[_i];
            init ^= char.charCodeAt(0);
            init = Math.imul(init, prime);
        }
        return init >>> 0;
    }
    exports.fnv0 = fnv0;
});
