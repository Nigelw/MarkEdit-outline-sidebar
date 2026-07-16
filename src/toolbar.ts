import { MarkEdit } from 'markedit-api';
import { TOGGLE_ACTION_TITLE } from './constants';
import type { OutlineSettings } from './settings';

/**
 * Adds / removes a native macOS toolbar item, by editing MarkEdit's
 * `settings.json`. MarkEdit (1.24+) reads `editor.customToolbarItems` and, for
 * each entry with an `actionName`, creates a real NSToolbarItem whose click
 * performs the main-menu command with that title. Our "Toggle Outline Sidebar"
 * menu command is that target, so the toolbar button toggles the sidebar.
 *
 * The extension can't place the item into the toolbar itself — after a restart
 * the user drags it in via View → Customize Toolbar.
 */

const SETTINGS_FILE = 'settings.json';
const TOOLBAR_KEY = 'editor.customToolbarItems';

interface ToolbarItem {
  title: string;
  icon: string;
  actionName?: string;
  menuName?: string;
}

function settingsPath(): string {
  return `${MarkEdit.getDirectoryPath('documents')}/${SETTINGS_FILE}`;
}

function toolbarItemFor(settings: OutlineSettings): ToolbarItem {
  return {
    title: 'Outline',
    icon: settings.position === 'left' ? 'sidebar.left' : 'sidebar.right',
    actionName: TOGGLE_ACTION_TITLE,
  };
}

function isOurItem(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { actionName?: unknown }).actionName === TOGGLE_ACTION_TITLE
  );
}

/**
 * Parse the existing settings.json. Returns the parsed object, `{}` when the
 * file is absent/empty, or `undefined` when it exists but can't be parsed — in
 * which case the caller must NOT overwrite it (that would destroy user data).
 */
async function readSettings(): Promise<Record<string, unknown> | undefined> {
  const content = await MarkEdit.getFileContent(settingsPath());
  if (content === undefined || content.trim().length === 0) {
    return {};
  }
  try {
    const parsed = JSON.parse(content) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

async function writeSettings(settings: Record<string, unknown>): Promise<boolean> {
  return MarkEdit.createFile({
    path: settingsPath(),
    string: `${JSON.stringify(settings, null, 2)}\n`,
    overwrites: true,
  });
}

async function unparseableAlert(item: ToolbarItem): Promise<void> {
  await MarkEdit.showAlert({
    title: "Couldn't update settings.json automatically",
    message:
      "Your settings.json couldn't be parsed as JSON, so it was left untouched.\n\n" +
      `Add this object to the "${TOOLBAR_KEY}" array yourself:\n\n${JSON.stringify(item)}`,
    buttons: ['OK'],
  });
}

export async function addToolbarItem(settings: OutlineSettings): Promise<void> {
  const item = toolbarItemFor(settings);
  const parsed = await readSettings();
  if (parsed === undefined) {
    await unparseableAlert(item);
    return;
  }

  const existing = Array.isArray(parsed[TOOLBAR_KEY]) ? (parsed[TOOLBAR_KEY] as unknown[]) : [];
  if (existing.some(isOurItem)) {
    await MarkEdit.showAlert({
      title: 'Toolbar button already configured',
      message:
        'A toolbar toggle for the Outline Sidebar is already in your settings.json.\n\n' +
        'If you don’t see it, restart MarkEdit and add it via View → Customize Toolbar….',
      buttons: ['OK'],
    });
    return;
  }

  parsed[TOOLBAR_KEY] = [...existing, item];
  const ok = await writeSettings(parsed);
  await MarkEdit.showAlert({
    title: ok ? 'Toolbar button added' : 'Failed to write settings.json',
    message: ok
      ? 'Restart MarkEdit, then drag the “Outline” item into the toolbar via ' +
        'View → Customize Toolbar…. Clicking it toggles the sidebar.'
      : 'Could not write settings.json. Check permissions in the MarkEdit Documents folder, ' +
        `or add this item to "${TOOLBAR_KEY}" manually:\n\n${JSON.stringify(item)}`,
    buttons: ['OK'],
  });
}

export async function removeToolbarItem(settings: OutlineSettings): Promise<void> {
  const parsed = await readSettings();
  if (parsed === undefined) {
    await unparseableAlert(toolbarItemFor(settings));
    return;
  }

  const existing = Array.isArray(parsed[TOOLBAR_KEY]) ? (parsed[TOOLBAR_KEY] as unknown[]) : [];
  const filtered = existing.filter((item) => !isOurItem(item));
  if (filtered.length === existing.length) {
    await MarkEdit.showAlert({
      title: 'Nothing to remove',
      message: 'No Outline Sidebar toolbar item was found in settings.json.',
      buttons: ['OK'],
    });
    return;
  }

  if (filtered.length === 0) {
    delete parsed[TOOLBAR_KEY];
  } else {
    parsed[TOOLBAR_KEY] = filtered;
  }

  const ok = await writeSettings(parsed);
  await MarkEdit.showAlert({
    title: ok ? 'Toolbar button removed' : 'Failed to write settings.json',
    message: ok
      ? 'Restart MarkEdit to apply. You can also remove it from the toolbar via ' +
        'View → Customize Toolbar….'
      : 'Could not write settings.json.',
    buttons: ['OK'],
  });
}
