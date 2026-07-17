import { MarkEdit } from 'markedit-api';
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import type { Heading } from './toc';

/**
 * Navigate to a heading. The editor caret is always moved and scrolled to the
 * heading; when a MarkEdit-preview pane is visible (preview / side-by-side
 * view modes) the corresponding rendered heading is scrolled into view too.
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

  // Only steal focus when the editor is actually on screen.
  if (isEditorVisible(view)) {
    view.focus();
  }

  if (syncPreview) {
    scrollPreviewToHeading(headings, index);
  }
}

function isEditorVisible(view: EditorView): boolean {
  return view.scrollDOM.clientHeight > 0 && view.scrollDOM.clientWidth > 0;
}

/**
 * Best-effort scrolling of the MarkEdit-preview pane. This intentionally makes
 * no hard assumptions about preview internals: if the preview isn't installed
 * or its DOM differs, nothing happens and the editor navigation still works.
 */
function scrollPreviewToHeading(headings: Heading[], index: number): void {
  try {
    const previewHeadings = getVisiblePreviewHeadings();
    if (previewHeadings.length === 0) {
      return;
    }

    let target: HTMLElement | undefined;

    // Preferred: 1:1 positional match (TOC order == rendered order).
    if (previewHeadings.length === headings.length) {
      target = previewHeadings[index];
    }

    // Fallback: match on normalized heading text.
    if (target === undefined) {
      const wanted = normalize(headings[index].title);
      target = previewHeadings.find((el) => normalize(el.textContent ?? '') === wanted);
    }

    if (target !== undefined) {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
      flashElement(target);
    }
  } catch {
    // Never let preview handling break navigation.
  }
}

/** Briefly highlight an element (restartable on repeated clicks). */
function flashElement(el: HTMLElement): void {
  el.classList.remove('meo-flash');
  // Force reflow so re-adding the class restarts the animation.
  void el.offsetWidth;
  el.classList.add('meo-flash');
  const clear = () => {
    el.classList.remove('meo-flash');
    el.removeEventListener('animationend', clear);
  };
  el.addEventListener('animationend', clear);
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
