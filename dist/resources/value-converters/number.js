define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormatNumberValueConverter = /** @class */ (function () {
        function FormatNumberValueConverter() {
        }
        FormatNumberValueConverter.prototype.toView = function (value) {
            return value.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        };
        FormatNumberValueConverter.prototype.fromView = function (value) {
            return parseFloat(value.replace(/,/, ''));
        };
        return FormatNumberValueConverter;
    }());
    exports.FormatNumberValueConverter = FormatNumberValueConverter;
    var sizeStrings = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'WTF'];
    var ByteFormatValueConverter = /** @class */ (function () {
        function ByteFormatValueConverter() {
        }
        ByteFormatValueConverter.prototype.toView = function (value, fractionDigits) {
            if (fractionDigits === void 0) { fractionDigits = 2; }
            if (value === 0) {
                return "0 " + sizeStrings[0];
            }
            var x = Math.floor(Math.log(value) / Math.log(1024));
            return parseFloat((value / Math.pow(1024, x)).toFixed(fractionDigits)) + ' ' + sizeStrings[x];
        };
        return ByteFormatValueConverter;
    }());
    exports.ByteFormatValueConverter = ByteFormatValueConverter;
});
