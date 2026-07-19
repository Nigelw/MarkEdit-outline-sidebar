import { MarkEdit } from 'markedit-api';
import { SETTINGS_NAMESPACE } from './constants';

export type KeyModifier = 'Shift' | 'Control' | 'Command' | 'Option';

/** Which edge the sidebar is docked to. */
export type Position = 'left' | 'right';

/**
 * What drives the highlighted outline item:
 * - `scroll`: the section currently in view (the visible viewport in every mode)
 * - `insertionPoint`: the section the editor cursor is in, even when preview is visible
 */
export type HighlightMode = 'scroll' | 'insertionPoint';

/**
 * What the sidebar does on launch:
 * - `remember`: restore the last open/closed state (closed on a fresh install)
 * - `open`: always start open
 * - `closed`: always start closed
 */
export type LaunchBehavior = 'remember' | 'open' | 'closed';

/**
 * How the extension handles a newer release on GitHub:
 * - `automatic`: download and install it silently, then prompt to restart
 * - `notify`: ask before downloading (default)
 * - `never`: don't check for updates at all
 */
export type UpdateBehavior = 'automatic' | 'notify' | 'never';

export interface Shortcut {
  key: string;
  modifiers: KeyModifier[];
}

export interface OutlineSettings {
  /** Which edge the sidebar is docked to. */
  position: Position;
  /** Whether the sidebar is shown on launch: remember last state, always open, or always closed. */
  onLaunch: LaunchBehavior;
  /** What drives the highlighted item: the visible section (`scroll`) or the cursor (`insertionPoint`). */
  highlightMode: HighlightMode;
  /** Keyboard shortcut for the "Toggle Outline Sidebar" menu command. */
  shortcut: Shortcut;
  /** How automatic update checking behaves. */
  update: UpdateBehavior;
}

const UPDATE_BEHAVIORS: UpdateBehavior[] = ['automatic', 'notify', 'never'];

const DEFAULTS: OutlineSettings = {
  position: 'right',
  onLaunch: 'remember',
  highlightMode: 'scroll',
  // ⇧⌘L by default — the native Table of Contents already uses ⇧⌘O.
  shortcut: { key: 'l', modifiers: ['Command', 'Shift'] },
  update: 'notify',
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
    const value = MarkEdit.userSettings?.[SETTINGS_NAMESPACE];
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
    highlightMode: raw.highlightMode === 'insertionPoint' ? 'insertionPoint' : DEFAULTS.highlightMode,
    shortcut,
    update: UPDATE_BEHAVIORS.includes(raw.update as UpdateBehavior) ? (raw.update as UpdateBehavior) : DEFAULTS.update,
  };
}
