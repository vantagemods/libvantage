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

// Compression
export interface DeflateOptions {
    flush?: number; // default: zlib.constants.Z_NO_FLUSH
    finishFlush?: number; // default: zlib.constants.Z_FINISH
    chunkSize?: number; // default: 16*1024
    windowBits?: number;
    level?: number; // compression only
    memLevel?: number; // compression only
    strategy?: number; // compression only
    dictionary?: any; // deflate/inflate only, empty dictionary by default
}
export type ITransformStream = NodeJS.ReadableStream & NodeJS.WritableStream;


export function zlibDecompress(buffer: Buffer, options?: DeflateOptions): Buffer;
export function zlibCompress(buffer: Buffer, options?: DeflateOptions): Buffer;
export function zlibDecompressRaw(buffer: Buffer, options?: DeflateOptions): Buffer;
export function zlibCompressRaw(buffer: Buffer, options?: DeflateOptions): Buffer;
export function zlibCreateDeflate(options?: DeflateOptions): ITransformStream;
export function zlibCreateInflate(options?: DeflateOptions): ITransformStream;
export function deflate(buffer: Buffer, mode: CompressionMode, options?: DeflateOptions): Buffer;

// Crypto
export enum CryptoStreamMode {
    Read = 0,
    Write = 1,
}
export enum AesMode {
    ECB = 'ECB',
    CBC = 'CBC',
    CTR = 'CTR',
    CFB = 'CFB',
    OFB = 'OFB',
    GMC = 'GCM',    
}
export enum CipherType {
    TripleDES = 'des-ede3-cbc',
}
export interface AesGcmResult {
    data: Buffer;
    tag: Buffer;
}
export interface ICryptoTransform {
    canTransformMultipleBlocks: boolean;
    canReuseTransform: boolean;

    transformBlock(input: Buffer, inputOffset: number, inputCount: number, output: Buffer, outputOffest?: number): number;
    transformFinalBlock(): Buffer;
}
export interface ICipherTransform {
    update(data: Buffer): Buffer;
    final(): Buffer;
    final(output_encoding: string): string;
    setAutoPadding(auto_padding?: boolean): void;
    setAAD(buffer: Buffer): void;
    
    getAuthTag?(): Buffer;
    setAuthTag?(tag: Buffer): void;    
}

export function adler32(buffer: Buffer, initial?: number): number;
export function fnv0(value: string, init: number, prime: number): number;
export function crc32(buffer: Buffer, offset?: number, length?: number, seed?: number): number;

export function aesCBCdecrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;
export function aesCBCencrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer ;

export function aesGCMdecrypt(buffer: Buffer, tag: Buffer, key: string|Buffer, iv?: Buffer, autopadding?: boolean): Buffer;
export function aesGCMencrypt(buffer: Buffer, key: string|Buffer, iv?: Buffer, autopadding?: boolean): AesGcmResult;

export function tripleDesCBCdecrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;
export function tripleDesCBCEncrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;

export function blowfishCbcDecrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;
export function blowfishCbcEncrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;
export function encrypt(algorithm: string, buffer: Buffer, key: Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;
export function decrypt(algorithm: string, buffer: Buffer, key: Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer;

export function getRandom(size: number): Buffer;
export function sha256(data: string|Buffer) : Buffer;
export function sha1(data: string|Buffer) : Buffer;

export function verifyRsa1Signature(signature: Buffer, data: Buffer, publicKey: string) : boolean;
export function privateKeySign(data: Buffer, privateKey: string) : Buffer;

export class CryptoStream implements Stream {
    constructor(stream: Stream, transform: ICryptoTransform,  mode: CryptoStreamMode);

    readonly eof: boolean;
    readonly length: number;
    position: number;

    write(buffer: Buffer, index: number, length: number): number;
    read(buffer: Buffer, index: number, length: number): number;
    dispose(): void;
    close(): void;
    seek(offset: number, origin: SeekOrigin): number;
    readByte(): number;
}

export class CryptoTransform implements ICryptoTransform {
    canTransformMultipleBlocks: boolean;
    canReuseTransform: boolean;
    constructor(transform: ICipherTransform);
    transformBlock(input: Buffer, inputOffset: number, inputCount: number, output: Buffer, outputOffest?: number): number;
    transformFinalBlock(): Buffer;
}
export class CipherFactory {
    static createEncryptor(algorithm: string, key: string|Buffer, iv?: string|Buffer, autoPadding?: boolean) : ICryptoTransform;
    static createDecryptor(algorithm: string, key: string|Buffer, iv?: string|Buffer, autoPadding?: boolean) : ICryptoTransform;
}
export class AesCryptoTransform implements ICryptoTransform {
    canTransformMultipleBlocks: boolean;
    canReuseTransform: boolean;
    constructor(transform: ICipherTransform);
    transformBlock(input: Buffer, inputOffset: number, inputCount: number, output: Buffer, outputOffest?: number): number;
    transformFinalBlock(): Buffer;
}
export class Aes {
    static createEncryptor(mode: AesMode, key: string|Buffer, iv?: string|Buffer, autoPadding?: boolean) : ICryptoTransform;
    static createDecryptor(mode: AesMode, key: string|Buffer, iv?: string|Buffer, autoPadding?: boolean, auth?: Buffer) : ICryptoTransform;
}

// Stream
export enum SeekOrigin {
    Begin = 'begin',
    End = 'end',
    Current = 'current',
}
export interface Stream {
    readonly eof: boolean;
    readonly length: number;
    position: number;
    seek(offset: number, origin: SeekOrigin): number;
    readByte(): number;
    read(buffer: Buffer, index: number, length: number): number;
    write(buffer: Buffer, index: number, length: number): number;
    close(): void;
    dispose(): void;
}

export enum CompressionMode {
    Decompress = 0,
    Compress = 1,
    DecompressRaw = 2,
    CompressRaw = 3,
}
export class DeflateStream implements Stream {
    constructor(stream: Stream, mode: CompressionMode, options?: DeflateOptions);

    readonly eof: boolean;
    readonly length: number;
    position: number;

    write(buffer: Buffer, index: number, length: number): number;
    read(buffer: Buffer, index: number, length: number): number;
    dispose(): void;
    close(): void;
    seek(offset: number, origin: SeekOrigin): number;
    readByte(): number;
    copyTo(stream: Stream): void;    
}

export abstract class AbstractStream implements Stream {
    abstract readonly length: number;
    abstract position: number;
    abstract readByte(): number;
    abstract read(buffer: Buffer, index: number, length: number): number;
    abstract write(buffer: Buffer, index: number, length: number): number;

    readonly eof: boolean;
    seek(offset: number, origin?: SeekOrigin): number;
    close(): void;
    dispose(): void;
}
export class MemoryStream extends AbstractStream {
    constructor(buffer?: Buffer);
    static alloc(size: number): MemoryStream;
    static reserve(size: number): MemoryStream;
    readonly length: number;
    position: number;
    resize(size: number): Stream;
    readByte(): number;
    read(buffer: Buffer, index: number, length: number): number;
    write(buffer: Buffer, index: number, length: number): number;
    getBuffer(): Buffer;
    close(): void;
    dispose(): void;
}

export class StreamWriter {
    constructor(_baseStream: Stream);
    write(buffer: Buffer): void;
}
export class StreamReader {
    constructor(_baseStream: Stream);
    readToEnd(): Buffer;
}

export enum Endianness {
    Little = 'le',
    Big = 'be',
}
export class BinaryStream {
    constructor(stream: Stream, endianness?: Endianness);
    readonly baseStream: Stream;
    endianness: Endianness;
    skip(offset: number): BinaryStream;
    dispose(): void;
    getBuffer(): Buffer;

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
    readSignedBigInteger(size: number): BigInteger;
    readUnsignedBigInteger(size: number): BigInteger;
    readFloat(): number;
    readDouble(): number;
    readString(encoding: BufferEncoding, bytes?: number): string;

    loopByte<T>(callback: (io: BinaryStream) => T): T[];
    loopUInt16<T>(callback: (io: BinaryStream) => T): T[];
    loopUInt32<T>(callback: (io: BinaryStream) => T): T[];
    loopUInt64<T>(callback: (io: BinaryStream) => T): T[];

    writeBytes(value: Buffer): BinaryStream;
    writeByte(value: number): BinaryStream;
    writeBoolean(flag: boolean): BinaryStream;
    writeUInt16(value: number): BinaryStream;
    writeInt16(value: number): BinaryStream;
    writeUInt32(value: number): BinaryStream;
    writeInt32(value: number): BinaryStream;
    writeUInt64(value: BigInteger|number): BinaryStream;
    writeInt64(value: BigInteger|number): BinaryStream;
    writeBigInteger(value: BigInteger, byteLength?: number): BinaryStream;
    writeFloat(value: number): BinaryStream;
    writeDouble(value: number): BinaryStream;
    writeString(value: string, encoding?: BufferEncoding, nullTerminate?: boolean): BinaryStream;
}

// save streams
export interface ISaveStream  {
    getSaveData(): Buffer;
}
export abstract class SaveStream extends BinaryStream implements ISaveStream  {
    abstract getSaveData(): Buffer;
}

// v-selection
export interface SelectInputOption {
	label: string;
	value: any;
}
// v-tree
export interface Tree {
    readonly nodes: TreeNode[];
    findNodeByPath(path: string|string[]): TreeNode|null;
    findNodeById(id: string): TreeNode|null;
    findNode(predicate: (node: TreeNode) => boolean): TreeNode|null;
    filterNodes(predicate: (node: TreeNode) => boolean): TreeNode[];
}
export interface TreeNode {
    id?: string;
    name: string;
    component?: TreeComponent;
    nodes?: TreeNode[];
}
export interface TreeComponent {
    type: 'number'|'text'|'selection'|'switch'|'slider'|'button';
}
export interface TreeTextComponent extends TreeComponent {
    type: 'text';
    value: string;
}
export interface TreeSwitchComponent extends TreeComponent {
    type: 'switch';
    value: boolean;
}
export interface TreeButtonComponent extends TreeComponent {
    type: 'switch';
    label: string;
    callback(): any;
    disabled?: boolean;
}
export interface TreeSelectionComponent extends TreeComponent {
    type: 'selection';
    value: SelectInputOption;
    options: SelectInputOption[];
}
export interface TreeNumberComponent extends TreeComponent {
    type: 'number';
    value: number;
    min: number;
    max: number;
    step: number;
    placeholder?: string;
}
export interface TreeSliderComponent extends TreeComponent {
    type: 'slider';
    value: number;
    min: number;
    max: number;
    step: number;
}
