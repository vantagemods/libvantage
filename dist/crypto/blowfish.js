define(["require", "exports", "./cipher"], function (require, exports, cipher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function blowfishCbcDecrypt(data, key, iv, autopadding) {
        return cipher_1.decrypt('bf-cbc', data, key, iv || Buffer.alloc(8), autopadding);
    }
    exports.blowfishCbcDecrypt = blowfishCbcDecrypt;
    function blowfishCbcEncrypt(data, key, iv, autopadding) {
        return cipher_1.encrypt('bf-cbc', data, key, iv || Buffer.alloc(8), autopadding);
    }
    exports.blowfishCbcEncrypt = blowfishCbcEncrypt;
    function blowfishEcbDecrypt(data, key, iv, autopadding) {
        return cipher_1.decrypt('bf-ecb', data, key, iv, autopadding);
    }
    exports.blowfishEcbDecrypt = blowfishEcbDecrypt;
    function blowfishEcbEncrypt(data, key, iv, autopadding) {
        return cipher_1.encrypt('bf-ecb', data, key, iv, autopadding);
    }
    exports.blowfishEcbEncrypt = blowfishEcbEncrypt;
});
