import * as zlib from 'zlib';

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
export enum CompressionMode {
    Decompress = 0,
    Compress = 1,
    DecompressRaw = 2,
    CompressRaw = 3,
}
export type ITransformStream = NodeJS.ReadableStream & NodeJS.WritableStream;

export function zlibDecompress(buffer: Buffer, options?: DeflateOptions): Buffer {
    return zlib.inflateSync(buffer, options);
}
export function zlibCompress(buffer: Buffer, options?: DeflateOptions): Buffer {
    return zlib.deflateSync(buffer, options);
}
export function zlibDecompressRaw(buffer: Buffer, options?: DeflateOptions): Buffer {
    return zlib.inflateRawSync(buffer, options);
}
export function zlibCompressRaw(buffer: Buffer, options?: DeflateOptions): Buffer {
    return zlib.deflateRawSync(buffer, options);
}
export function zlibCreateDeflate(options?: DeflateOptions): ITransformStream {
    return zlib.createDeflate(options);
}
export function zlibCreateInflate(options?: DeflateOptions): ITransformStream {
    return zlib.createInflate(options);
}
export function zlibCreateDeflateRaw(options?: DeflateOptions): ITransformStream {
    return zlib.createDeflateRaw(options);
}
export function zlibCreateInflateRaw(options?: DeflateOptions): ITransformStream {
    return zlib.createInflateRaw(options);
}
export function createDeflate(mode: CompressionMode, options?: DeflateOptions): ITransformStream {
    switch(mode) {
        case CompressionMode.Compress:
            return zlibCreateDeflate(options);
        case CompressionMode.CompressRaw:
            return zlibCreateDeflateRaw(options);
        case CompressionMode.Decompress:
            return zlibCreateInflate(options);
        case CompressionMode.DecompressRaw:
            return zlibCreateInflateRaw(options);                           
    }
    throw Error("undefined deflate type");
}
export function deflate(buffer: Buffer, mode: CompressionMode, options?: DeflateOptions): Buffer {
    switch(mode) {
        case CompressionMode.Compress:
            return zlibCompress(buffer, options);
        case CompressionMode.CompressRaw:
            return zlibCompressRaw(buffer, options);
        case CompressionMode.Decompress:
            return zlibDecompress(buffer, options);
        case CompressionMode.DecompressRaw:
            return zlibDecompressRaw(buffer, options);                                
    }
    throw Error("undefined deflate type");
}