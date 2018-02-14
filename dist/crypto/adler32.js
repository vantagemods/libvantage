define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function adler32(buffer, initial) {
        if (initial === void 0) { initial = 1; }
        var a = initial & 0xFFFF;
        var b = (initial >>> 16) & 0xFFFF;
        var x = 0;
        var len = buffer.length;
        while (len > 0) {
            var n = Math.min(len, 3800);
            len -= n;
            while (--n >= 0) {
                a += buffer[x++] & 0xFF;
                b += a;
            }
            a %= 65521;
            b %= 65521;
        }
        return ((b << 16) | a) >>> 0;
    }
    exports.adler32 = adler32;
});
