import { MarkEdit } from 'markedit-api';
import { TOGGLE_ACTION_TITLE } from './constants';
import { addToolbarItem, removeToolbarItem } from './toolbar';
import { setSidebarPosition } from './position';
import { checkForUpdates } from './updater';
import type { OutlineSidebar } from './sidebar';
import type { OutlineSettings } from './settings';

/**
 * Add an "Outline Sidebar" submenu under Extensions.
 *
 * The "Toggle Outline Sidebar" command is also the binding target for the
 * native toolbar button: MarkEdit matches a `editor.customToolbarItems` entry
 * to this command by its title (see `toolbar.ts`). The submenu also offers to
 * write / remove that settings.json entry for you.
 */
export function installMenu(settings: OutlineSettings, sidebar: OutlineSidebar): void {
  MarkEdit.addMainMenuItem({
    title: 'Outline Sidebar',
    children: [
      {
        title: TOGGLE_ACTION_TITLE,
        key: settings.shortcut.key,
        modifiers: settings.shortcut.modifiers,
        action: () => sidebar.toggle(),
        // `state` requires MarkEdit 1.24.0+; it shows a checkmark while open.
        state: () => ({ isSelected: sidebar.isOpen() }),
      },
      { separator: true },
      {
        title: 'Dock Left',
        action: () => void setSidebarPosition('left', settings.position),
        state: () => ({ isSelected: settings.position === 'left' }),
      },
      {
        title: 'Dock Right',
        action: () => void setSidebarPosition('right', settings.position),
        state: () => ({ isSelected: settings.position === 'right' }),
      },
      { separator: true },
      {
        title: 'Add Toolbar Button to settings.json',
        action: () => void addToolbarItem(),
      },
      {
        title: 'Remove Toolbar Button',
        action: () => void removeToolbarItem(),
      },
      { separator: true },
      {
        title: 'Check for Updates…',
        action: () => void checkForUpdates(settings.update, true),
      },
    ],
  });
}
