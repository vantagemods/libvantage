import { decrypt, encrypt} from './cipher';


export function tripleDesCBCdecrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    return decrypt(`des-ede3-cbc`, data, key, iv || Buffer.alloc(8), autopadding);
}
export function tripleDesCBCEncrypt(data: Buffer, key: string|Buffer, iv?: string|Buffer, autopadding?: boolean): Buffer {
    return encrypt(`des-ede3-cbc`, data, key, iv || Buffer.alloc(8), autopadding);;
}