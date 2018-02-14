import { Stream } from './stream';
export class StreamReader {

    constructor(private _baseStream: Stream) {
    }

    public readToEnd(): Buffer {
        const length = this._baseStream.length;
        const buffer = Buffer.alloc(length);
        const readBytes = this._baseStream.read(buffer, 0, length);
        return buffer.slice(0, readBytes);
    }
}