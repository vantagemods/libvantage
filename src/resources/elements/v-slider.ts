import { bindable, bindingMode } from 'aurelia-framework';
import { NumericElement } from './numeric-element';

export class VSliderCustomElement extends NumericElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: number;
	@bindable placeholder: string;
	@bindable min: string;
	@bindable max: string;
	@bindable step: string|number;

	private labelElement: HTMLElement;
	private label = 'No Value';

	public attached(): void {
		this.refreshLabel();
	}

	public valueChanged(value: number|string): void {
		super.valueChanged(value);
		this.refreshLabel();
	}

	public inputValueChanged(value: string): void {
		super.inputValueChanged(value);
		this.refreshLabel();
	}

	private refreshLabel(): void {
		if (this.labelElement) {
			if (!this.inputValue || this.inputValue === 'NaN') {
				this.label = 'N/A';
				this.labelElement.style.marginLeft = '50%';
			} else {
				const min = parseFloat(this.min);
				const max = parseFloat(this.max);
				this.labelElement.style.marginLeft = ((parseFloat(this.inputValue) - min) / (max - min) * 100) + '%';
				this.label = this.inputValue;
				// Add correct precision to value string.
				if (this.label.indexOf('.') === -1) {
					const decimalIndex = this.step.toString().indexOf('.');
					if (decimalIndex !== -1) {
						this.label += '.' + '0'.repeat(this.step.toString().length - decimalIndex - 1);
					}
				}
			}
		}
	}
}