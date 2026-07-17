import { MarkEdit } from 'markedit-api';

export type KeyModifier = 'Shift' | 'Control' | 'Command' | 'Option';

/**
 * What the sidebar does on launch:
 * - `remember`: restore the last open/closed state (closed on a fresh install)
 * - `open`: always start open
 * - `closed`: always start closed
 */
export type LaunchBehavior = 'remember' | 'open' | 'closed';

export interface Shortcut {
  key: string;
  modifiers: KeyModifier[];
}

export interface OutlineSettings {
  /** Which edge the sidebar is docked to. */
  position: 'left' | 'right';
  /** Whether the sidebar is shown on launch: remember last state, always open, or always closed. */
  onLaunch: LaunchBehavior;
  /** Keyboard shortcut for the "Toggle Outline Sidebar" menu command. */
  shortcut: Shortcut;
}

const DEFAULTS: OutlineSettings = {
  position: 'right',
  onLaunch: 'remember',
  // ⇧⌘L by default — the native Table of Contents already uses ⇧⌘O.
  shortcut: { key: 'l', modifiers: ['Command', 'Shift'] },
};

const VALID_MODIFIERS: KeyModifier[] = ['Shift', 'Control', 'Command', 'Option'];

/**
 * Load settings from `settings.json` under the `extension.markeditOutlineSidebar`
 * key, falling back to sensible defaults. Every field is validated so a malformed
 * setting can never break the extension.
 *
 * The `extension.` prefix is required by MarkEdit's settings schema, which only
 * allows extension settings under keys matching `^extension\.`.
 */
export function loadSettings(): OutlineSettings {
  let raw: Record<string, unknown> = {};
  try {
    const value = MarkEdit.userSettings?.['extension.markeditOutlineSidebar'];
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
    onLaunch: raw.onLaunch === 'open' || raw.onLaunch === 'closed' ? raw.onLaunch : DEFAULTS.onLaunch,
    shortcut,
  };
}
