import { AbstractStream } from './abstract-stream';
import { Stream } from './stream';

export class MemoryStream extends AbstractStream {
    private _position = 0;
    private _length: number;
    private _buffer: Buffer;

    constructor(buffer?: Buffer) {
        super();
        this._buffer = buffer || Buffer.alloc(0x10);
        this._length = this._buffer.length;
    }

    public static alloc(size: number): MemoryStream {
        return new MemoryStream(Buffer.alloc(size));
    }

    public static reserve(size: number): MemoryStream {
        const stream = MemoryStream.alloc(size);
        stream._length = 0;
        return stream;
    }

    public getBuffer(): Buffer {
        return this._buffer.slice(0, this.length);
    }

    public dispose(): void {
        this._buffer = <any>null;
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

    public readByte(): number {
        return this._buffer[this.position++];
    }

    public read(buffer: Buffer, index: number, length: number): number {
        this.position += length;
        return this._buffer.copy(buffer, index, this.position - length, this.position);
    }

    public write(buffer: Buffer, index: number, length: number): number {
        this.expand(length);
        const written = buffer.copy(this._buffer, this.position, index, length);
        this.position += written;
        return written;
    }
}
