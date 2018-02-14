define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VSelectionCustomElement = /** @class */ (function () {
        function VSelectionCustomElement() {
            this.open = false;
        }
        VSelectionCustomElement.prototype.bind = function () {
            this.valueChanged();
        };
        VSelectionCustomElement.prototype.select = function (option) {
            this.selectedOption = option;
            this.open = false;
        };
        VSelectionCustomElement.prototype.selectedOptionChanged = function () {
            this.value = this.selectedOption ? this.selectedOption.value : null;
        };
        VSelectionCustomElement.prototype.valueChanged = function () {
            var _this = this;
            this.selectedOption = (this.options && this.options.find(function (option) { return _this.value == option.value; })) || {
                label: this.value,
                value: this.value,
            };
        };
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Object)
        ], VSelectionCustomElement.prototype, "value", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Array)
        ], VSelectionCustomElement.prototype, "options", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.observable,
            tslib_1.__metadata("design:type", Object)
        ], VSelectionCustomElement.prototype, "selectedOption", void 0);
        return VSelectionCustomElement;
    }());
    exports.VSelectionCustomElement = VSelectionCustomElement;
});
