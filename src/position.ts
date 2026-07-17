import { MarkEdit } from 'markedit-api';
import { SETTINGS_NAMESPACE } from './constants';
import { readSettings, writeSettings } from './settingsFile';
import type { Position } from './settings';

/**
 * Change which edge the sidebar is docked to by editing `settings.json`, then
 * prompt to restart. Position is read once at launch (in `loadSettings`), so a
 * relaunch is needed to apply it — mirroring the "Add/Remove Toolbar" commands.
 */
export async function setSidebarPosition(position: Position, active: Position): Promise<void> {
  const side = position === 'left' ? 'left' : 'right';

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

  await MarkEdit.showAlert(
    position === active
      ? {
          title: `Docked on the ${side}`,
          message: `The Outline Sidebar is already on the ${side}.`,
          buttons: ['OK'],
        }
      : {
          title: 'Restart to apply',
          message: `Restart MarkEdit to move the Outline Sidebar to the ${side}.`,
          buttons: ['OK'],
        },
  );
}
