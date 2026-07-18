# Changelog

## Unreleased

## 1.0.0 (2026-07-17)

### New

- Initial release: a persistent table-of-contents **sidebar** for MarkEdit, turning the built-in Table of Contents popover into a panel you can keep open
- Lists every heading (`#`–`######`, ATX and Setext), indented by level, with the current section highlighted as you move the caret
- Click a heading to navigate
  - In edit mode, scrolls the editor and moves the caret to the heading
  - In preview and side-by-side modes, scrolls the rendered preview to the matching heading and briefly highlights it
- Live updates: the outline rebuilds as you type (debounced) and re-highlights as you move around
- Multiple ways to toggle
  - Keyboard shortcut (⇧⌘L by default, configurable)
  - Extensions menu command
  - Optional native macOS toolbar button, added/removed for you via the menu
- Dock the sidebar to the left or right edge, remembered in `settings.json`
- Resizable width via the draggable divider, remembered between launches
- Remembers whether it was open or closed on the next launch (configurable)
- Theme-aware: reads colors from the live editor theme to match MarkEdit's light, dark, and custom themes
- In-app auto-updater: checks GitHub for newer releases on launch and offers to install them
  - Configurable behavior: automatic, notify (default), or never
  - Also available on demand via *Extensions → Outline Sidebar → Check for Updates…*
