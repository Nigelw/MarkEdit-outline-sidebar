import { MarkEdit } from 'markedit-api';
import { SETTINGS_NAMESPACE } from './constants';
import { loadSettings } from './settings';
import { readSettings, writeSettings } from './settingsFile';
import type { OutlineSettings, Position } from './settings';
import type { OutlineSidebar } from './sidebar';

/**
 * Change which edge the sidebar is docked to by editing `settings.json`, then
 * refresh the runtime settings and apply the validated value immediately.
 */
export async function setSidebarPosition(
  position: Position,
  settings: OutlineSettings,
  sidebar: OutlineSidebar,
): Promise<void> {
  const active = settings.position;

  const parsed = await readSettings();
  if (parsed === undefined) {
    await MarkEdit.showAlert({
      title: "Couldn't update settings.json",
      message:
        "Your settings.json couldn't be parsed as JSON, so it was left untouched.\n\n" +
        `Set "position": "${position}" under "${SETTINGS_NAMESPACE}" yourself.`,
      buttons: ['OK'],
    });
    return;
  }

  const existing =
    typeof parsed[SETTINGS_NAMESPACE] === 'object' && parsed[SETTINGS_NAMESPACE] !== null
      ? (parsed[SETTINGS_NAMESPACE] as Record<string, unknown>)
      : {};
  parsed[SETTINGS_NAMESPACE] = { ...existing, position };

  const ok = await writeSettings(parsed);
  if (!ok) {
    await MarkEdit.showAlert({
      title: 'Failed to write settings.json',
      message:
        'Could not write settings.json. Check permissions in the MarkEdit Documents folder, ' +
        `or set "position": "${position}" under "${SETTINGS_NAMESPACE}" manually.`,
      buttons: ['OK'],
    });
    return;
  }

  await reloadMarkEditSettings(parsed);
  const next = loadSettings();
  Object.assign(settings, next);
  sidebar.applySettings(settings, active);
}

async function reloadMarkEditSettings(parsed: Record<string, unknown>): Promise<void> {
  const api = MarkEdit as typeof MarkEdit & { loadSettings?: () => void | Promise<void> };
  await api.loadSettings?.();
  (MarkEdit.userSettings as Record<string, unknown>)[SETTINGS_NAMESPACE] = parsed[SETTINGS_NAMESPACE];
}
