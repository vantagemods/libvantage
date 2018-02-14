define(["require", "exports", "big-integer", "./stream"], function (require, exports, bigInteger, stream_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Endianness;
    (function (Endianness) {
        Endianness["Little"] = "le";
        Endianness["Big"] = "be";
    })(Endianness = exports.Endianness || (exports.Endianness = {}));
    var minUInt64 = bigInteger.zero;
    var maxUInt64 = bigInteger("18446744073709551615", 10);
    var minInt64 = bigInteger('-9223372036854775808', 10);
    var maxInt64 = bigInteger('9223372036854775807', 10);
    var bigIntNegateCache = new Map([
        [8, maxUInt64.add(1)],
    ]);
    var numberBuffer = Buffer.alloc(8);
    var stringBuffer;
    var BinaryStream = /** @class */ (function () {
        function BinaryStream(_stream, endianness) {
            if (endianness === void 0) { endianness = Endianness.Little; }
            this._stream = _stream;
            this.endianness = endianness;
        }
        Object.defineProperty(BinaryStream.prototype, "baseStream", {
            get: function () {
                return this._stream;
            },
            enumerable: true,
            configurable: true
        });
        BinaryStream.prototype.dispose = function () {
            this._stream.dispose();
        };
        Object.defineProperty(BinaryStream.prototype, "endianness", {
            get: function () {
                return this._endiannessValue;
            },
            set: function (endianness) {
                this._endiannessValue = endianness;
                this._endiannessPostfix = endianness === Endianness.Big ? 'BE' : 'LE';
            },
            enumerable: true,
            configurable: true
        });
        BinaryStream.prototype.skip = function (offset) {
            this._stream.seek(offset, stream_1.SeekOrigin.Current);
            return this;
        };
        BinaryStream.prototype.readBytes = function (length) {
            var buffer = Buffer.alloc(length);
            var readBytes = this._stream.read(buffer, 0, length);
            return buffer.slice(0, readBytes);
        };
        BinaryStream.prototype.readToEnd = function () {
            return this.readBytes(this._stream.length - this._stream.position);
        };
        BinaryStream.prototype.getBuffer = function () {
            this._stream.position = 0;
            return this.readBytes(this._stream.length - this._stream.position);
        };
        BinaryStream.prototype.readNumber = function (type, size) {
            this._stream.read(numberBuffer, 0, size);
            return numberBuffer["read" + type + this._endiannessPostfix](0);
        };
        BinaryStream.prototype.readByte = function () {
            return this._stream.readByte();
        };
        BinaryStream.prototype.readBoolean = function () {
            return this.readByte() !== 0;
        };
        BinaryStream.prototype.readUInt16 = function () {
            return this.readNumber('UInt16', 2);
        };
        BinaryStream.prototype.readInt16 = function () {
            return this.readNumber('Int16', 2);
        };
        BinaryStream.prototype.readUInt32 = function () {
            return this.readNumber('UInt32', 4);
        };
        BinaryStream.prototype.readInt32 = function () {
            return this.readNumber('Int32', 4);
        };
        BinaryStream.prototype.readInt64 = function () {
            return this.readSignedBigInteger(8);
        };
        BinaryStream.prototype.readUInt64 = function () {
            return this.readUnsignedBigInteger(8);
        };
        BinaryStream.prototype.readInt64Unsafe = function () {
            return this.readInt64().toJSNumber();
        };
        BinaryStream.prototype.readUInt64Unsafe = function () {
            return this.readUInt64().toJSNumber();
        };
        BinaryStream.prototype.readSignedBigInteger = function (size) {
            var buffer = this.readBytes(size);
            if (this.endianness === Endianness.Little) {
                buffer.reverse();
            }
            var value = bigInteger(buffer.toString('hex'), 16);
            return (buffer[0] & 0x80) > 0
                ? this.setBigIntegerSign(value, size, true)
                : value;
        };
        BinaryStream.prototype.setBigIntegerSign = function (value, size, negative) {
            var negateValue = bigIntNegateCache.get(size);
            if (negateValue === undefined) {
                negateValue = bigInteger('f'.repeat(size * 2), 16).add(1);
                bigIntNegateCache.set(size, negateValue);
            }
            return value[negative ? 'subtract' : 'add'](negateValue);
        };
        BinaryStream.prototype.readUnsignedBigInteger = function (size) {
            var buffer = this.readBytes(size);
            if (this.endianness === Endianness.Little) {
                buffer.reverse();
            }
            return bigInteger(buffer.toString('hex'), 16);
        };
        BinaryStream.prototype.readFloat = function () {
            return this.readNumber('Float', 4);
        };
        BinaryStream.prototype.readDouble = function () {
            return this.readNumber('Double', 8);
        };
        BinaryStream.prototype.loop = function (type, callback) {
            var count = this["read" + type]();
            var results = [];
            while (count--) {
                results.push(callback(this));
            }
            return results;
        };
        BinaryStream.prototype.loopByte = function (callback) {
            return this.loop('Byte', callback);
        };
        BinaryStream.prototype.loopUInt16 = function (callback) {
            return this.loop('UInt16', callback);
        };
        BinaryStream.prototype.loopUInt32 = function (callback) {
            return this.loop('UInt32', callback);
        };
        BinaryStream.prototype.loopUInt64 = function (callback) {
            return this.loop('UInt64Unsafe', callback);
        };
        BinaryStream.prototype.getStringBuffer = function (length) {
            if (stringBuffer === undefined) {
                stringBuffer = Buffer.alloc(Math.min(length, 32));
            }
            else if (length > stringBuffer.length) {
                var expansion = Math.max(stringBuffer.length * 2, length) - stringBuffer.length;
                stringBuffer = Buffer.concat([stringBuffer, Buffer.alloc(expansion)], stringBuffer.length + expansion);
            }
            return stringBuffer;
        };
        BinaryStream.prototype.readString = function (encoding, bytes) {
            if (bytes === void 0) { bytes = -1; }
            if (bytes === -1) {
                return this.readCString(encoding);
            }
            var buffer = this.getStringBuffer(bytes);
            this._stream.read(buffer, 0, bytes);
            return buffer.toString(encoding);
        };
        BinaryStream.prototype.readCString = function (encoding) {
            var terminatorLength = Buffer.byteLength('\0', encoding);
            var x = 0;
            var consecutiveNullBytes = 0;
            var buffer = this.getStringBuffer(terminatorLength);
            while (true) {
                if ((buffer[x++] = this._stream.readByte()) !== 0) {
                    consecutiveNullBytes = 0;
                }
                else if (++consecutiveNullBytes === terminatorLength) {
                    return buffer.toString(encoding, 0, x - terminatorLength);
                }
                if (x === buffer.length) {
                    buffer = this.getStringBuffer(x * 2);
                }
            }
        };
        BinaryStream.prototype.writeBytes = function (value) {
            this._stream.write(value, 0, value.length);
            return this;
        };
        BinaryStream.prototype.writeNumber = function (type, value, size) {
            numberBuffer["write" + type + (size > 1 ? this._endiannessPostfix : '')](value, 0);
            this._stream.write(numberBuffer, 0, size);
            return this;
        };
        BinaryStream.prototype.writeByte = function (value) {
            return this.writeNumber('UInt8', value, 1);
        };
        BinaryStream.prototype.writeBoolean = function (flag) {
            return this.writeByte(flag ? 1 : 0);
        };
        BinaryStream.prototype.writeUInt16 = function (value) {
            return this.writeNumber('UInt16', value, 2);
        };
        BinaryStream.prototype.writeInt16 = function (value) {
            return this.writeNumber('Int16', value, 2);
        };
        BinaryStream.prototype.writeUInt32 = function (value) {
            return this.writeNumber('UInt32', value, 4);
        };
        BinaryStream.prototype.writeInt32 = function (value) {
            return this.writeNumber('Int32', value, 4);
        };
        BinaryStream.prototype.writeUInt64 = function (value) {
            return this.writeBigInteger(this.assertBigIntegerBounds(value, minUInt64, maxUInt64), 8);
        };
        BinaryStream.prototype.writeInt64 = function (value) {
            return this.writeBigInteger(this.assertBigIntegerBounds(value, minInt64, maxInt64), 8);
        };
        BinaryStream.prototype.writeBigInteger = function (value, byteLength) {
            if (byteLength === void 0) { byteLength = -1; }
            var hexString = value.toString(16);
            var negative = value.isNegative();
            if (negative) {
                value = this.setBigIntegerSign(value, (hexString.length - 1) / 2, false);
                hexString = value.toString(16);
            }
            if (byteLength >= 0) {
                var nibbleLength = byteLength * 2;
                if (hexString.length > nibbleLength) {
                    throw new Error("Cannot write BigInteger larger than " + byteLength + " bytes.");
                }
                if (hexString.length < nibbleLength) {
                    hexString = hexString.padStart(nibbleLength, negative ? 'f' : '0');
                }
            }
            var buffer = Buffer.from(hexString, 'hex');
            if (this.endianness === Endianness.Little) {
                buffer.reverse();
            }
            return this.writeBytes(buffer);
        };
        BinaryStream.prototype.assertBigIntegerBounds = function (value, min, max) {
            if (typeof value === 'number') {
                value = bigInteger(value);
            }
            if (value.lt(min)) {
                throw new Error('Cannot write integer less than minimum value.');
            }
            else if (value.gt(max)) {
                throw new Error('Cannot write integer greater than maximum value.');
            }
            return value;
        };
        BinaryStream.prototype.writeFloat = function (value) {
            return this.writeNumber('Float', value, 4);
        };
        BinaryStream.prototype.writeDouble = function (value) {
            return this.writeNumber('Double', value, 8);
        };
        BinaryStream.prototype.writeString = function (value, encoding, nullTerminate) {
            if (encoding === void 0) { encoding = 'utf8'; }
            if (nullTerminate === void 0) { nullTerminate = false; }
            if (nullTerminate) {
                value += '\0';
            }
            var buffer = new Buffer(value, encoding);
            this._stream.write(buffer, 0, buffer.length);
            return this;
        };
        return BinaryStream;
    }());
    exports.BinaryStream = BinaryStream;
});
