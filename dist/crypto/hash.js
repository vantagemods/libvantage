define(["require", "exports", "crypto"], function (require, exports, crypto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sha256(data) {
        return crypto.createHash('sha256').update(data).digest();
    }
    exports.sha256 = sha256;
    function sha1(data) {
        return crypto.createHash('sha1').update(data).digest();
    }
    exports.sha1 = sha1;
});
