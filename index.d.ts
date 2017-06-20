import { FrameworkConfiguration } from 'aurelia-framework';
import { BigInteger } from "big-integer";

export interface SaveEditor {
    load(buffer: Buffer): Promise<void>|void;
    save(): Promise<Buffer>|Buffer;
}

// Bootstrap
export function openDevTools(): void;
export function setEditor(editor: SaveEditor): void;
export function configure(config: FrameworkConfiguration): void;

// Crypto
export function adler32(buffer: Buffer, initial?: number): number;
export function fnv0(value: string, init: number, prime: number): number;
export function crc32(buffer: Buffer, offset?: number, length?: number, seed?: number): number;

export type SeekOrigin = 'begin'|'end'|'current';

export class Stream {
    constructor(buffer: Buffer);

    static alloc(size: number): Stream;
    static reserve(size: number): Stream;

    getBuffer(): Buffer;
    dispose(): void;

    eof: boolean;
    length: number;
    position: number;
    seek(offset: number, origin?: SeekOrigin): Stream;
    skip(offset: number): Stream;
    resize(size: number): Stream;

    readBytes(length: number): Buffer;
    readToEnd(): Buffer;
    readByte(): number;
    readBoolean(): boolean;
    readUInt16(): number;
    readInt16(): number;
    readUInt32(): number;
    readInt32(): number;
    readInt64(): BigInteger;
    readUInt64(): BigInteger;
    readInt64Unsafe(): number;
    readUInt64Unsafe(): number;
    readFloat(): number;
    readDouble(): number;
    loopByte<T>(callback: (io: Stream) => T): T[];
    loopUInt16<T>(callback: (io: Stream) => T): T[];
    loopUInt32<T>(callback: (io: Stream) => T): T[];
    readString(encoding: BufferEncoding, chars?: number): string;

    writeBytes(value: Buffer): Stream;
    writeByte(value: number): Stream;
    writeBoolean(flag: boolean): Stream;
    writeUInt16(value: number): Stream;
    writeInt16(value: number): Stream;
    writeUInt32(value: number): Stream;
    writeInt32(value: number): Stream;
    writeUInt64(value: BigInteger|number): Stream;
    writeInt64(value: BigInteger|number): Stream;
    writeFloat(value: number): Stream;
    writeDouble(value: number): Stream;
    writeString(value: string, encoding?: BufferEncoding, nullTerminate?: boolean): Stream;
}