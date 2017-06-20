import { bindable, bindingMode } from 'aurelia-framework';

export interface Node {
    id?: string;
    name: string;
    component?: Component;
    nodes: Node[]|null;
}

export interface Component {
    type: 'number'|'text'|'select'|'switch'|'slider'|'button',
    value: number|string|boolean|Function;
}

export interface Tree {
    readonly nodes: Node[];
    findNodeByPath(path: string|string[]): Node|null;
    findNodeById(id: string): Node|null;
    findNode(predicate: (node: Node) => boolean): Node|null;
    filterNodes(predicate: (node: Node) => boolean): Node[];
}

export class VTreeCustomElement implements Tree {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) nodes: Node[];

    private filterNodesRecursive(predicate: (node: Node) => boolean, nodes: Node[], matches: Node[]): Node[] {
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

    public filterNodes(predicate: (node: Node) => boolean): Node[] {
        return this.filterNodesRecursive(predicate, this.nodes, []);
    }

    private findNodeRecursive(predicate: (node: Node) => boolean, nodes: Node[]|null): Node|null {
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

    public findNode(predicate: (node: Node) => boolean): Node|null {
        return this.findNodeRecursive(predicate, this.nodes);
    }

    public findNodeById(id: string): Node|null {
        return this.findNode(n => n.id === id);
    }

    private findNodeByPathRecursive(nodes: Node[]|null, path: string[]): Node|null {
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

    public findNodeByPath(path: string|string[]): Node|null {
        return this.findNodeByPathRecursive(this.nodes, typeof path === 'string' ? path.split('.') : path);
    }
}