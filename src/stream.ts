import * as bigInteger  from 'big-integer';
import { BigInteger } from "big-integer";

export enum SeekOrigin {
    Begin = 'begin',
    End = 'end',
    Current = 'current',
}

const minUInt64 = bigInteger.zero;
const maxUInt64 = bigInteger("18446744073709551615", 10);
const minInt64 = bigInteger('-9223372036854775808', 10);
const maxInt64 = bigInteger('9223372036854775807', 10);

const bigIntNegateCache = new Map<number, BigInteger>([
    [8, maxUInt64.add(1)],
]);

export class Stream {
    private _position = 0;
    private _length: number;

    constructor(private _buffer: Buffer) {
        this._length = _buffer.length;
    }

    public static alloc(size: number): Stream {
        return new Stream(Buffer.alloc(size));
    }

    public static reserve(size: number): Stream {
        const stream = Stream.alloc(size);
        stream._length = 0;
        return stream;
    }

    public getBuffer(): Buffer {
        return this._buffer.slice(0, this.length);
    }

    public dispose(): void {
        this._buffer = <any>null;
    }

    public get eof(): boolean {
        return this.position >= this.length;
    }

    public get length(): number {
        return this._length;
    }

    public get position(): number {
        return this._position;
    }

    public set position(address: number) {
        if (address > this.length) {
            throw new Error('Cannot seek past end of stream.');
        }
        this._position = address;
    }

    public seek(offset: number, origin: SeekOrigin = SeekOrigin.Begin): Stream {
        switch (origin) {
            case SeekOrigin.Begin:
                this.position = offset;
                break;
            case SeekOrigin.End:
                this.position = this.length - offset;
                break;
            case SeekOrigin.Current:
                this.position += offset;
                break;
        }
        return this;
    }

    public skip(offset: number): Stream {
        this.seek(offset, SeekOrigin.Current);
        return this;
    }

    public resize(size: number): Stream {
        if (size > this._buffer.length) {
            this._buffer = Buffer.concat([this._buffer], size);
        }
        this._length = size;
        return this;
    }

    private expand(size: number): void {
        const reserve = this.position + size;
        if (reserve > this._length) {
            if (reserve > this._buffer.length) {
                this._buffer = Buffer.concat([this._buffer], Math.max(reserve, this._buffer.length * 1.5));
            }
            this._length = reserve;
        }
    }

    public readBytes(length: number): Buffer {        
        const buf = this._buffer.slice(this.position, this.position + length);
        this.position += length;
        return buf;
    }

    public readToEnd(): Buffer {
        return this.readBytes(this.length - this.position);
    }

    private readNumber(type: string, size: number): number {
        const result = (<any>this._buffer)[`read${type}`](this.position);
        this.position += size;
        return result;
    }

    public readByte(): number {
        return this.readNumber('UInt8', 1);
    }

    public readBoolean(): boolean {
        return this.readByte() !== 0;
    }

    public readUInt16(): number {
        return this.readNumber('UInt16LE', 2);
    }

    public readInt16(): number {
        return this.readNumber('Int16LE', 2);
    }

    public readUInt32(): number {
        return this.readNumber('UInt32LE', 4);
    }

    public readInt32(): number {
        return this.readNumber('Int32LE', 4);
    }

    public readInt64(): BigInteger {
        return this.readSignedBigInteger(8);
    }

    public readUInt64(): BigInteger {
        return this.readUnsignedBigInteger(8);
    }

    public readInt64Unsafe(): number {
        return this.readInt64().toJSNumber();
    }

    public readUInt64Unsafe(): number {
        return this.readUInt64().toJSNumber();
    }

    public readSignedBigInteger(size: number): BigInteger {
        const buffer = this.readBytes(size);
        buffer.reverse();
        let value = bigInteger(buffer.toString('hex'), 16);
        return (buffer[0] & 0x80) > 0
            ? this.setBigIntegerSign(value, size, true)
            : value;
    }

    private setBigIntegerSign(value: BigInteger, size: number, negative: boolean): BigInteger {
        let negateValue = bigIntNegateCache.get(size);
        if (negateValue === undefined) {
            negateValue = bigInteger('f'.repeat(size * 2), 16).add(1);
            bigIntNegateCache.set(size, negateValue);
        }
        return value[negative ? 'subtract' : 'add'](negateValue);
    }

    public readUnsignedBigInteger(size: number): BigInteger {
        const buffer = this.readBytes(size);
        buffer.reverse();
        return bigInteger(buffer.toString('hex'), 16);
    }

    public readFloat(): number {
        return this.readNumber('FloatLE', 4);
    }

    public readDouble(): number {
        return this.readNumber('DoubleLE', 8);
    }

    private loop<T>(type: string, callback: (io: Stream) => T): T[] {
        let count: number = (<any>this)[`read${type}`]();
        const results: T[] = [];
        while (count--) {
            results.push(callback(this));
        }
        return results;
    }

    public loopByte<T>(callback: (io: Stream) => T): T[] {
        return this.loop('Byte', callback);
    }

    public loopUInt16<T>(callback: (io: Stream) => T): T[] {
        return this.loop('UInt16', callback);
    }

    public loopUInt32<T>(callback: (io: Stream) => T): T[] {
        return this.loop('UInt32', callback);
    }

    public loopUInt64<T>(callback: (io: Stream) => T): T[] {
        return this.loop('UInt64Unsafe', callback);
    }

    private getCStringLength(encoding: BufferEncoding): number {
        let position = this.position;
        const terminatorLength = Buffer.byteLength('\0', encoding);
        while (position + terminatorLength <= this.length) {
            if (this._buffer.slice(position, position + terminatorLength).every((v: number) => v === 0)) {
                return position - this.position;
            }
            position++;
        }
        return this.length - this.position;
    }

    public readString(encoding: BufferEncoding, chars: number = -1): string {
        const length = chars === -1 
            ? this.getCStringLength(encoding) 
            : (Buffer.byteLength('\0', encoding) * chars);
        const result = this._buffer.toString(encoding, this.position, this.position + length);
        this.position += length;
        return result;
    }

    public writeBytes(value: Buffer): Stream {
        this.expand(value.length);
        value.copy(this._buffer, this.position);
        this.position += value.length;
        return this;
    }

    private writeNumber(type: string, value: number, size: number): Stream {
        this.expand(size);
        (<any>this._buffer)[`write${type}`](value, this.position);
        this.position += size;
        return this;
    }

    public writeByte(value: number): Stream {
        this.expand(1);           
        return this.writeNumber('UInt8', (value & 0xFF), 1);
    }

    public writeBoolean(flag: boolean): Stream {
        return this.writeByte(flag ? 1 : 0);
    }

    public writeUInt16(value: number): Stream {
        this.expand(2);           
        return this.writeNumber('UInt16LE', value >>> 0, 2);
    }

    public writeInt16(value: number): Stream {
        this.expand(2);   
        return this.writeNumber('Int16LE', value, 2);
    }

    public writeUInt32(value: number): Stream {
        this.expand(4);        
        return this.writeNumber('UInt32LE', value >>> 0, 4);
    }

    public writeInt32(value: number): Stream {
        this.expand(4);
        return this.writeNumber('Int32LE', value, 4);
    }

    public writeUInt64(value: BigInteger|number): Stream {
        return this.writeBigInteger(this.assertBigIntegerBounds(value, minUInt64, maxUInt64), 8);  
    }

    public writeInt64(value: BigInteger|number): Stream {
        return this.writeBigInteger(this.assertBigIntegerBounds(value, minInt64, maxInt64), 8);  
    }

    public writeBigInteger(value: BigInteger, byteLength: number = -1): Stream {
        let hexString = value.toString(16);
        const negative = value.isNegative();
        if (negative) {
            value = this.setBigIntegerSign(value, (hexString.length - 1) / 2, false);
            hexString = value.toString(16);
        }
        
        if (byteLength >= 0) {
            const nibbleLength = byteLength * 2;
            if (hexString.length > nibbleLength) {
                throw new Error(`Cannot write BigInteger larger than ${byteLength} bytes.`);
            }
            if (hexString.length < nibbleLength) {
                hexString = hexString.padStart(nibbleLength, negative ? 'f' : '0');
            }
        }
        return this.writeBytes(this.reverseBufferInPlace(Buffer.from(hexString, 'hex')));
    }

    private assertBigIntegerBounds(value: BigInteger|number, min: BigInteger, max: BigInteger): BigInteger {
        if (typeof value === 'number') {
            value = bigInteger(value);
        }
        if (value.lt(min)) {
            throw new Error('Cannot write integer less than minimum value.');
        } else if (value.gt(max)) {
            throw new Error('Cannot write integer greater than maximum value.');
        }
        return value;
    }

    public writeFloat(value: number): Stream {
        this.expand(4);        
        return this.writeNumber('FloatLE', value, 4);
    }

    public writeDouble(value: number): Stream {
        this.expand(8);
        return this.writeNumber('DoubleLE', value, 8);
    }

    public writeString(value: string, encoding: BufferEncoding = 'utf8', nullTerminate: boolean = false): Stream {
        if (nullTerminate) {
            value += '\0';
        }
        const byteLength = Buffer.byteLength(value, encoding);
        this.expand(byteLength);
        this._buffer.write(value, this.position, byteLength, encoding);
        this.position += byteLength;
        return this;
    }

    private reverseBufferInPlace(buffer: Buffer): Buffer {
        for (let x = 0, i = buffer.length - 1; x < i; ++x, --i) {
            var value = buffer[i];
            buffer[i] = buffer[x];
            buffer[x] = value;
        }
        return buffer;
    }
}
