define(["require", "exports", "tslib", "./abstract-stream"], function (require, exports, tslib_1, abstract_stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MemoryStream = /** @class */ (function (_super) {
        tslib_1.__extends(MemoryStream, _super);
        function MemoryStream(buffer) {
            var _this = _super.call(this) || this;
            _this._position = 0;
            _this._buffer = buffer || Buffer.alloc(0x10);
            _this._length = _this._buffer.length;
            return _this;
        }
        MemoryStream.alloc = function (size) {
            return new MemoryStream(Buffer.alloc(size));
        };
        MemoryStream.reserve = function (size) {
            var stream = MemoryStream.alloc(size);
            stream._length = 0;
            return stream;
        };
        MemoryStream.prototype.getBuffer = function () {
            return this._buffer.slice(0, this.length);
        };
        MemoryStream.prototype.dispose = function () {
            this._buffer = null;
        };
        Object.defineProperty(MemoryStream.prototype, "length", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MemoryStream.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (address) {
                if (address > this.length) {
                    throw new Error('Cannot seek past end of stream.');
                }
                this._position = address;
            },
            enumerable: true,
            configurable: true
        });
        MemoryStream.prototype.resize = function (size) {
            if (size > this._buffer.length) {
                this._buffer = Buffer.concat([this._buffer], size);
            }
            this._length = size;
            return this;
        };
        MemoryStream.prototype.expand = function (size) {
            var reserve = this.position + size;
            if (reserve > this._length) {
                if (reserve > this._buffer.length) {
                    this._buffer = Buffer.concat([this._buffer], Math.max(reserve, this._buffer.length * 1.5));
                }
                this._length = reserve;
            }
        };
        MemoryStream.prototype.readByte = function () {
            return this._buffer[this.position++];
        };
        MemoryStream.prototype.read = function (buffer, index, length) {
            this.position += length;
            return this._buffer.copy(buffer, index, this.position - length, this.position);
        };
        MemoryStream.prototype.write = function (buffer, index, length) {
            this.expand(length);
            var written = buffer.copy(this._buffer, this.position, index, length);
            this.position += written;
            return written;
        };
        return MemoryStream;
    }(abstract_stream_1.AbstractStream));
    exports.MemoryStream = MemoryStream;
});
