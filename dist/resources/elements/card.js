define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CardCustomElement = /** @class */ (function () {
        function CardCustomElement() {
        }
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], CardCustomElement.prototype, "label", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], CardCustomElement.prototype, "height", void 0);
        return CardCustomElement;
    }());
    exports.CardCustomElement = CardCustomElement;
});
