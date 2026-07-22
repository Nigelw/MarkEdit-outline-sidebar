/**
 * Title of the "toggle" menu command. It is used in two places that must stay
 * in sync: as the `addMainMenuItem` title, and as the `actionName` of the
 * native toolbar item — MarkEdit binds a toolbar item to a menu command by
 * matching this exact string (`NSApp.mainMenu.firstActionNamed`).
 */
export const TOGGLE_ACTION_TITLE = 'Toggle Outline Sidebar';

/**
 * settings.json key holding this extension's settings. The `extension.` prefix
 * is required by MarkEdit's settings schema (which only allows extension keys
 * matching `^extension\.`).
 */
export const SETTINGS_NAMESPACE = 'extension.markeditOutlineSidebar';

/**
 * localStorage key used to remember whether the sidebar was open, so the state
 * survives app relaunches. WKWebView localStorage persists across launches in
 * MarkEdit (the same mechanism MarkEdit-preview uses for its view mode).
 */
export const VISIBLE_STORAGE_KEY = 'markedit-outline.visible';

/** localStorage key remembering the width the user dragged the sidebar to. */
export const WIDTH_STORAGE_KEY = 'markedit-outline.width';

/**
 * GitHub repo hosting this extension's releases, in `owner/repo` form. Used to
 * build the update-check URL below. Keep this in sync with the actual repo the
 * releases live in.
 */
export const GITHUB_REPO = 'Nigelw/MarkEdit-outline-sidebar';

/** Human-facing GitHub project page, linked from the Extensions menu. */
export const REPO_URL = `https://github.com/${GITHUB_REPO}`;

/** Human-facing changelog page, linked from the Extensions menu. */
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;

/** GitHub API endpoint returning the metadata of the latest published release. */
export const LATEST_RELEASE_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

/**
 * Name of the release asset the updater downloads and installs — the built
 * script, matching `package.json`'s `name` + `.js`. Each release must attach an
 * asset with exactly this filename (the release skill uploads `dist/<file>`).
 */
export const UPDATE_ASSET_NAME = 'markedit-outline.js';

/** localStorage key holding the epoch-ms timestamp of the last update check. */
export const LAST_CHECK_STORAGE_KEY = 'markedit-outline.updater.last-check';

/** localStorage key holding a JSON array of release tags the user chose to skip. */
export const SKIPPED_VERSIONS_STORAGE_KEY = 'markedit-outline.updater.skipped';
