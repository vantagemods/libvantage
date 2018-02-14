define(["require", "exports", "./cipher"], function (require, exports, cipher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function tripleDesCBCdecrypt(data, key, iv, autopadding) {
        return cipher_1.decrypt("des-ede3-cbc", data, key, iv || Buffer.alloc(8), autopadding);
    }
    exports.tripleDesCBCdecrypt = tripleDesCBCdecrypt;
    function tripleDesCBCEncrypt(data, key, iv, autopadding) {
        return cipher_1.encrypt("des-ede3-cbc", data, key, iv || Buffer.alloc(8), autopadding);
        ;
    }
    exports.tripleDesCBCEncrypt = tripleDesCBCEncrypt;
});
