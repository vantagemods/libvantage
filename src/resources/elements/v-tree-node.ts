import { bindable, bindingMode } from 'aurelia-framework';
import { TreeNode } from './v-tree';

export class VTreeNodeCustomElement {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) node: TreeNode;

	private expanded: boolean = false;

	public toggle(): void {
		this.expanded = !this.expanded;
	}
}