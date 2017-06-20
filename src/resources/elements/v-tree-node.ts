import { bindable, bindingMode } from 'aurelia-framework';
import { Node } from './v-tree';

export class VTreeNodeCustomElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) node: Node;

	private expanded: boolean = false;

	public toggle(): void {
		this.expanded = !this.expanded;
	}
}