import { bindable, bindingMode } from 'aurelia-framework';

export class VTextCustomElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;
	@bindable placeholder: string;
	@bindable style: string;
}