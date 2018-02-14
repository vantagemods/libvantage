import * as crypto from 'crypto';


export function createCipher(algorithm: string, key: string|Buffer, iv?: string|Buffer, autopadding = false): crypto.Cipher {
    const cipher = iv ? crypto.createCipheriv(algorithm, key, iv) : crypto.createCipher(algorithm, key);
    cipher.setAutoPadding(autopadding);
    return cipher;
}
export function createDecipher(algorithm: string, key: string|Buffer, iv?: string|Buffer, autopadding = false): crypto.Decipher {
    const decipher = iv ? crypto.createDecipheriv(algorithm, key, iv) : crypto.createDecipher(algorithm, key);
    decipher.setAutoPadding(autopadding);
    return decipher;
}   
export function encrypt(algorithm: string, buffer: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    const cipher = createCipher(algorithm, key, iv, autopadding);
    return Buffer.concat([cipher.update(buffer), cipher.final()]);
}       
export function decrypt(algorithm: string, buffer: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    const decipher = createDecipher(algorithm, key, iv, autopadding);
    return Buffer.concat([decipher.update(buffer), decipher.final()]);
}
export function getRandom(size: number): Buffer {
    return crypto.randomBytes(size);
}

export interface ICryptoTransform {
    canTransformMultipleBlocks: boolean;
    canReuseTransform: boolean;
    transformBlock(input: Buffer, inputOffset: number, inputCount: number, output: Buffer, outputOffest?: number): number;
    transformFinalBlock(): Buffer;
}
export interface ICipherTransform {
    update(data: Buffer): Buffer;
    final(): Buffer;
    final(output_encoding: string): string;
    setAutoPadding(auto_padding?: boolean): void;
    setAAD(buffer: Buffer): void;

    getAuthTag?(): Buffer;
    setAuthTag?(tag: Buffer): void;    
}
export enum CipherType {
    TripleDES = 'des-ede3-cbc',
    BlowfishCBC = 'bf-cbc',
    BlowfishECB = 'bf-ebc',
}
export class CipherFactory {

    static createEncryptor(algorithm: string|CipherType, key: string|Buffer, iv?: string|Buffer, autoPadding = true) : ICryptoTransform {
        return new CryptoTransform(createCipher(algorithm, key, iv, autoPadding));
    }
    static createDecryptor(algorithm: string, key: string|Buffer, iv?: string|Buffer, autoPadding = true) : ICryptoTransform {
        return new CryptoTransform(createDecipher(algorithm, key, iv, autoPadding));
    }
}
export class CryptoTransform implements ICryptoTransform {
    canTransformMultipleBlocks: boolean;
    canReuseTransform: boolean;

    constructor(private transform: ICipherTransform) {
    }

    transformBlock(input: Buffer, inputOffset: number, inputCount: number, output: Buffer, outputOffest?: number): number {
        const tempOutput = this.transform.update(input.slice(inputOffset, inputOffset + inputCount));
        return tempOutput.copy(output, outputOffest || 0);
    }
    transformFinalBlock(): Buffer {
        return this.transform.final();
    }
}
