import * as CRC32 from 'crc-32';

export function crc32(buffer: Buffer, offset: number = 0, length: number = -1, seed?: number): number {
    if (offset !== 0 || length === -1) {
        if (length === -1) {
            length = buffer.length - offset;
        }
        buffer = buffer.slice(offset, offset + length);
    }
    return new Uint32Array([CRC32.buf(buffer, seed)])[0]
}