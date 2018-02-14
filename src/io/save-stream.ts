import {BinaryStream} from '../io/binary-stream'

export interface ISaveStream  {
    getSaveData(): Buffer;
}
export abstract class SaveStream extends BinaryStream implements ISaveStream {
    abstract getSaveData(): Buffer;
}