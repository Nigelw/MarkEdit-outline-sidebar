import { MarkEdit } from 'markedit-api';
import { SETTINGS_NAMESPACE } from './constants';
import { readSettings, writeSettings } from './settingsFile';
import type { HighlightMode } from './settings';
import type { OutlineSidebar } from './sidebar';

/**
 * Switch what drives the highlighted outline item. Unlike the docked side, this
 * needs no relaunch — it's just a different rule for computing the active item —
 * so it's applied to the live sidebar immediately, then persisted to
 * `settings.json` so it sticks across launches.
 */
export async function setHighlightMode(mode: HighlightMode, sidebar: OutlineSidebar): Promise<void> {
  // Apply live first; persistence is best-effort and mustn't block the change.
  sidebar.setHighlightMode(mode);

  const parsed = await readSettings();
  if (parsed === undefined) {
    await MarkEdit.showAlert({
      title: "Couldn't save the setting",
      message:
        "The change is active now, but your settings.json couldn't be parsed as JSON, so it " +
        `wasn't saved and won't survive a relaunch.\n\nSet "highlightMode": "${mode}" under ` +
        `"${SETTINGS_NAMESPACE}" yourself to keep it.`,
      buttons: ['OK'],
    });
    return;
  }

  const existing =
    typeof parsed[SETTINGS_NAMESPACE] === 'object' && parsed[SETTINGS_NAMESPACE] !== null
      ? (parsed[SETTINGS_NAMESPACE] as Record<string, unknown>)
      : {};
  parsed[SETTINGS_NAMESPACE] = { ...existing, highlightMode: mode };

  const ok = await writeSettings(parsed);
  if (!ok) {
    await MarkEdit.showAlert({
      title: 'Failed to write settings.json',
      message:
        "The change is active now, but it couldn't be saved. Check permissions in the MarkEdit " +
        `Documents folder, or set "highlightMode": "${mode}" under "${SETTINGS_NAMESPACE}" manually.`,
      buttons: ['OK'],
    });
  }
}
