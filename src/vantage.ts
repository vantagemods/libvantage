export interface SaveEditor {
    load(buffer: Buffer): Promise<void>|void;
    save(): Promise<Buffer>|Buffer;
}

interface Vantage {
    Buffer: Buffer,
    setEditor(editor: SaveEditor): void;
    openDevTools(): void;
}

const wind = <any>window;
const vantage: Vantage = wind.vantage;
delete wind.vantage; // Don't need this anymore.

// Restore allowed node modules.
wind.Buffer = vantage.Buffer;

export function setEditor(editor: SaveEditor): void {
    vantage.setEditor(editor);
}

export function openDevTools(): void {
    vantage.openDevTools();
}

// Open dev tools on Ctrl + Shift + D.
document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        openDevTools();
    }
});