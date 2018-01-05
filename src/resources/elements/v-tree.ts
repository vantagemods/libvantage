import { bindable, bindingMode } from 'aurelia-framework';

export interface TreeNode {
    id?: string;
    name: string;
    component?: TreeComponent;
    nodes?: TreeNode[];
}

export interface TreeComponent {
    type: 'number'|'text'|'selection'|'switch'|'slider'|'button',
}

export interface Tree {
    readonly nodes: TreeNode[];
    findNodeByPath(path: string|string[]): TreeNode|null;
    findNodeById(id: string): TreeNode|null;
    findNode(predicate: (node: TreeNode) => boolean): TreeNode|null;
    filterNodes(predicate: (node: TreeNode) => boolean): TreeNode[];
}

export class VTreeCustomElement implements Tree {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) nodes: TreeNode[];

    private filterNodesRecursive(predicate: (node: TreeNode) => boolean, nodes: TreeNode[], matches: TreeNode[]): TreeNode[] {
        if (nodes) {
            nodes.forEach(node => {
                if (predicate(node)) {
                    matches.push(node);
                }
                this.filterNodesRecursive(predicate, nodes, matches);
            });
        }
        return matches;
    }

    public filterNodes(predicate: (node: TreeNode) => boolean): TreeNode[] {
        return this.filterNodesRecursive(predicate, this.nodes, []);
    }

    private findNodeRecursive(predicate: (node: TreeNode) => boolean, nodes: TreeNode[]|undefined): TreeNode|null {
        if (!nodes) {
            return null;
        }
        for (const node of nodes) {
            if (predicate(node)) {
                return node;
            }
            const match = this.findNodeRecursive(predicate, node.nodes);
            if (match) {
                return match;
            }
        }
        return null;
    }

    public findNode(predicate: (node: TreeNode) => boolean): TreeNode|null {
        return this.findNodeRecursive(predicate, this.nodes);
    }

    public findNodeById(id: string): TreeNode|null {
        return this.findNode(n => n.id === id);
    }

    private findNodeByPathRecursive(nodes: TreeNode[]|undefined, path: string[]): TreeNode|null {
        if (!path || !path.length || !nodes) {
            return null;
        }
        const currentId = path.shift();
        const node = nodes.find(n => n.id === currentId);
        if (!node) {
            return null;
        }
        if (!path.length) {
            return node;
        }
        for (const node of nodes) {
            const match = this.findNodeByPathRecursive(node.nodes, path);
            if (match) {
                return match;
            }
        }
        return null;
    }

    public findNodeByPath(path: string|string[]): TreeNode|null {
        return this.findNodeByPathRecursive(this.nodes, typeof path === 'string' ? path.split('.') : path);
    }
}