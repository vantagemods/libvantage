define(["require", "exports", "tslib", "aurelia-framework", "./numeric-element"], function (require, exports, tslib_1, aurelia_framework_1, numeric_element_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VSliderCustomElement = /** @class */ (function (_super) {
        tslib_1.__extends(VSliderCustomElement, _super);
        function VSliderCustomElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.label = 'No Value';
            return _this;
        }
        VSliderCustomElement.prototype.attached = function () {
            this.refreshLabel();
        };
        VSliderCustomElement.prototype.valueChanged = function (value) {
            _super.prototype.valueChanged.call(this, value);
            this.refreshLabel();
        };
        VSliderCustomElement.prototype.inputValueChanged = function (value) {
            _super.prototype.inputValueChanged.call(this, value);
            this.refreshLabel();
        };
        VSliderCustomElement.prototype.refreshLabel = function () {
            if (this.labelElement) {
                if (!this.inputValue || this.inputValue === 'NaN') {
                    this.label = 'N/A';
                    this.labelElement.style.marginLeft = '50%';
                }
                else {
                    var min = parseFloat(this.min);
                    var max = parseFloat(this.max);
                    this.labelElement.style.marginLeft = ((parseFloat(this.inputValue) - min) / (max - min) * 100) + '%';
                    this.label = this.inputValue;
                    // Add correct precision to value string.
                    if (this.label.indexOf('.') === -1) {
                        var decimalIndex = this.step.toString().indexOf('.');
                        if (decimalIndex !== -1) {
                            this.label += '.' + '0'.repeat(this.step.toString().length - decimalIndex - 1);
                        }
                    }
                }
            }
        };
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Number)
        ], VSliderCustomElement.prototype, "value", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VSliderCustomElement.prototype, "placeholder", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VSliderCustomElement.prototype, "min", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", String)
        ], VSliderCustomElement.prototype, "max", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Object)
        ], VSliderCustomElement.prototype, "step", void 0);
        return VSliderCustomElement;
    }(numeric_element_1.NumericElement));
    exports.VSliderCustomElement = VSliderCustomElement;
});
