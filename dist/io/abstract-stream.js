define(["require", "exports", "./stream"], function (require, exports, stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbstractStream = /** @class */ (function () {
        function AbstractStream() {
        }
        Object.defineProperty(AbstractStream.prototype, "eof", {
            get: function () {
                return this.position >= this.length;
            },
            enumerable: true,
            configurable: true
        });
        AbstractStream.prototype.seek = function (offset, origin) {
            if (origin === void 0) { origin = stream_1.SeekOrigin.Begin; }
            switch (origin) {
                case stream_1.SeekOrigin.Begin:
                    this.position = offset;
                    break;
                case stream_1.SeekOrigin.End:
                    this.position = this.length - offset;
                    break;
                case stream_1.SeekOrigin.Current:
                    this.position += offset;
                    break;
            }
            return this.position;
        };
        AbstractStream.prototype.close = function () {
            this.dispose();
        };
        AbstractStream.prototype.dispose = function () {
        };
        return AbstractStream;
    }());
    exports.AbstractStream = AbstractStream;
});
