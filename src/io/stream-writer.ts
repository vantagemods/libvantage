import { Stream } from './stream';

export class StreamWriter {

    constructor(private _baseStream: Stream) {
    }

    public write(buffer: Buffer): void {
        this._baseStream.write(buffer, 0, buffer.length);
    }
}