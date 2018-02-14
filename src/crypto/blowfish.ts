import { decrypt, encrypt} from './cipher';


export function blowfishCbcDecrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    return decrypt('bf-cbc', data, key, iv || Buffer.alloc(8), autopadding);
}
export function blowfishCbcEncrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    return encrypt('bf-cbc', data, key, iv || Buffer.alloc(8), autopadding);
}
export function blowfishEcbDecrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    return decrypt('bf-ecb', data, key, iv, autopadding);
}
export function blowfishEcbEncrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    return encrypt('bf-ecb', data, key, iv, autopadding);
}