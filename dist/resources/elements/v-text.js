define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VTextCustomElement = /** @class */ (function () {
        function VTextCustomElement() {
        }
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", String)
        ], VTextCustomElement.prototype, "value", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VTextCustomElement.prototype, "placeholder", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VTextCustomElement.prototype, "style", void 0);
        return VTextCustomElement;
    }());
    exports.VTextCustomElement = VTextCustomElement;
});
