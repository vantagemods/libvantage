import { FrameworkConfiguration } from 'aurelia-framework';

export * from './vantage';
export * from './stream';
export * from './crypto/index';

/**
 * Register the library with Aurelia.
 * @param config The Aurelia framework configuration
 */
export function configure(config: FrameworkConfiguration): void {
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