import { MarkEdit } from 'markedit-api';

export type KeyModifier = 'Shift' | 'Control' | 'Command' | 'Option';

export interface Shortcut {
  key: string;
  modifiers: KeyModifier[];
}

export interface OutlineSettings {
  /** Which edge the sidebar is docked to. */
  position: 'left' | 'right';
  /** Sidebar width in pixels. */
  width: number;
  /** Open the sidebar automatically when a document opens. */
  openByDefault: boolean;
  /** Shrink the content area when the sidebar is open so nothing is hidden behind it. */
  pushEditor: boolean;
  /** Also scroll the MarkEdit-preview pane (when in preview / side-by-side mode). */
  syncPreviewScroll: boolean;
  /** Keyboard shortcut for the "Toggle Outline Sidebar" menu command. */
  shortcut: Shortcut;
}

const DEFAULTS: OutlineSettings = {
  position: 'right',
  width: 280,
  openByDefault: false,
  pushEditor: true,
  syncPreviewScroll: true,
  // ⇧⌘L by default — the native Table of Contents already uses ⇧⌘O.
  shortcut: { key: 'l', modifiers: ['Command', 'Shift'] },
};

const VALID_MODIFIERS: KeyModifier[] = ['Shift', 'Control', 'Command', 'Option'];

/**
 * Load settings from `settings.json` under the `outline-sidebar` key, falling
 * back to sensible defaults. Every field is validated so a malformed setting
 * can never break the extension.
 */
export function loadSettings(): OutlineSettings {
  let raw: Record<string, unknown> = {};
  try {
    const value = MarkEdit.userSettings?.['outline-sidebar'];
    if (value && typeof value === 'object') {
      raw = value as Record<string, unknown>;
    }
  } catch {
    // userSettings may be unavailable; use defaults.
  }

  const shortcut = (() => {
    const s = raw.shortcut;
    if (!s || typeof s !== 'object') {
      return DEFAULTS.shortcut;
    }
    const candidate = s as Record<string, unknown>;
    const key = typeof candidate.key === 'string' && candidate.key.length > 0 ? candidate.key : DEFAULTS.shortcut.key;
    const modifiers = Array.isArray(candidate.modifiers)
      ? candidate.modifiers.filter((m): m is KeyModifier => VALID_MODIFIERS.includes(m as KeyModifier))
      : DEFAULTS.shortcut.modifiers;
    return { key, modifiers: modifiers.length > 0 ? modifiers : DEFAULTS.shortcut.modifiers };
  })();

  return {
    position: raw.position === 'left' ? 'left' : DEFAULTS.position,
    width: clampNumber(raw.width, 160, 600, DEFAULTS.width),
    openByDefault: asBoolean(raw.openByDefault, DEFAULTS.openByDefault),
    pushEditor: asBoolean(raw.pushEditor, DEFAULTS.pushEditor),
    syncPreviewScroll: asBoolean(raw.syncPreviewScroll, DEFAULTS.syncPreviewScroll),
    shortcut,
  };
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}
