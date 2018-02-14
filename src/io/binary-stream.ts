import * as bigInteger  from 'big-integer';
import { BigInteger } from "big-integer";
import { Stream, SeekOrigin } from './stream';

export enum Endianness {
    Little = 'le',
    Big = 'be',
}

const minUInt64 = bigInteger.zero;
const maxUInt64 = bigInteger("18446744073709551615", 10);
const minInt64 = bigInteger('-9223372036854775808', 10);
const maxInt64 = bigInteger('9223372036854775807', 10);

const bigIntNegateCache = new Map<number, BigInteger>([
    [8, maxUInt64.add(1)],
]);

const numberBuffer = Buffer.alloc(8);
let stringBuffer: Buffer;

export class BinaryStream {
    private _endiannessValue: Endianness;
    private _endiannessPostfix: string;
    
    constructor(private _stream: Stream, endianness = Endianness.Little) {
        this.endianness = endianness;
    }

    public get baseStream(): Stream {
        return this._stream;
    }

    public dispose(): void {
        this._stream.dispose();
    }

    public get endianness(): Endianness {
        return this._endiannessValue;
    }

    public set endianness(endianness: Endianness) {
        this._endiannessValue = endianness;
        this._endiannessPostfix = endianness === Endianness.Big ? 'BE' : 'LE';
    }

    public skip(offset: number): BinaryStream {
        this._stream.seek(offset, SeekOrigin.Current);
        return this;
    }

    public readBytes(length: number): Buffer {
        const buffer = Buffer.alloc(length);
        const readBytes = this._stream.read(buffer, 0, length);
        return buffer.slice(0, readBytes);
    }

    public readToEnd(): Buffer {
        return this.readBytes(this._stream.length - this._stream.position);
    }

    public getBuffer(): Buffer {
        this._stream.position = 0;
        return this.readBytes(this._stream.length - this._stream.position);
    }

    private readNumber(type: string, size: number): number {
        this._stream.read(numberBuffer, 0, size);
        return (<any>numberBuffer)[`read${type}${this._endiannessPostfix}`](0);
    }

    public readByte(): number {
        return this._stream.readByte();
    }

    public readBoolean(): boolean {
        return this.readByte() !== 0;
    }

    public readUInt16(): number {
        return this.readNumber('UInt16', 2);
    }

    public readInt16(): number {
        return this.readNumber('Int16', 2);
    }

    public readUInt32(): number {
        return this.readNumber('UInt32', 4);
    }

    public readInt32(): number {
        return this.readNumber('Int32', 4);
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
        if (this.endianness === Endianness.Little) {
            buffer.reverse();
        }
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
        if (this.endianness === Endianness.Little) {
            buffer.reverse();
        }
        return bigInteger(buffer.toString('hex'), 16);
    }

    public readFloat(): number {
        return this.readNumber('Float', 4);
    }

    public readDouble(): number {
        return this.readNumber('Double', 8);
    }

    private loop<T>(type: string, callback: (io: BinaryStream) => T): T[] {
        let count: number = (<any>this)[`read${type}`]();
        const results: T[] = [];
        while (count--) {
            results.push(callback(this));
        }
        return results;
    }

    public loopByte<T>(callback: (io: BinaryStream) => T): T[] {
        return this.loop('Byte', callback);
    }

    public loopUInt16<T>(callback: (io: BinaryStream) => T): T[] {
        return this.loop('UInt16', callback);
    }

    public loopUInt32<T>(callback: (io: BinaryStream) => T): T[] {
        return this.loop('UInt32', callback);
    }

    public loopUInt64<T>(callback: (io: BinaryStream) => T): T[] {
        return this.loop('UInt64Unsafe', callback);
    }

    private getStringBuffer(length: number): Buffer {
        if (stringBuffer === undefined) {
            stringBuffer = Buffer.alloc(Math.min(length, 32));
        } else if (length > stringBuffer.length) {
            const expansion = Math.max(stringBuffer.length * 2, length) - stringBuffer.length;
            stringBuffer = Buffer.concat([stringBuffer, Buffer.alloc(expansion)], stringBuffer.length + expansion);
        }
        return stringBuffer;
    }

    public readString(encoding: BufferEncoding, bytes: number = -1): string {
        if (bytes === -1) {
            return this.readCString(encoding);
        }
        const buffer = this.getStringBuffer(bytes);
        this._stream.read(buffer, 0, bytes);
        return buffer.toString(encoding);
    }

    private readCString(encoding: BufferEncoding): string {
        const terminatorLength = Buffer.byteLength('\0', encoding);
        let x = 0;
        let consecutiveNullBytes = 0;
        let buffer = this.getStringBuffer(terminatorLength);
        while (true) {
            if ((buffer[x++] = this._stream.readByte()) !== 0) {
                consecutiveNullBytes = 0;
            } else if (++consecutiveNullBytes === terminatorLength) {
                return buffer.toString(encoding, 0, x - terminatorLength);
            }
            if (x === buffer.length) {
                buffer = this.getStringBuffer(x * 2);
            }
        } 
    }

    public writeBytes(value: Buffer): BinaryStream {
        this._stream.write(value, 0, value.length);
        return this;
    }

    private writeNumber(type: string, value: number, size: number): BinaryStream {
        (<any>numberBuffer)[`write${type}${size > 1 ? this._endiannessPostfix : ''}`](value, 0);
        this._stream.write(numberBuffer, 0, size);
        return this;
    }

    public writeByte(value: number): BinaryStream {        
        return this.writeNumber('UInt8', value, 1);
    }

    public writeBoolean(flag: boolean): BinaryStream {
        return this.writeByte(flag ? 1 : 0);
    }

    public writeUInt16(value: number): BinaryStream {       
        return this.writeNumber('UInt16', value, 2);
    }

    public writeInt16(value: number): BinaryStream {
        return this.writeNumber('Int16', value, 2);
    }

    public writeUInt32(value: number): BinaryStream {      
        return this.writeNumber('UInt32', value, 4);
    }

    public writeInt32(value: number): BinaryStream {
        return this.writeNumber('Int32', value, 4);
    }

    public writeUInt64(value: BigInteger|number): BinaryStream {
        return this.writeBigInteger(this.assertBigIntegerBounds(value, minUInt64, maxUInt64), 8);  
    }

    public writeInt64(value: BigInteger|number): BinaryStream {
        return this.writeBigInteger(this.assertBigIntegerBounds(value, minInt64, maxInt64), 8);  
    }

    public writeBigInteger(value: BigInteger, byteLength: number = -1): BinaryStream {
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
        let buffer = Buffer.from(hexString, 'hex');
        if (this.endianness === Endianness.Little) {
            buffer.reverse();
        }
        return this.writeBytes(buffer);
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

    public writeFloat(value: number): BinaryStream {    
        return this.writeNumber('Float', value, 4);
    }

    public writeDouble(value: number): BinaryStream {
        return this.writeNumber('Double', value, 8);
    }

    public writeString(value: string, encoding: BufferEncoding = 'utf8', nullTerminate: boolean = false): BinaryStream {
        if (nullTerminate) {
            value += '\0';
        }
        const buffer = new Buffer(value, encoding);
        this._stream.write(buffer, 0, buffer.length);
        return this;
    }
}
