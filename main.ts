import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';

import { loadSettings } from './src/settings';
import { OutlineSidebar } from './src/sidebar';
import { installMenu } from './src/menu';

const settings = loadSettings();
const sidebar = new OutlineSidebar(settings);

installMenu(settings, sidebar);

// Keep the outline in sync with the document. Rebuilding the table of contents
// requires a syntax-tree walk, so it is debounced on edits. Cursor moves only
// matter in "follows insertion point" mode; the sidebar ignores them otherwise
// (in the default "follows scroll" mode the highlight is driven by scroll events).
let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
MarkEdit.addExtension(
  EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      if (rebuildTimer !== undefined) {
        clearTimeout(rebuildTimer);
      }
      rebuildTimer = setTimeout(() => {
        rebuildTimer = undefined;
        sidebar.refresh();
      }, 250);
    } else if (update.selectionSet) {
      sidebar.onSelectionChange();
    }
  }),
);

let started = false;
let readyEditor: EditorView | undefined;
function start(editor: EditorView): void {
  if (readyEditor === editor) {
    return;
  }
  readyEditor = editor;

  // A document reload replaces the EditorView without dispatching a docChanged
  // transaction on the old view. Discard that document's pending refresh and
  // rebuild from the replacement view when the sidebar is open.
  if (rebuildTimer !== undefined) {
    clearTimeout(rebuildTimer);
    rebuildTimer = undefined;
  }

  if (started) {
    sidebar.refresh();
    return;
  }

  started = true;
  sidebar.mount();
  if (sidebar.shouldStartOpen()) {
    sidebar.open();
  }
}

MarkEdit.onEditorReady((editor) => start(editor));

// If the editor is already initialized when this script loads, start immediately
// (onEditorReady may not fire again for an already-ready editor).
try {
  if (MarkEdit.editorView !== undefined) {
    start(MarkEdit.editorView);
  }
} catch {
  // editorView not ready yet; onEditorReady will handle it.
}
