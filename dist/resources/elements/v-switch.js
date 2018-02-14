define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VSwitchCustomElement = /** @class */ (function () {
        function VSwitchCustomElement() {
        }
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Boolean)
        ], VSwitchCustomElement.prototype, "value", void 0);
        return VSwitchCustomElement;
    }());
    exports.VSwitchCustomElement = VSwitchCustomElement;
});
