# MarkEdit Outline Sidebar

A table-of-contents / outline **sidebar** for [MarkEdit](https://github.com/MarkEdit-app/MarkEdit).

MarkEdit ships a Table of Contents as an optional **toolbar popover** (⇧⌘O). This
extension turns that into a persistent, dockable **sidebar** you can show or hide,
that highlights your current section and lets you jump around the document by
clicking headings — in both **edit** and **preview** modes.

## Features

- **Dockable sidebar** listing every heading (`#` … `######`, ATX and Setext),
  indented by level, with the current section highlighted as you move the caret.
- **Click to navigate** — clicking a heading scrolls the editor to it and moves
  the caret there.
- **Works in preview too** — when the [MarkEdit-preview](https://github.com/MarkEdit-app/MarkEdit-preview)
  extension is showing a preview (preview or side-by-side view mode), clicking a
  heading also scrolls the rendered preview to the matching heading.
- **Live updates** — the outline rebuilds as you type (debounced) and re-highlights
  as you move around.
- **Multiple ways to toggle** — a keyboard shortcut + Extensions menu command, and
  a floating toggle button inside the editor (see *Toggling* below).
- **Theme-aware** — the panel reads colors from the live editor theme, so it
  matches MarkEdit's light, dark, and custom themes automatically.

## Install

**Prebuilt:** copy `dist/markedit-outline.js` into MarkEdit's scripts folder:

```
~/Library/Containers/app.cyan.markedit/Data/Documents/scripts/
```

then relaunch MarkEdit.

**From source:**

```sh
npm install
npm run build     # builds dist/ and copies it into the scripts folder
npm run reload    # quit + relaunch MarkEdit to load the new build
```

See the [MarkEdit Customization guide](https://github.com/MarkEdit-app/MarkEdit/wiki/Customization)
for how user scripts are loaded.

## Toggling the sidebar

The extension exposes the toggle three ways:

1. **Keyboard shortcut** — **⇧⌘L** by default (configurable).
2. **Menu command** — *Extensions → Outline Sidebar → Toggle Outline Sidebar*.
3. **Floating button** — a small outline button inside the editor window.

> **Note on the native toolbar.** MarkEdit's toolbar uses native macOS `NSToolbar`
> items, which **cannot be added or modified through the extension (JavaScript) API**.
> The floating in-editor button is the closest an extension can get to a "toolbar
> icon" toggle; the keyboard shortcut and menu command are the API-supported
> equivalents. If you prefer a real toolbar button, that would require a change to
> the MarkEdit app itself rather than an extension.

## Configuration

Add an `outline-sidebar` object to your MarkEdit
[`settings.json`](https://github.com/MarkEdit-app/MarkEdit/wiki/Customization#advanced-settings)
(in the same `Documents` folder). All fields are optional:

```jsonc
{
  "outline-sidebar": {
    "position": "right",          // "right" | "left"
    "width": 280,                  // pixels (160–600)
    "openByDefault": false,        // open automatically when a document opens
    "showToggleButton": true,      // show the floating in-editor toggle button
    "pushEditor": true,            // shrink the content area when open so nothing hides behind the panel
    "syncPreviewScroll": true,     // also scroll the preview pane in preview mode
    "shortcut": { "key": "l", "modifiers": ["Command", "Shift"] }
  }
}
```

`shortcut.modifiers` may include `"Command"`, `"Shift"`, `"Control"`, and `"Option"`.
The default is **⇧⌘L** because ⇧⌘O is already used by MarkEdit's built-in Table of
Contents toolbar item.

## How it works

- **Headings** are read by walking CodeMirror's Lezer syntax tree for
  `ATXHeading{1..6}` / `SetextHeading{1..2}` nodes — the same approach MarkEdit uses
  internally — so `#` characters inside fenced code blocks are correctly ignored.
- **Navigation** dispatches a caret move + `EditorView.scrollIntoView` on the shared
  editor instance. Preview scrolling is best-effort and fully decoupled: it locates
  headings inside the preview's `.markdown-body`, so if the preview extension isn't
  installed (or its markup changes), editor navigation still works.
- **Making room:** in edit / side-by-side modes the editor and preview live in a CSS
  grid on `<body>`, so the panel constrains the body width; in pure preview mode the
  preview pane is an absolutely-positioned overlay, so the panel instead sets
  MarkEdit-preview's `--markedit-content-inset` variable. Both are reverted on close.
- The extension imports `markedit-api` and the `@codemirror/*` modules, which
  [`markedit-vite`](https://github.com/MarkEdit-app/MarkEdit-vite) externalizes so
  they resolve to MarkEdit's own live instances at runtime.

## Project layout

```
main.ts              Entry point: settings, menu, live-update listener, bootstrap
src/settings.ts      Read + validate settings from settings.json
src/toc.ts           Extract headings from the syntax tree
src/navigation.ts    Scroll the editor (and preview) to a heading
src/sidebar.ts       The sidebar UI: build, render, theme, open/close
src/menu.ts          Extensions-menu command + keyboard shortcut
src/styles.ts        Panel CSS (theme-driven via CSS variables)
src/icons.ts         Inline SVG icon for the toggle button
```

## License

MIT
