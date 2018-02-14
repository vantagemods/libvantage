define(["require", "exports", "./cipher"], function (require, exports, cipher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AesMode;
    (function (AesMode) {
        AesMode["ECB"] = "ecb";
        AesMode["CBC"] = "cbc";
        AesMode["CTR"] = "ctr";
        AesMode["CFB"] = "cfb";
        AesMode["OFB"] = "ofb";
        AesMode["GMC"] = "gcm";
    })(AesMode = exports.AesMode || (exports.AesMode = {}));
    function getAesAlgorithmName(mode, keyLength) {
        return "aes-" + keyLength * 8 + "-" + mode;
    }
    function aesCBCdecrypt(data, key, iv, autopadding) {
        return cipher_1.decrypt(getAesAlgorithmName(AesMode.CBC, key.length), data, key, iv || Buffer.alloc(0x10), autopadding);
    }
    exports.aesCBCdecrypt = aesCBCdecrypt;
    function aesCBCencrypt(data, key, iv, autopadding) {
        return cipher_1.encrypt(getAesAlgorithmName(AesMode.CBC, key.length), data, key, iv || Buffer.alloc(0x10), autopadding);
    }
    exports.aesCBCencrypt = aesCBCencrypt;
    function aesGCMdecrypt(buffer, tag, key, iv, autoPadding) {
        var decipher = cipher_1.createDecipher(getAesAlgorithmName(AesMode.GMC, key.length), key, iv, autoPadding);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(buffer), decipher.final()]);
    }
    exports.aesGCMdecrypt = aesGCMdecrypt;
    function aesGCMencrypt(buffer, key, iv, autoPadding) {
        var cipher = cipher_1.createCipher(getAesAlgorithmName(AesMode.GMC, key.length), key, iv, autoPadding);
        return {
            data: Buffer.concat([cipher.update(buffer), cipher.final()]),
            tag: cipher.getAuthTag()
        };
    }
    exports.aesGCMencrypt = aesGCMencrypt;
    var Aes = /** @class */ (function () {
        function Aes() {
        }
        Aes.createEncryptor = function (mode, key, iv, autoPadding) {
            if (autoPadding === void 0) { autoPadding = true; }
            var cipher = cipher_1.createCipher(getAesAlgorithmName(mode, key.length), key, iv, autoPadding);
            return new AesCryptoTransform(cipher, mode == AesMode.GMC);
        };
        Aes.createDecryptor = function (mode, key, iv, autoPadding, auth) {
            if (autoPadding === void 0) { autoPadding = true; }
            var decipher = cipher_1.createDecipher(getAesAlgorithmName(mode, key.length), key, iv, autoPadding);
            if (mode == AesMode.GMC && auth != null) {
                decipher.setAuthTag(auth);
            }
            else {
                throw new Error("invalid auth tag");
            }
            return new AesCryptoTransform(decipher, mode == AesMode.GMC);
        };
        return Aes;
    }());
    exports.Aes = Aes;
    var AesCryptoTransform = /** @class */ (function () {
        function AesCryptoTransform(transform, auth) {
            if (auth === void 0) { auth = true; }
            this.transform = transform;
            this.auth = auth;
        }
        AesCryptoTransform.prototype.transformBlock = function (input, inputOffset, inputCount, output, outputOffest) {
            var tempOutput = this.transform.update(input.slice(inputOffset, inputOffset + inputCount));
            return tempOutput.copy(output, outputOffest || 0);
        };
        AesCryptoTransform.prototype.transformFinalBlock = function () {
            if (this.auth && this.transform.getAuthTag) {
                // add gcm tag to end of buffer
                return Buffer.concat([this.transform.final(), this.transform.getAuthTag()]);
            }
            return this.transform.final();
        };
        return AesCryptoTransform;
    }());
    exports.AesCryptoTransform = AesCryptoTransform;
});
