define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumericElement = /** @class */ (function () {
        function NumericElement() {
            this.placeholder = '';
            this.min = '0';
            this.max = '100';
            this.step = '1';
        }
        Object.defineProperty(NumericElement.prototype, "validInputValue", {
            get: function () {
                return typeof this.inputValue === 'string' && this.inputValue.length !== 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumericElement.prototype, "canIncrease", {
            get: function () {
                return this.validInputValue && parseFloat(this.inputValue) < parseFloat(this.max);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumericElement.prototype, "canDecrease", {
            get: function () {
                return this.validInputValue && parseFloat(this.inputValue) > parseFloat(this.min);
            },
            enumerable: true,
            configurable: true
        });
        NumericElement.prototype.inputValueChanged = function (inputValue) {
            if (typeof inputValue === 'string' && inputValue.length !== 0 && inputValue !== 'NaN') {
                this.value = parseFloat(inputValue);
            }
        };
        NumericElement.prototype.valueChanged = function (value) {
            if (typeof value === 'string' && value.length !== 0) {
                this.inputValue = value;
            }
            else if (typeof value === 'number') {
                this.inputValue = value.toString();
            }
        };
        NumericElement.prototype.increase = function () {
            if (this.canIncrease) {
                var value = parseFloat(this.inputValue) + parseFloat(this.step.toString());
                this.inputValue = value > parseFloat(this.max) ? this.max : value.toString();
            }
        };
        NumericElement.prototype.decrease = function () {
            if (this.canDecrease) {
                var value = parseFloat(this.inputValue) - parseFloat(this.step.toString());
                this.inputValue = value < parseFloat(this.min) ? this.min : value.toString();
            }
        };
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Number)
        ], NumericElement.prototype, "value", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Object)
        ], NumericElement.prototype, "placeholder", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Object)
        ], NumericElement.prototype, "min", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Object)
        ], NumericElement.prototype, "max", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.bindable,
            tslib_1.__metadata("design:type", Object)
        ], NumericElement.prototype, "step", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.observable,
            tslib_1.__metadata("design:type", String)
        ], NumericElement.prototype, "inputValue", void 0);
        tslib_1.__decorate([
            aurelia_framework_1.computedFrom('inputValue'),
            tslib_1.__metadata("design:type", Boolean),
            tslib_1.__metadata("design:paramtypes", [])
        ], NumericElement.prototype, "validInputValue", null);
        tslib_1.__decorate([
            aurelia_framework_1.computedFrom('inputValue', 'max'),
            tslib_1.__metadata("design:type", Boolean),
            tslib_1.__metadata("design:paramtypes", [])
        ], NumericElement.prototype, "canIncrease", null);
        tslib_1.__decorate([
            aurelia_framework_1.computedFrom('inputValue', 'min'),
            tslib_1.__metadata("design:type", Boolean),
            tslib_1.__metadata("design:paramtypes", [])
        ], NumericElement.prototype, "canDecrease", null);
        return NumericElement;
    }());
    exports.NumericElement = NumericElement;
});
