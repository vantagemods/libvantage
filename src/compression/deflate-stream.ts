import { MemoryStream } from '../io/memory-stream';
import { Stream, SeekOrigin } from '../io/stream';
import { deflate, createDeflate, CompressionMode, DeflateOptions, ITransformStream} from '../compression/zlib';

export class DeflateStream implements Stream {
    private _memory: MemoryStream|null;
    private _transform: ITransformStream|null;
    
    constructor(private _stream: Stream, private _mode: CompressionMode, private _options?: DeflateOptions) {
        if(_mode == CompressionMode.Compress || _mode == CompressionMode.CompressRaw) {    
            this._memory = MemoryStream.reserve(8192); // only needed for compressing
        }
        this._transform = createDeflate(_mode, _options); 
    }
    public write(buffer: Buffer, index: number, length: number): number {
        if(this._mode == CompressionMode.Decompress) {
            throw new Error('invalid stream mode');
        }
        if (this._memory === null) {
            throw new Error('Stream disposed.');
        }
        if (this._transform === null) {
            throw new Error('Invalid transform handle.');
        }
        throw new Error("not implemented");
    }

    public read(buffer: Buffer, index: number, length: number): number {
        if(this._mode == CompressionMode.Compress) {
            throw new Error('invalid stream mode');
        }
        throw new Error("not implemented");
    }

    public copyTo(stream: Stream) : void {
        const input = Buffer.alloc(this._stream.length);
        this.position = 0;
        this._stream.read(input, 0, input.length);
        const buffer = deflate(input, this._mode, this._options);
        if(buffer) {
            stream.write(buffer, 0, buffer.length);
        }
    }

    public dispose(): void {
        if (this._memory === null) {
            throw new Error('Stream disposed.');
        }
        if(this._mode == CompressionMode.Compress) {
            const streamData = this._memory.getBuffer();
            this._stream.write(streamData, 0, streamData.length);
        }
        if(this._memory) {
            if((this._memory as MemoryStream).length != 0 && this._transform) {              
                this._transform.end();
            }
            this._memory = null;
        }
        this._transform = null;
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
