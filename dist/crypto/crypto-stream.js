define(["require", "exports", "../io/memory-stream"], function (require, exports, memory_stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CryptoStreamMode;
    (function (CryptoStreamMode) {
        CryptoStreamMode[CryptoStreamMode["Read"] = 0] = "Read";
        CryptoStreamMode[CryptoStreamMode["Write"] = 1] = "Write";
    })(CryptoStreamMode = exports.CryptoStreamMode || (exports.CryptoStreamMode = {}));
    var CryptoStream = /** @class */ (function () {
        function CryptoStream(_stream, _transform, _mode) {
            this._stream = _stream;
            this._transform = _transform;
            this._mode = _mode;
            if (_mode == CryptoStreamMode.Write) {
                this._memory = memory_stream_1.MemoryStream.alloc(0x1000);
            }
        }
        CryptoStream.prototype.write = function (buffer, index, length) {
            if (this._mode == CryptoStreamMode.Read) {
                throw new Error('Invalid stream mode');
            }
            if (this._memory === null) {
                throw new Error('Stream disposed.');
            }
            var output = Buffer.alloc(length);
            var copied = this._transform.transformBlock(buffer, index, length, output);
            return this._memory.write(output, 0, copied);
        };
        CryptoStream.prototype.read = function (buffer, index, length) {
            if (this._mode == CryptoStreamMode.Write) {
                throw new Error('Invalid stream mode');
            }
            var data = Buffer.alloc(length);
            var readLength = this._stream.read(data, 0, length);
            var output = Buffer.alloc(readLength);
            var copied = this._transform.transformBlock(data, 0, readLength, output);
            var remainder = readLength - copied;
            if (remainder > 0) {
                var final = this._transform.transformFinalBlock();
                remainder = final.copy(output, copied, 0, remainder);
            }
            return output.copy(buffer, index, 0, copied + remainder);
        };
        CryptoStream.prototype.dispose = function () {
            if (this._memory === null) {
                throw new Error('Stream disposed.');
            }
            if (this._mode == CryptoStreamMode.Write) {
                var streamData = this._memory.getBuffer();
                this._stream.write(streamData, 0, streamData.length);
                var buffer = this._transform.transformFinalBlock();
                if (buffer.length > 0) {
                    this._stream.write(buffer, 0, buffer.length);
                }
            }
            this._memory = null;
        };
        CryptoStream.prototype.close = function () {
            this.dispose();
        };
        Object.defineProperty(CryptoStream.prototype, "eof", {
            get: function () {
                throw new Error("Method not supported.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CryptoStream.prototype, "length", {
            get: function () {
                return this._stream.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CryptoStream.prototype, "position", {
            get: function () {
                return this._stream.position;
            },
            set: function (offset) {
                this._stream.position = 0;
            },
            enumerable: true,
            configurable: true
        });
        CryptoStream.prototype.seek = function (offset, origin) {
            return this._stream.seek(offset, origin);
        };
        CryptoStream.prototype.readByte = function () {
            return this._stream.readByte();
        };
        return CryptoStream;
    }());
    exports.CryptoStream = CryptoStream;
});
