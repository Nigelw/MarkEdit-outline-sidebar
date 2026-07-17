import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import type { Heading } from './toc';

/**
 * Navigate to a heading. The editor caret is moved and the editor is scrolled to
 * the heading — so switching to edit mode lands there — and, when a MarkEdit-
 * preview pane is visible, its matching heading is highlighted.
 *
 * The preview is moved by MarkEdit-preview's own editor→preview scroll-sync (we
 * deliberately do NOT scroll it ourselves). Because the editor scroll is
 * idempotent, clicking the same item again doesn't move the editor, so no scroll
 * event fires, the sync doesn't re-run, and the preview viewport stays put.
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
      flashElement(target);
    }
  }
}

function isPreviewOverlayActive(): boolean {
  const overlay = document.querySelector<HTMLElement>('.markdown-body.overlay');
  return overlay !== null && isDisplayed(overlay);
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
