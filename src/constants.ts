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
