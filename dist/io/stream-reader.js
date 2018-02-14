define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StreamReader = /** @class */ (function () {
        function StreamReader(_baseStream) {
            this._baseStream = _baseStream;
        }
        StreamReader.prototype.readToEnd = function () {
            var length = this._baseStream.length;
            var buffer = Buffer.alloc(length);
            var readBytes = this._baseStream.read(buffer, 0, length);
            return buffer.slice(0, readBytes);
        };
        return StreamReader;
    }());
    exports.StreamReader = StreamReader;
});
