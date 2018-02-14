import { decrypt, encrypt, ICipherTransform, ICryptoTransform, createCipher, createDecipher} from './cipher';

export interface AesGcmResult {
    data: Buffer;
    tag: Buffer;
}
export enum AesMode {
    ECB = 'ecb',
    CBC = 'cbc',
    CTR = 'ctr',
    CFB = 'cfb',
    OFB = 'ofb',
    GMC = 'gcm',    
}
function getAesAlgorithmName(mode: AesMode|string, keyLength: number):string {
    return `aes-${keyLength * 8}-${mode}`;
}
export function aesCBCdecrypt(data: Buffer, key: string|Buffer, iv?: Buffer, autopadding?: boolean): Buffer {
    return decrypt(getAesAlgorithmName(AesMode.CBC, key.length), data, key, iv || Buffer.alloc(0x10), autopadding);
}
export function aesCBCencrypt(data: Buffer, key: string|Buffer, iv?: Buffer, autopadding?: boolean): Buffer {
    return encrypt(getAesAlgorithmName(AesMode.CBC, key.length), data, key, iv || Buffer.alloc(0x10), autopadding);
}
export function aesGCMdecrypt(buffer: Buffer, tag: Buffer, key: string|Buffer, iv?: Buffer, autoPadding?: boolean): Buffer {
    const decipher = createDecipher(getAesAlgorithmName(AesMode.GMC, key.length), key, iv, autoPadding); 
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(buffer) , decipher.final()]);     
}
export function aesGCMencrypt(buffer: Buffer, key: string|Buffer, iv?: Buffer, autoPadding?: boolean): AesGcmResult {
    const cipher = createCipher(getAesAlgorithmName(AesMode.GMC, key.length), key, iv, autoPadding);
    return  {
        data: Buffer.concat([cipher.update(buffer) , cipher.final()]),
        tag: cipher.getAuthTag()
    } 
}

export class Aes {
    static createEncryptor(mode: AesMode|string, key: string|Buffer, iv?: string|Buffer, autoPadding = true) : ICryptoTransform {
        const cipher = createCipher(getAesAlgorithmName(mode, key.length), key, iv, autoPadding);
        return new AesCryptoTransform(cipher, mode == AesMode.GMC);
    }
    static createDecryptor(mode: AesMode|string, key: string|Buffer, iv?: string|Buffer, autoPadding = true, auth?: Buffer) : ICryptoTransform {
        const decipher = createDecipher(getAesAlgorithmName(mode, key.length), key, iv, autoPadding);
        if(mode == AesMode.GMC && auth != null) {
            decipher.setAuthTag(auth);
        }
        else {
            throw new Error("invalid auth tag");
        }
        return new AesCryptoTransform(decipher, mode == AesMode.GMC);
    } 
}
export class AesCryptoTransform implements ICryptoTransform {
    canTransformMultipleBlocks: boolean;

    canReuseTransform: boolean;

    constructor(private transform: ICipherTransform, private auth: boolean = true) {
    }

    transformBlock(input: Buffer, inputOffset: number, inputCount: number, output: Buffer, outputOffest?: number): number {
        const tempOutput = this.transform.update(input.slice(inputOffset, inputOffset + inputCount));
        return tempOutput.copy(output, outputOffest || 0);
    }
    transformFinalBlock(): Buffer {
        if(this.auth && this.transform.getAuthTag) {
            // add gcm tag to end of buffer
            return Buffer.concat([this.transform.final(), this.transform.getAuthTag()]);
        }
        return this.transform.final();
    }
}