define(["require", "exports", "tslib", "aurelia-framework", "./numeric-element"], function (require, exports, tslib_1, aurelia_framework_1, numeric_element_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VNumberCustomElement = /** @class */ (function (_super) {
        tslib_1.__extends(VNumberCustomElement, _super);
        function VNumberCustomElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Number)
        ], VNumberCustomElement.prototype, "value", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VNumberCustomElement.prototype, "placeholder", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VNumberCustomElement.prototype, "min", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VNumberCustomElement.prototype, "max", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Object)
        ], VNumberCustomElement.prototype, "step", void 0);
        return VNumberCustomElement;
    }(numeric_element_1.NumericElement));
    exports.VNumberCustomElement = VNumberCustomElement;
});
