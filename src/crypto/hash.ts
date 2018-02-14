import * as crypto from 'crypto';

export function sha256(data: string|Buffer) : Buffer {
    return crypto.createHash('sha256').update(data).digest();
}
export function sha1(data: string|Buffer) : Buffer {
    return crypto.createHash('sha1').update(data).digest();
}