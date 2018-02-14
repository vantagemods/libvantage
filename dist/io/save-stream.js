define(["require", "exports", "tslib", "../io/binary-stream"], function (require, exports, tslib_1, binary_stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveStream = /** @class */ (function (_super) {
        tslib_1.__extends(SaveStream, _super);
        function SaveStream() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SaveStream;
    }(binary_stream_1.BinaryStream));
    exports.SaveStream = SaveStream;
});
