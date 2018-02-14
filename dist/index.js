define(["require", "exports", "tslib", "./vantage", "./crypto/index", "./io/index", "./compression/index"], function (require, exports, tslib_1, vantage_1, index_1, index_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tslib_1.__exportStar(vantage_1, exports);
    tslib_1.__exportStar(index_1, exports);
    tslib_1.__exportStar(index_2, exports);
    tslib_1.__exportStar(index_3, exports);
    /**
     * Register the library with Aurelia.
     * @param config The Aurelia framework configuration
     */
    function configure(config) {
        config.globalResources([
            './resources/elements/v-button',
            './resources/elements/v-number',
            './resources/elements/v-selection',
            './resources/elements/v-slider',
            './resources/elements/v-switch',
            './resources/elements/v-text',
            './resources/elements/v-tree',
            './resources/elements/card',
            './resources/value-converters/array',
            './resources/value-converters/number',
            './resources/value-converters/object',
        ]);
    }
    exports.configure = configure;
});
