import { ICryptoTransform } from './cipher';
import { MemoryStream } from '../io/memory-stream';
import { Stream, SeekOrigin } from '../io/stream';

export enum CryptoStreamMode {
    Read = 0,
    Write = 1,
}

export class CryptoStream implements Stream {
    private _memory: MemoryStream|null;

    constructor(private _stream: Stream, private _transform: ICryptoTransform,  private _mode: CryptoStreamMode) {
        if(_mode == CryptoStreamMode.Write) {
            this._memory = MemoryStream.alloc(0x1000);
        }
    }

    public write(buffer: Buffer, index: number, length: number): number {
        if(this._mode == CryptoStreamMode.Read) {
            throw new Error('Invalid stream mode');
        }
        if (this._memory === null) {
            throw new Error('Stream disposed.');
        }
        const output = Buffer.alloc(length);
        const copied = this._transform.transformBlock(buffer, index, length, output);
        return this._memory.write(output, 0, copied);
    }

    public read(buffer: Buffer, index: number, length: number): number {
        if(this._mode == CryptoStreamMode.Write) {
            throw new Error('Invalid stream mode');
        }
        const data = Buffer.alloc(length);
        const readLength = this._stream.read(data, 0, length);
        const output = Buffer.alloc(readLength);
        
        const copied = this._transform.transformBlock(data, 0, readLength, output);
        let remainder = readLength - copied;        
        if(remainder > 0) {
            const final = this._transform.transformFinalBlock();
            remainder = final.copy(output, copied, 0, remainder);
        }
        return output.copy(buffer, index, 0, copied + remainder);
    }

    public dispose(): void {
        if (this._memory === null) {
            throw new Error('Stream disposed.');
        }
        if(this._mode == CryptoStreamMode.Write) {
            const streamData = this._memory.getBuffer();
            this._stream.write(streamData, 0, streamData.length);

            const buffer = this._transform.transformFinalBlock();
            if(buffer.length > 0) {
                this._stream.write(buffer, 0, buffer.length);
            }
        }
        this._memory = null;
    }

    public close(): void {
        this.dispose();
    }

    public get eof(): boolean {
        throw new Error("Method not supported.");
    }

    public get length(): number {
        return this._stream.length;
    }

    public get position(): number {
        return this._stream.position;
    }

    public set position(offset: number) {
        this._stream.position = 0;
    }

    public seek(offset: number, origin: SeekOrigin): number {
        return this._stream.seek(offset, origin);
    }

    public readByte(): number {
        return this._stream.readByte();
    }
}