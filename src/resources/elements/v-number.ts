import { bindable, bindingMode } from 'aurelia-framework';
import { NumericElement } from './numeric-element';

export class VNumberCustomElement extends NumericElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: number;
	@bindable placeholder: string;
	@bindable min: string;
	@bindable max: string;
	@bindable step: string|number;
}
