// Currently only works for ASCII strings.
export function fnv0(value: string, init: number, prime: number): number {
    for (const char of value) {
        init ^= char.charCodeAt(0);
        init = Math.imul(init, prime);
    }
    return init >>> 0;
}