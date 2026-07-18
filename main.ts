import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';

import { loadSettings } from './src/settings';
import { OutlineSidebar } from './src/sidebar';
import { installMenu } from './src/menu';
import { checkForUpdates } from './src/updater';

const settings = loadSettings();
const sidebar = new OutlineSidebar(settings);

installMenu(settings, sidebar);

// Check GitHub for a newer release once the app is ready (respects the `update`
// setting and is throttled to once a day). A short delay keeps it well clear of
// editor startup.
MarkEdit.onAppReady(() => {
  setTimeout(() => void checkForUpdates(settings.update), 2000);
});

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
      rebuildTimer = setTimeout(() => sidebar.refresh(), 250);
    } else if (update.selectionSet) {
      sidebar.onSelectionChange();
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
