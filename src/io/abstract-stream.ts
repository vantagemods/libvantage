import { Stream, SeekOrigin } from './stream';

export abstract class AbstractStream implements Stream {
    public abstract readonly length: number;
    public abstract position: number;
    public abstract readByte(): number;
    public abstract read(buffer: Buffer, index: number, length: number): number;
    public abstract write(buffer: Buffer, index: number, length: number): number;

    public get eof(): boolean {
        return this.position >= this.length;
    }

    public seek(offset: number, origin: SeekOrigin = SeekOrigin.Begin): number {
        switch (origin) {
            case SeekOrigin.Begin:
                this.position = offset;
                break;
            case SeekOrigin.End:
                this.position = this.length - offset;
                break;
            case SeekOrigin.Current:
                this.position += offset;
                break;
        }
        return this.position;
    }

    public close(): void {
        this.dispose();
    }

    public dispose(): void {

    }
}
