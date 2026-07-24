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
  background: var(--meo-bg, #fafafa);
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
  transform: translateX(100%);
}
.meo-sidebar[data-position="left"] {
  left: 0;
  transform: translateX(-100%);
}
.meo-sidebar.meo-open {
  transform: translateX(0);
}

/*
 * MarkEdit draws its active-line indicator (a CodeMirror layer, .cm-md-activeLine)
 * with viewport-based coordinates that assume the editor starts at the window's
 * left edge. A LEFT-docked sidebar shifts the editor right (body margin-left), so
 * the layer over-offsets by exactly the sidebar width — the indicator ends up
 * drawn only on the right, sized by the shift. Translate the layer back by that
 * width to restore a full-width indicator. (Right-docked doesn't move the body's
 * left edge, so it's unaffected and this rule never applies.)
 */
html.meo-push-left .cm-md-activeLine {
  transform: translateX(calc(-1 * var(--meo-width, 0px)));
}

.meo-header {
  display: flex;
  align-items: center;
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
}
.meo-item:hover {
  background: var(--meo-hover, #f0f0f0);
}
.meo-item.meo-active {
  background: var(--meo-active-bg, #e8e8e8);
  background: color-mix(in srgb, var(--meo-accent, AccentColor) var(--meo-active-accent-mix, 18%), var(--meo-bg, #fafafa));
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
.meo-notice {
  flex: 0 0 auto;
  margin: 0 10px 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--meo-hover, #f0f0f0);
  color: inherit;
  font-size: 12px;
  opacity: 0.72;
}

/* Drag handle straddling the sidebar's inner edge, for resizing. */
.meo-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 9px;
  z-index: 2;
  cursor: col-resize;
}
.meo-sidebar:not(.meo-open) .meo-resizer {
  display: none;
}
.meo-sidebar[data-position="right"] .meo-resizer { left: -4px; }
.meo-sidebar[data-position="left"] .meo-resizer { right: -4px; }
.meo-resizer::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: transparent;
  transition: background 120ms ease;
}
.meo-sidebar[data-position="right"] .meo-resizer::after { left: 3px; }
.meo-sidebar[data-position="left"] .meo-resizer::after { right: 3px; }
.meo-resizer:hover::after,
.meo-resizer.meo-dragging::after {
  background: var(--meo-accent, AccentColor);
}

/* Brief highlight + subtle bounce flashed on the matching preview heading. */
@keyframes meo-flash {
  0%   { background-color: var(--meo-flash, rgba(255, 209, 71, 0.6)); transform: scale(1); }
  12%  { transform: scale(1.04); }
  28%  { transform: scale(0.99); }
  40%  { transform: scale(1); }
  100% { background-color: transparent; transform: scale(1); }
}
.meo-flash {
  display: inline-block;
  padding: 0 0.25em;
  margin: 0 -0.25em;
  border-radius: 4px;
  animation: meo-flash 1.2s ease-out;
  transform-origin: left center;
}
`;
