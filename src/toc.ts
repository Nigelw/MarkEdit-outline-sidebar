import { syntaxTree, ensureSyntaxTree } from '@codemirror/language';
import type { EditorState } from '@codemirror/state';

export interface Heading {
  /** Display text of the heading, with the leading `#`s stripped. */
  title: string;
  /** Heading level, 1–6. */
  level: number;
  /** Start position of the heading node in the document. */
  from: number;
  /** End position of the heading node in the document. */
  to: number;
}

const HEADING_NODE = /^(?:ATX|Setext)Heading([1-6])$/;

/**
 * Extract the table of contents from the document by walking the CodeMirror /
 * Lezer syntax tree. Using the syntax tree (rather than a regular expression
 * over the raw text) means `#` characters inside fenced code blocks, comments,
 * etc. are correctly ignored. This mirrors how MarkEdit computes its own TOC.
 */
export function extractHeadings(state: EditorState): Heading[] {
  // Prefer a fully parsed tree; fall back to the (possibly partial) cached tree
  // if parsing the whole document would take too long on very large files.
  const tree = ensureSyntaxTree(state, state.doc.length, 300) ?? syntaxTree(state);
  const headings: Heading[] = [];

  tree.iterate({
    from: 0,
    to: state.doc.length,
    enter: (node) => {
      const match = HEADING_NODE.exec(node.name);
      if (match === null) {
        return;
      }

      const raw = state.sliceDoc(node.from, node.to);
      const isSetext = node.name.startsWith('Setext');
      let title: string;

      if (isSetext) {
        // Setext headings span two lines (text + underline); keep the first line.
        title = raw.split(state.lineBreak)[0].trim();
      } else {
        // ATX: strip up to 3 leading spaces + `#`s, and any optional trailing `#`s.
        title = raw
          .replace(/^\s{0,3}#+\s+/, '')
          .replace(/\s+#+\s*$/, '')
          .trim();
      }

      headings.push({
        title: title.length > 0 ? title : '(untitled)',
        level: parseInt(match[1], 10),
        from: node.from,
        to: node.to,
      });
    },
  });

  return headings;
}

/**
 * Index of the heading whose section currently contains `selectionHead`, or -1
 * if the caret sits above the first heading. Headings are assumed to be in
 * document order.
 */
export function activeHeadingIndex(headings: Heading[], selectionHead: number): number {
  let active = -1;
  for (let i = 0; i < headings.length; i++) {
    if (selectionHead >= headings[i].from) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}
