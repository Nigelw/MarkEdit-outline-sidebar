/**
 * All styling for the outline sidebar. Colors are driven by CSS variables that
 * are populated at runtime from the live editor theme (see `sidebar.ts`), so the
 * panel automatically matches MarkEdit's light / dark / custom themes.
 */
export const STYLE_ELEMENT_ID = 'markedit-outline-styles';

export const CSS = `
.meo-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: var(--meo-width, 280px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 2147483000;
  background: var(--meo-bg, #ffffff);
  color: var(--meo-fg, #1a1a1a);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.35;
  -webkit-user-select: none;
  user-select: none;
  transition: transform 180ms ease;
  will-change: transform;
}
.meo-sidebar[data-position="right"] {
  right: 0;
  border-left: 1px solid var(--meo-border, rgba(127, 127, 127, 0.25));
  box-shadow: -6px 0 18px rgba(0, 0, 0, 0.12);
  transform: translateX(100%);
}
.meo-sidebar[data-position="left"] {
  left: 0;
  border-right: 1px solid var(--meo-border, rgba(127, 127, 127, 0.25));
  box-shadow: 6px 0 18px rgba(0, 0, 0, 0.12);
  transform: translateX(-100%);
}
.meo-sidebar.meo-open {
  transform: translateX(0);
}

.meo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px 14px;
  flex: 0 0 auto;
}
.meo-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
}
.meo-close {
  appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.55;
  cursor: pointer;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.meo-close:hover {
  opacity: 1;
  background: var(--meo-hover, rgba(127, 127, 127, 0.16));
}

.meo-list {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2px 6px 12px 6px;
}
.meo-item {
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 2px solid transparent;
}
.meo-item:hover {
  background: var(--meo-hover, rgba(127, 127, 127, 0.16));
}
.meo-item.meo-active {
  background: var(--meo-active-bg, rgba(0, 122, 255, 0.14));
  border-left-color: var(--meo-accent, AccentColor);
  font-weight: 600;
}
.meo-item[data-level="1"] { padding-left: 8px; font-weight: 600; }
.meo-item[data-level="2"] { padding-left: 20px; }
.meo-item[data-level="3"] { padding-left: 32px; }
.meo-item[data-level="4"] { padding-left: 44px; opacity: 0.92; }
.meo-item[data-level="5"] { padding-left: 56px; opacity: 0.85; }
.meo-item[data-level="6"] { padding-left: 68px; opacity: 0.8; }
.meo-item.meo-active[data-level] { opacity: 1; }

.meo-empty {
  padding: 16px 16px;
  opacity: 0.5;
  font-style: italic;
}

.meo-toggle {
  position: fixed;
  top: 8px;
  z-index: 2147483001;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid var(--meo-border, rgba(127, 127, 127, 0.25));
  background: var(--meo-bg, #ffffff);
  color: var(--meo-fg, #1a1a1a);
  opacity: 0.8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transition: opacity 120ms ease, right 180ms ease, left 180ms ease;
}
.meo-toggle:hover {
  opacity: 1;
}
.meo-toggle svg {
  width: 16px;
  height: 16px;
  display: block;
}
`;
