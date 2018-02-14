define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PluckValueConverter = /** @class */ (function () {
        function PluckValueConverter() {
        }
        PluckValueConverter.prototype.toView = function (value, prop, def) {
            return value ? value.map(function (v) { return v.hasOwnProperty(prop) ? v[prop] : def; }) : [];
        };
        return PluckValueConverter;
    }());
    exports.PluckValueConverter = PluckValueConverter;
    var TakeValueConverter = /** @class */ (function () {
        function TakeValueConverter() {
        }
        TakeValueConverter.prototype.toView = function (value, count) {
            return value && value.length != 0 ? value.slice(0, count) : [];
        };
        return TakeValueConverter;
    }());
    exports.TakeValueConverter = TakeValueConverter;
    var SortValueConverter = /** @class */ (function () {
        function SortValueConverter() {
        }
        SortValueConverter.prototype.toView = function (value, prop) {
            if (!value || value.length === 0) {
                return [];
            }
            if (!prop) {
                return value.sort();
            }
            if (typeof value[0][prop] === 'number') {
                return value.sort(function (a, b) { return a[prop] > b[prop] ? 1 : (a[prop] < b[prop] ? -1 : 0); });
            }
            return value.sort(function (a, b) { return a[prop] && b[prop] ? a[prop].toString().localeCompare(b[prop].toString()) : 0; });
        };
        return SortValueConverter;
    }());
    exports.SortValueConverter = SortValueConverter;
});
