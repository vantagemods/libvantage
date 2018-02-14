define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StreamWriter = /** @class */ (function () {
        function StreamWriter(_baseStream) {
            this._baseStream = _baseStream;
        }
        StreamWriter.prototype.write = function (buffer) {
            this._baseStream.write(buffer, 0, buffer.length);
        };
        return StreamWriter;
    }());
    exports.StreamWriter = StreamWriter;
});
