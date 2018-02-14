define(["require", "exports", "../io/memory-stream", "../compression/zlib"], function (require, exports, memory_stream_1, zlib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeflateStream = /** @class */ (function () {
        function DeflateStream(_stream, _mode, _options) {
            this._stream = _stream;
            this._mode = _mode;
            this._options = _options;
            if (_mode == zlib_1.CompressionMode.Compress || _mode == zlib_1.CompressionMode.CompressRaw) {
                this._memory = memory_stream_1.MemoryStream.reserve(8192); // only needed for compressing
            }
            this._transform = zlib_1.createDeflate(_mode, _options);
        }
        DeflateStream.prototype.write = function (buffer, index, length) {
            if (this._mode == zlib_1.CompressionMode.Decompress) {
                throw new Error('invalid stream mode');
            }
            if (this._memory === null) {
                throw new Error('Stream disposed.');
            }
            if (this._transform === null) {
                throw new Error('Invalid transform handle.');
            }
            throw new Error("not implemented");
        };
        DeflateStream.prototype.read = function (buffer, index, length) {
            if (this._mode == zlib_1.CompressionMode.Compress) {
                throw new Error('invalid stream mode');
            }
            throw new Error("not implemented");
        };
        DeflateStream.prototype.copyTo = function (stream) {
            var input = Buffer.alloc(this._stream.length);
            this.position = 0;
            this._stream.read(input, 0, input.length);
            var buffer = zlib_1.deflate(input, this._mode, this._options);
            if (buffer) {
                stream.write(buffer, 0, buffer.length);
            }
        };
        DeflateStream.prototype.dispose = function () {
            if (this._memory === null) {
                throw new Error('Stream disposed.');
            }
            if (this._mode == zlib_1.CompressionMode.Compress) {
                var streamData = this._memory.getBuffer();
                this._stream.write(streamData, 0, streamData.length);
            }
            if (this._memory) {
                if (this._memory.length != 0 && this._transform) {
                    this._transform.end();
                }
                this._memory = null;
            }
            this._transform = null;
        };
        DeflateStream.prototype.close = function () {
            this.dispose();
        };
        Object.defineProperty(DeflateStream.prototype, "eof", {
            get: function () {
                throw new Error("Method not supported.");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeflateStream.prototype, "length", {
            get: function () {
                return this._stream.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeflateStream.prototype, "position", {
            get: function () {
                return this._stream.position;
            },
            set: function (offset) {
                this._stream.position = 0;
            },
            enumerable: true,
            configurable: true
        });
        DeflateStream.prototype.seek = function (offset, origin) {
            return this._stream.seek(offset, origin);
        };
        DeflateStream.prototype.readByte = function () {
            return this._stream.readByte();
        };
        return DeflateStream;
    }());
    exports.DeflateStream = DeflateStream;
});
