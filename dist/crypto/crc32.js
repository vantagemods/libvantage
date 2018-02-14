define(["require", "exports", "crc-32"], function (require, exports, CRC32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function crc32(buffer, offset, length, seed) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = -1; }
        if (length === -1) {
            length = buffer.length - offset;
        }
        if (offset !== 0) {
            buffer = buffer.slice(offset, offset + length);
        }
        return new Uint32Array([CRC32.buf(buffer, seed)])[0];
    }
    exports.crc32 = crc32;
});
