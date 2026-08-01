# AGENTS.md

Developer and architecture notes for the MarkEdit Outline Sidebar extension. The [README](README.md) is the user-facing overview and guide; this file is for people (and agents) working on the code.

## Development

```sh
npm install
npm run build       # builds dist/ and copies it into MarkEdit's scripts folder
npm run reload      # quit + relaunch MarkEdit to load the new build
npm run typecheck   # tsc --noEmit
```

The build ([`vite.config.mts`](vite.config.mts)) uses [`markedit-vite`](https://github.com/MarkEdit-app/MarkEdit-vite), which externalizes `markedit-api` and the `@codemirror/*` / `@lezer/*` modules so they resolve to MarkEdit's own live instances at runtime, emits a single CommonJS file into `dist/`, and copies it into `~/Library/Containers/app.cyan.markedit/Data/Documents/scripts/`.

`dist/markedit-outline.js` is committed with every release. This gives the official extension registry an immutable, tag-pinned raw-GitHub URL to hash and install. MarkEdit's Extension Manager handles installed users' updates from that registry.

## How it works

- **Headings** are read by walking CodeMirror's Lezer syntax tree for `ATXHeading{1..6}` / `SetextHeading{1..2}` nodes — the same approach MarkEdit uses internally — so `#` characters inside fenced code blocks are correctly ignored.
- **Navigation** dispatches a caret move + `EditorView.scrollIntoView` on the shared editor instance. Preview scrolling is best-effort and fully decoupled: it locates headings inside the preview's `.markdown-body`, so if the preview extension isn't installed (or its markup changes), editor navigation still works.
- **Making room:** in edit / side-by-side modes the editor and preview live in a CSS grid on `<body>`, so the panel constrains the body width; in pure preview mode the preview pane is an absolutely-positioned overlay, so the panel instead sets MarkEdit-preview's `--markedit-content-inset` variable. Both are reverted on close.
- **The toolbar button** is not injected by the extension (the API can't touch the native toolbar directly). Instead the extension writes an `editor.customToolbarItems` entry into `settings.json`; MarkEdit turns that into a native `NSToolbarItem` whose click looks up our menu command by title (`NSApp.mainMenu.firstActionNamed`) and performs it. This is the same mechanism used by [markedit-direct-preview](https://github.com/Squarelight-ai/markedit-direct-preview).
- **Updates** are centrally managed by MarkEdit's Extension Manager. This extension does not fetch releases, write its own script file, or expose update settings.

## Project layout

```
main.ts              Entry point: settings, menu, live-update listener, bootstrap
src/settings.ts      Read + validate settings from settings.json
src/toc.ts           Extract headings from the syntax tree
src/navigation.ts    Scroll the editor (and preview) to a heading
src/sidebar.ts       The sidebar UI: build, render, theme, open/close
src/menu.ts          Extensions-menu commands + keyboard shortcut
src/toolbar.ts       Add / remove the native toolbar item via settings.json
src/position.ts      Change the docked side live + persist it via settings.json
src/highlight.ts     Switch the highlight mode (scroll / caret) live + persist it
src/settingsFile.ts  Read / write settings.json (shared)
src/constants.ts     Shared constants (command title, settings namespace, storage keys, project URLs)
src/globals.d.ts     Ambient declarations for MarkEdit's runtime globals
src/styles.ts        Panel CSS (theme-driven via CSS variables)
```

## Releases

Releases are cut with the **`release` skill** (`.agents/skills/release/SKILL.md`) — run `/release` (or ask Claude Code to "cut a release"). It bumps the version, updates the `CHANGELOG.md`, rebuilds, commits the freshly built `dist/markedit-outline.js`, tags `vX.Y.Z`, pushes, and publishes a GitHub release.

For a release to be installable from the official registry, **all of these must agree**:

1. `package.json` `version` = the new version recorded in the registry entry.
2. `dist/markedit-outline.js` is freshly rebuilt from that version.
3. The `vX.Y.Z` tag contains that exact committed bundle, available at `raw.githubusercontent.com`.

The repo must stay **public** for unauthenticated raw-file fetches to work. After each release, update the official registry entry with the tag-pinned raw URL and its SHA-256. The skill enforces these invariants; see its steps and gotchas for details.

## License

MIT
