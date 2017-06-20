import { bindable, bindingMode, observable } from 'aurelia-framework';

export type SelectInputOption = {
	label: string,
	value: any
};

export class VSelectionCustomElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: any;
	@bindable options: SelectInputOption[];

	private open: boolean = false;
	@observable private selectedOption: SelectInputOption;

	public bind() {
		this.valueChanged();
	}

	public select(option: SelectInputOption): void {
		this.selectedOption = option;
		this.open = false;
	}

	public selectedOptionChanged(): void {
		this.value = this.selectedOption ? this.selectedOption.value : null;
	}

	public valueChanged(): void {
		this.selectedOption = (this.options && this.options.find(option => this.value == option.value)) || {
			label: this.value,
			value: this.value,
		};
	}
}