/**
 * Title of the "toggle" menu command. It is used in two places that must stay
 * in sync: as the `addMainMenuItem` title, and as the `actionName` of the
 * native toolbar item — MarkEdit binds a toolbar item to a menu command by
 * matching this exact string (`NSApp.mainMenu.firstActionNamed`).
 */
export const TOGGLE_ACTION_TITLE = 'Toggle Outline Sidebar';

/**
 * localStorage key used to remember whether the sidebar was open, so the state
 * survives app relaunches. WKWebView localStorage persists across launches in
 * MarkEdit (the same mechanism MarkEdit-preview uses for its view mode).
 */
export const VISIBLE_STORAGE_KEY = 'markedit-outline.visible';
