define(["require", "exports", "zlib"], function (require, exports, zlib) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CompressionMode;
    (function (CompressionMode) {
        CompressionMode[CompressionMode["Decompress"] = 0] = "Decompress";
        CompressionMode[CompressionMode["Compress"] = 1] = "Compress";
        CompressionMode[CompressionMode["DecompressRaw"] = 2] = "DecompressRaw";
        CompressionMode[CompressionMode["CompressRaw"] = 3] = "CompressRaw";
    })(CompressionMode = exports.CompressionMode || (exports.CompressionMode = {}));
    function zlibDecompress(buffer, options) {
        return zlib.inflateSync(buffer, options);
    }
    exports.zlibDecompress = zlibDecompress;
    function zlibCompress(buffer, options) {
        return zlib.deflateSync(buffer, options);
    }
    exports.zlibCompress = zlibCompress;
    function zlibDecompressRaw(buffer, options) {
        return zlib.inflateRawSync(buffer, options);
    }
    exports.zlibDecompressRaw = zlibDecompressRaw;
    function zlibCompressRaw(buffer, options) {
        return zlib.deflateRawSync(buffer, options);
    }
    exports.zlibCompressRaw = zlibCompressRaw;
    function zlibCreateDeflate(options) {
        return zlib.createDeflate(options);
    }
    exports.zlibCreateDeflate = zlibCreateDeflate;
    function zlibCreateInflate(options) {
        return zlib.createInflate(options);
    }
    exports.zlibCreateInflate = zlibCreateInflate;
    function zlibCreateDeflateRaw(options) {
        return zlib.createDeflateRaw(options);
    }
    exports.zlibCreateDeflateRaw = zlibCreateDeflateRaw;
    function zlibCreateInflateRaw(options) {
        return zlib.createInflateRaw(options);
    }
    exports.zlibCreateInflateRaw = zlibCreateInflateRaw;
    function createDeflate(mode, options) {
        switch (mode) {
            case CompressionMode.Compress:
                return zlibCreateDeflate(options);
            case CompressionMode.CompressRaw:
                return zlibCreateDeflateRaw(options);
            case CompressionMode.Decompress:
                return zlibCreateInflate(options);
            case CompressionMode.DecompressRaw:
                return zlibCreateInflateRaw(options);
        }
        throw Error("undefined deflate type");
    }
    exports.createDeflate = createDeflate;
    function deflate(buffer, mode, options) {
        switch (mode) {
            case CompressionMode.Compress:
                return zlibCompress(buffer, options);
            case CompressionMode.CompressRaw:
                return zlibCompressRaw(buffer, options);
            case CompressionMode.Decompress:
                return zlibDecompress(buffer, options);
            case CompressionMode.DecompressRaw:
                return zlibDecompressRaw(buffer, options);
        }
        throw Error("undefined deflate type");
    }
    exports.deflate = deflate;
});
