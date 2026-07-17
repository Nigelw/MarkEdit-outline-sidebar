import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import type { Heading } from './toc';

/**
 * Navigate to a heading. The editor caret is moved and the editor is scrolled to
 * the heading — so switching to edit mode lands there — and, when a MarkEdit-
 * preview pane is visible, its matching heading is highlighted.
 *
 * How the preview pane is moved depends on MarkEdit-preview's scroll-sync:
 * - Sync ON (the default): its editor→preview sync moves the preview for us. We
 *   deliberately do NOT scroll the preview ourselves — and since the editor
 *   scroll is idempotent, clicking the same item again doesn't move the editor,
 *   so no scroll event fires, the sync doesn't re-run, and the viewport stays put.
 * - Sync OFF: nothing else moves the preview, so we scroll it ourselves,
 *   idempotently (no sync to fight, so repeat clicks stay stable).
 */
export function goToHeading(headings: Heading[], index: number, syncPreview: boolean): void {
  const heading = headings[index];
  if (heading === undefined) {
    return;
  }

  const view = MarkEdit.editorView;
  const pos = Math.max(0, Math.min(heading.from, view.state.doc.length));

  view.dispatch({
    selection: EditorSelection.cursor(pos),
    effects: EditorView.scrollIntoView(pos, { y: 'start', yMargin: 8 }),
  });

  // Don't steal focus into the editor while it's hidden behind the preview overlay.
  if (!isPreviewOverlayActive()) {
    view.focus();
  }

  if (syncPreview) {
    const target = findPreviewHeading(headings, index);
    if (target !== undefined) {
      // When MarkEdit-preview's scroll-sync is off it won't move the preview to
      // follow the editor, so scroll it ourselves. When it's on, leave the
      // preview to the sync (scrolling it here too would fight it).
      if (!isPreviewScrollSyncEnabled()) {
        document.querySelectorAll<HTMLElement>('.markdown-body span.meo-flash').forEach(unwrapSpan);
        alignPreviewHeading(target);
      }
      flashElement(target);
    }
  }
}

function isPreviewOverlayActive(): boolean {
  const overlay = document.querySelector<HTMLElement>('.markdown-body.overlay');
  return overlay !== null && isDisplayed(overlay);
}

/**
 * Whether MarkEdit-preview's editor→preview scroll synchronization is enabled.
 * Mirrors MarkEdit-preview's own reading of `extension.markeditPreview.syncScroll`,
 * which defaults to `true` and is only off when explicitly set to `false`.
 */
function isPreviewScrollSyncEnabled(): boolean {
  try {
    const root = MarkEdit.userSettings?.['extension.markeditPreview'];
    if (root !== null && typeof root === 'object') {
      const value = (root as Record<string, unknown>).syncScroll;
      if (typeof value === 'boolean') {
        return value;
      }
    }
  } catch {
    // userSettings unavailable; assume the default (enabled).
  }
  return true;
}

/**
 * Align a heading to the top of the preview pane by setting the scroll
 * container's `scrollTop` directly. Unlike `scrollIntoView`, this is idempotent:
 * clicking the same outline item again computes the same target and only moves
 * when it actually differs, so the viewport stays put on repeat clicks.
 */
function alignPreviewHeading(target: HTMLElement): void {
  const container = getScrollContainer(target);
  if (container === undefined) {
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    return;
  }

  const margin = 8;
  const current = container.scrollTop;
  const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
  const maxScroll = container.scrollHeight - container.clientHeight;
  const desired = Math.max(0, Math.min(maxScroll, Math.round(current + offset - margin)));

  // Only scroll when the target isn't already aligned (>1px guards sub-pixel jitter).
  if (Math.abs(desired - current) > 1) {
    container.scrollTop = desired;
  }
}

function getScrollContainer(el: HTMLElement): HTMLElement | undefined {
  let node = el.parentElement;
  while (node !== null && node !== document.body) {
    const overflowY = getComputedStyle(node).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return undefined;
}

function findPreviewHeading(headings: Heading[], index: number): HTMLElement | undefined {
  const previewHeadings = getVisiblePreviewHeadings();
  if (previewHeadings.length === 0) {
    return undefined;
  }
  // Preferred: 1:1 positional match (TOC order == rendered order).
  if (previewHeadings.length === headings.length) {
    return previewHeadings[index];
  }
  // Fallback: match on normalized heading text.
  const wanted = normalize(headings[index].title);
  return previewHeadings.find((el) => normalize(el.textContent ?? '') === wanted);
}

/**
 * Briefly highlight a heading's text. The heading's inline content is wrapped
 * in a span so the highlight hugs the text rather than filling the full-width
 * block — and so it leaves the heading's underline rule (a border on the block)
 * untouched. The wrapper is removed once the animation finishes.
 */
function flashElement(el: HTMLElement): void {
  // Clear any in-progress flash on this element first (restart on re-click).
  unwrapFlashes(el);

  const span = document.createElement('span');
  span.className = 'meo-flash';
  while (el.firstChild !== null) {
    span.appendChild(el.firstChild);
  }
  el.appendChild(span);

  const done = () => {
    span.removeEventListener('animationend', done);
    unwrapSpan(span);
  };
  span.addEventListener('animationend', done);
}

function unwrapFlashes(el: HTMLElement): void {
  el.querySelectorAll<HTMLElement>(':scope > span.meo-flash').forEach(unwrapSpan);
}

function unwrapSpan(span: HTMLElement): void {
  const parent = span.parentElement;
  if (parent === null) {
    return;
  }
  while (span.firstChild !== null) {
    parent.insertBefore(span.firstChild, span);
  }
  span.remove();
}

function getVisiblePreviewHeadings(): HTMLElement[] {
  const selector = '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6';
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return nodes.filter(isDisplayed);
}

function isDisplayed(el: HTMLElement): boolean {
  return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}
