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
