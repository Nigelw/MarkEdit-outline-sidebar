import { MarkEdit } from 'markedit-api';
import type { OutlineSidebar } from './sidebar';
import type { OutlineSettings } from './settings';

/**
 * Add an "Outline Sidebar" submenu under Extensions, with a keyboard shortcut
 * to toggle the sidebar. This is the extension-level equivalent of a toolbar
 * toggle — the native macOS NSToolbar can't be modified through the MarkEdit
 * extension API, so the toggle is exposed here, via the keyboard shortcut, and
 * via the floating in-editor button.
 */
export function installMenu(settings: OutlineSettings, sidebar: OutlineSidebar): void {
  MarkEdit.addMainMenuItem({
    title: 'Outline Sidebar',
    icon: settings.position === 'left' ? 'sidebar.left' : 'sidebar.right',
    children: [
      {
        title: 'Toggle Outline Sidebar',
        key: settings.shortcut.key,
        modifiers: settings.shortcut.modifiers,
        action: () => sidebar.toggle(),
        // `state` requires MarkEdit 1.24.0+; it shows a checkmark while open.
        state: () => ({ isSelected: sidebar.isOpen() }),
      },
      { separator: true },
      {
        title: 'Show Outline',
        action: () => sidebar.open(),
        state: () => ({ isEnabled: !sidebar.isOpen() }),
      },
      {
        title: 'Hide Outline',
        action: () => sidebar.close(),
        state: () => ({ isEnabled: sidebar.isOpen() }),
      },
    ],
  });
}
