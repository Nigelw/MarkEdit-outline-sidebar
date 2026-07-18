# AGENTS.md

Developer and architecture notes for the MarkEdit Outline Sidebar extension. The [README](README.md) is the user-facing overview and guide; this file is for people (and agents) working on the code.

## Development

```sh
npm install
npm run build       # builds dist/ and copies it into MarkEdit's scripts folder
npm run reload      # quit + relaunch MarkEdit to load the new build
npm run typecheck   # tsc --noEmit
```

The build ([`vite.config.mts`](vite.config.mts)) uses [`markedit-vite`](https://github.com/MarkEdit-app/MarkEdit-vite), which externalizes `markedit-api` and the `@codemirror/*` / `@lezer/*` modules so they resolve to MarkEdit's own live instances at runtime, emits a single CommonJS file into `dist/`, and copies it into `~/Library/Containers/app.cyan.markedit/Data/Documents/scripts/`. It also injects `package.json`'s `version` as the `__EXTENSION_VERSION__` global (declared in [`src/globals.d.ts`](src/globals.d.ts)) for the updater.

`dist/` is **git-ignored** — the build is a published artifact, not source. Each release attaches `dist/markedit-outline.js` as an asset (see *Releases*), which is both what users download to install and what the updater fetches; there's no committed copy in the repo tree.

## How it works

- **Headings** are read by walking CodeMirror's Lezer syntax tree for `ATXHeading{1..6}` / `SetextHeading{1..2}` nodes — the same approach MarkEdit uses internally — so `#` characters inside fenced code blocks are correctly ignored.
- **Navigation** dispatches a caret move + `EditorView.scrollIntoView` on the shared editor instance. Preview scrolling is best-effort and fully decoupled: it locates headings inside the preview's `.markdown-body`, so if the preview extension isn't installed (or its markup changes), editor navigation still works.
- **Making room:** in edit / side-by-side modes the editor and preview live in a CSS grid on `<body>`, so the panel constrains the body width; in pure preview mode the preview pane is an absolutely-positioned overlay, so the panel instead sets MarkEdit-preview's `--markedit-content-inset` variable. Both are reverted on close.
- **The toolbar button** is not injected by the extension (the API can't touch the native toolbar directly). Instead the extension writes an `editor.customToolbarItems` entry into `settings.json`; MarkEdit turns that into a native `NSToolbarItem` whose click looks up our menu command by title (`NSApp.mainMenu.firstActionNamed`) and performs it. This is the same mechanism used by [markedit-direct-preview](https://github.com/Squarelight-ai/markedit-direct-preview).
- **The updater** ([`src/updater.ts`](src/updater.ts)) runs on `onAppReady` (throttled to once a week via `localStorage`) and on demand from the menu. It fetches `releases/latest` from the GitHub API, compares the release tag against the baked-in `__EXTENSION_VERSION__` (a small semver compare), and — per the `update` setting — installs silently, prompts, or does nothing. Installing finds the release asset named `markedit-outline.js` (`UPDATE_ASSET_NAME`), downloads it from the asset's `browser_download_url`, and overwrites the running script file (`__FILE_PATH__`) via `MarkEdit.createFile` (Method B). Skipped versions are remembered in `localStorage`. See the *Releases* section for the server-side contract this depends on.

## Project layout

```
main.ts              Entry point: settings, menu, updater kickoff, live-update listener, bootstrap
src/settings.ts      Read + validate settings from settings.json
src/toc.ts           Extract headings from the syntax tree
src/navigation.ts    Scroll the editor (and preview) to a heading
src/sidebar.ts       The sidebar UI: build, render, theme, open/close
src/menu.ts          Extensions-menu commands + keyboard shortcut
src/toolbar.ts       Add / remove the native toolbar item via settings.json
src/position.ts      Change the docked side via settings.json
src/highlight.ts     Switch the highlight mode (scroll / caret) live + persist it
src/settingsFile.ts  Read / write settings.json (shared)
src/updater.ts       Check GitHub releases and self-install new builds
src/constants.ts     Shared constants (command title, settings namespace, storage keys, repo/update URLs)
src/globals.d.ts     Ambient declaration for the build-injected __EXTENSION_VERSION__
src/styles.ts        Panel CSS (theme-driven via CSS variables)
```

## Releases

Releases are cut with the **`release` skill** (`.claude/skills/release/SKILL.md`) — run `/release` (or ask Claude Code to "cut a release"). It bumps the version, updates the `CHANGELOG.md`, rebuilds, commits, tags `vX.Y.Z`, pushes, and publishes a GitHub release **with `dist/markedit-outline.js` attached as an asset**.

The updater uses **Method B**: it downloads the release asset named `markedit-outline.js` (via its `browser_download_url` from the `releases/latest` API response). For a release to be installable, **all of these must agree**:

1. `package.json` `version` = the new version (baked into the bundle at build time).
2. `dist/markedit-outline.js` is freshly rebuilt from that version.
3. The `vX.Y.Z` release has a `markedit-outline.js` asset that is exactly that freshly-built bundle.

The repo must stay **public** for the unauthenticated GitHub API / asset fetches to work. The skill enforces these invariants; see its steps and gotchas for details.

## License

MIT
