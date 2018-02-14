define(["require", "exports", "tslib", "aurelia-framework"], function (require, exports, tslib_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VTreeCustomElement = /** @class */ (function () {
        function VTreeCustomElement() {
        }
        VTreeCustomElement.prototype.filterNodesRecursive = function (predicate, nodes, matches) {
            var _this = this;
            if (nodes) {
                nodes.forEach(function (node) {
                    if (predicate(node)) {
                        matches.push(node);
                    }
                    _this.filterNodesRecursive(predicate, nodes, matches);
                });
            }
            return matches;
        };
        VTreeCustomElement.prototype.filterNodes = function (predicate) {
            return this.filterNodesRecursive(predicate, this.nodes, []);
        };
        VTreeCustomElement.prototype.findNodeRecursive = function (predicate, nodes) {
            if (!nodes) {
                return null;
            }
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var node = nodes_1[_i];
                if (predicate(node)) {
                    return node;
                }
                var match = this.findNodeRecursive(predicate, node.nodes);
                if (match) {
                    return match;
                }
            }
            return null;
        };
        VTreeCustomElement.prototype.findNode = function (predicate) {
            return this.findNodeRecursive(predicate, this.nodes);
        };
        VTreeCustomElement.prototype.findNodeById = function (id) {
            return this.findNode(function (n) { return n.id === id; });
        };
        VTreeCustomElement.prototype.findNodeByPathRecursive = function (nodes, path) {
            if (!path || !path.length || !nodes) {
                return null;
            }
            var currentId = path.shift();
            var node = nodes.find(function (n) { return n.id === currentId; });
            if (!node) {
                return null;
            }
            if (!path.length) {
                return node;
            }
            for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                var node_1 = nodes_2[_i];
                var match = this.findNodeByPathRecursive(node_1.nodes, path);
                if (match) {
                    return match;
                }
            }
            return null;
        };
        VTreeCustomElement.prototype.findNodeByPath = function (path) {
            return this.findNodeByPathRecursive(this.nodes, typeof path === 'string' ? path.split('.') : path);
        };
        tslib_1.__decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            tslib_1.__metadata("design:type", Array)
        ], VTreeCustomElement.prototype, "nodes", void 0);
        return VTreeCustomElement;
    }());
    exports.VTreeCustomElement = VTreeCustomElement;
});
