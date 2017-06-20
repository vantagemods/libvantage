import { bindable, bindingMode, observable, computedFrom } from 'aurelia-framework';

export class NumericElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: number;
	@bindable placeholder = '';
	@bindable min = '0';
	@bindable max = '100';
	@bindable step: string|number = '1';

	@observable protected inputValue: string;

	@computedFrom('inputValue')
	public get validInputValue(): boolean {
		return typeof this.inputValue === 'string' && this.inputValue.length !== 0;
	}

	@computedFrom('inputValue', 'max')
	public get canIncrease(): boolean {
		return this.validInputValue && parseFloat(this.inputValue) < parseFloat(this.max);
	}

	@computedFrom('inputValue', 'min')
	public get canDecrease(): boolean {
		return this.validInputValue && parseFloat(this.inputValue) > parseFloat(this.min);
	}

	public inputValueChanged(inputValue: string): void {
		if (typeof inputValue === 'string' && inputValue.length !== 0 && inputValue !== 'NaN') {
			this.value = parseFloat(inputValue);
		}
	}

	public valueChanged(value: number|string): void {
		if (typeof value === 'string' && value.length !== 0) {
			this.inputValue = value;
		} else if (typeof value === 'number') {
			this.inputValue = value.toString();
		}
	}

    public increase(): void {
		if (this.canIncrease) {
			const value = parseFloat(this.inputValue) + parseFloat(this.step.toString());
			this.inputValue = value > parseFloat(this.max) ? this.max : value.toString();
		}
    }

    public decrease(): void {
		if (this.canDecrease) {
			const value = parseFloat(this.inputValue) - parseFloat(this.step.toString());
			this.inputValue = value < parseFloat(this.min) ? this.min : value.toString();
		}
    }
}
