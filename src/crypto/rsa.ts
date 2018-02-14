import * as crypto from 'crypto';

export function verifyRsa1Signature(signature: Buffer, data: Buffer, publicKey: string): boolean {
    const verify = crypto.createVerify('RSA-SHA1');
    verify.update(data);    
    return verify.verify(publicKey, signature);
}

export function privateKeySign(data: Buffer, privateKey: string): Buffer {
    const sign = crypto.createSign('RSA-SHA1');
    sign.update(data);
    return sign.sign(privateKey);
}