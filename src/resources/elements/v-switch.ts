import { bindable, bindingMode } from 'aurelia-framework';

export class VSwitchCustomElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: boolean;
}