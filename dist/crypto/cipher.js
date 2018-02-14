define(["require", "exports", "crypto"], function (require, exports, crypto) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createCipher(algorithm, key, iv, autopadding) {
        if (autopadding === void 0) { autopadding = false; }
        var cipher = iv ? crypto.createCipheriv(algorithm, key, iv) : crypto.createCipher(algorithm, key);
        cipher.setAutoPadding(autopadding);
        return cipher;
    }
    exports.createCipher = createCipher;
    function createDecipher(algorithm, key, iv, autopadding) {
        if (autopadding === void 0) { autopadding = false; }
        var decipher = iv ? crypto.createDecipheriv(algorithm, key, iv) : crypto.createDecipher(algorithm, key);
        decipher.setAutoPadding(autopadding);
        return decipher;
    }
    exports.createDecipher = createDecipher;
    function encrypt(algorithm, buffer, key, iv, autopadding) {
        var cipher = createCipher(algorithm, key, iv, autopadding);
        return Buffer.concat([cipher.update(buffer), cipher.final()]);
    }
    exports.encrypt = encrypt;
    function decrypt(algorithm, buffer, key, iv, autopadding) {
        var decipher = createDecipher(algorithm, key, iv, autopadding);
        return Buffer.concat([decipher.update(buffer), decipher.final()]);
    }
    exports.decrypt = decrypt;
    function getRandom(size) {
        return crypto.randomBytes(size);
    }
    exports.getRandom = getRandom;
    var CipherType;
    (function (CipherType) {
        CipherType["TripleDES"] = "des-ede3-cbc";
        CipherType["BlowfishCBC"] = "bf-cbc";
        CipherType["BlowfishECB"] = "bf-ebc";
    })(CipherType = exports.CipherType || (exports.CipherType = {}));
    var CipherFactory = /** @class */ (function () {
        function CipherFactory() {
        }
        CipherFactory.createEncryptor = function (algorithm, key, iv, autoPadding) {
            if (autoPadding === void 0) { autoPadding = true; }
            return new CryptoTransform(createCipher(algorithm, key, iv, autoPadding));
        };
        CipherFactory.createDecryptor = function (algorithm, key, iv, autoPadding) {
            if (autoPadding === void 0) { autoPadding = true; }
            return new CryptoTransform(createDecipher(algorithm, key, iv, autoPadding));
        };
        return CipherFactory;
    }());
    exports.CipherFactory = CipherFactory;
    var CryptoTransform = /** @class */ (function () {
        function CryptoTransform(transform) {
            this.transform = transform;
        }
        CryptoTransform.prototype.transformBlock = function (input, inputOffset, inputCount, output, outputOffest) {
            var tempOutput = this.transform.update(input.slice(inputOffset, inputOffset + inputCount));
            return tempOutput.copy(output, outputOffest || 0);
        };
        CryptoTransform.prototype.transformFinalBlock = function () {
            return this.transform.final();
        };
        return CryptoTransform;
    }());
    exports.CryptoTransform = CryptoTransform;
});
