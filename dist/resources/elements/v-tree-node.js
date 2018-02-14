define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VTreeNodeCustomElement = /** @class */ (function () {
        function VTreeNodeCustomElement() {
            this.expanded = false;
        }
        VTreeNodeCustomElement.prototype.toggle = function () {
            this.expanded = !this.expanded;
        };
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Object)
        ], VTreeNodeCustomElement.prototype, "node", void 0);
        return VTreeNodeCustomElement;
    }());
    exports.VTreeNodeCustomElement = VTreeNodeCustomElement;
});
