define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wind = window;
    var vantage = wind.vantage;
    // Restore allowed node modules.
    wind.Buffer = vantage.Buffer;
    function setEditor(editor) {
        vantage.setEditor(editor);
    }
    exports.setEditor = setEditor;
    function openDevTools() {
        vantage.openDevTools();
    }
    exports.openDevTools = openDevTools;
    // Open dev tools on Ctrl + Shift + D.
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            openDevTools();
        }
    });
});
