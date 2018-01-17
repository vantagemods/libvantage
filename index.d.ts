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

// Crypto
export function adler32(buffer: Buffer, initial?: number): number;
export function fnv0(value: string, init: number, prime: number): number;
export function crc32(buffer: Buffer, offset?: number, length?: number, seed?: number): number;

// Stream
export class Stream {
    constructor(buffer: Buffer, endianness?: Endianness);

    static alloc(size: number, endianness?: Endianness): Stream;
    static reserve(size: number, endianness?: Endianness): Stream;

    getBuffer(): Buffer;
    dispose(): void;

    eof: boolean;
    length: number;
    position: number;
    endianness: Endianness;
    seek(offset: number, origin?: SeekOrigin): Stream;
    skip(offset: number): Stream;
    resize(size: number): Stream;

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
    readSignedBigInteger(size: number): BigInteger
    readUnsignedBigInteger(size: number): BigInteger;
    readFloat(): number;
    readDouble(): number;
    loopByte<T>(callback: (io: Stream) => T): T[];
    loopUInt16<T>(callback: (io: Stream) => T): T[];
    loopUInt32<T>(callback: (io: Stream) => T): T[];
    loopUInt64<T>(callback: (io: Stream) => T): T[];
    readString(encoding: BufferEncoding, chars?: number): string;

    writeBytes(value: Buffer): Stream;
    writeByte(value: number): Stream;
    writeBoolean(flag: boolean): Stream;
    writeUInt16(value: number): Stream;
    writeInt16(value: number): Stream;
    writeUInt32(value: number): Stream;
    writeInt32(value: number): Stream;
    writeUInt64(value: BigInteger|number): Stream;
    writeInt64(value: BigInteger|number): Stream;
    writeBigInteger(value: BigInteger, byteLength?: number): Stream 
    writeFloat(value: number): Stream;
    writeDouble(value: number): Stream;
    writeString(value: string, encoding?: BufferEncoding, nullTerminate?: boolean): Stream;
}
export enum Endianness {
    Little = 'le',
    Big = 'be',
}
export enum SeekOrigin {
    Begin = 'begin',
    End = 'end',
    Current = 'current',
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
