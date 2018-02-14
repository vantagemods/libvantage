define(["require", "exports", "crypto"], function (require, exports, crypto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function verifyRsa1Signature(signature, data, publicKey) {
        var verify = crypto.createVerify('RSA-SHA1');
        verify.update(data);
        return verify.verify(publicKey, signature);
    }
    exports.verifyRsa1Signature = verifyRsa1Signature;
    function privateKeySign(data, privateKey) {
        var sign = crypto.createSign('RSA-SHA1');
        sign.update(data);
        return sign.sign(privateKey);
    }
    exports.privateKeySign = privateKeySign;
});
