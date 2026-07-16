import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';

import { loadSettings } from './src/settings';
import { OutlineSidebar } from './src/sidebar';
import { installMenu } from './src/menu';

const settings = loadSettings();
const sidebar = new OutlineSidebar(settings);

installMenu(settings, sidebar);

// Keep the outline in sync with the document. Rebuilding the table of contents
// requires a syntax-tree walk, so it is debounced on edits; caret moves only
// need to refresh the active-item highlight, which is cheap.
let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
MarkEdit.addExtension(
  EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      if (rebuildTimer !== undefined) {
        clearTimeout(rebuildTimer);
      }
      rebuildTimer = setTimeout(() => sidebar.refresh(), 250);
    } else if (update.selectionSet) {
      sidebar.updateActive();
    }
  }),
);

let started = false;
function start(): void {
  if (started) {
    return;
  }
  started = true;
  sidebar.mount();
  if (sidebar.shouldStartOpen()) {
    sidebar.open();
  }
}

MarkEdit.onEditorReady(() => start());

// If the editor is already initialized when this script loads, start immediately
// (onEditorReady may not fire again for an already-ready editor).
try {
  if (MarkEdit.editorView !== undefined) {
    start();
  }
} catch {
  // editorView not ready yet; onEditorReady will handle it.
}
