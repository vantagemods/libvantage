export function adler32(buffer: Buffer, initial: number = 1): number {
    let a = initial & 0xFFFF;
    let b = (initial >>> 16) & 0xFFFF;
    let x = 0;
    let len = buffer.length;
    while (len > 0) {
        let n = Math.min(len, 3800);
        len -= n;
        while (--n >= 0) {
            a += buffer[x++] & 0xFF;
            b += a;
        }
        a %= 65521;
        b %= 65521;
    }
    return ((b << 16) | a) >>> 0;
}