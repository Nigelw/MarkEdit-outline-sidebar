import { ensureSyntaxTree, syntaxTree } from '@codemirror/language';
import type { EditorState } from '@codemirror/state';
import type { SyntaxNodeRef, Tree } from '@lezer/common';

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

export interface HeadingExtraction {
  headings: Heading[];
  truncated: boolean;
}

const HEADING_NODE = /^(?:ATX|Setext)Heading([1-6])$/;
export const MAX_HEADINGS = 1000;

/**
 * Extract the table of contents from the document by walking the CodeMirror /
 * Lezer syntax tree. Using the syntax tree (rather than a regular expression
 * over the raw text) means `#` characters inside fenced code blocks, comments,
 * etc. are correctly ignored. This mirrors how MarkEdit computes its own TOC.
 */
export function extractHeadings(state: EditorState): HeadingExtraction {
  const tree = ensureSyntaxTree(state, state.doc.length, 300);
  const parsedToEnd = tree !== null;

  return extractSyntaxTreeHeadings(state, parsedToEnd ? tree : syntaxTree(state), parsedToEnd);
}

function extractSyntaxTreeHeadings(state: EditorState, tree: Tree, parsedToEnd: boolean): HeadingExtraction {
  const headings: Heading[] = [];
  let truncated = !parsedToEnd;

  tree.iterate({
    from: 0,
    to: state.doc.length,
    enter: (node) => {
      if (headings.length >= MAX_HEADINGS) {
        truncated = true;
        return false;
      }

      const heading = headingFromNode(state, node);
      if (heading === undefined) {
        return;
      }

      headings.push(heading);
    },
  });

  return { headings, truncated };
}

function headingFromNode(state: EditorState, node: SyntaxNodeRef): Heading | undefined {
  const match = HEADING_NODE.exec(node.name);
  if (match === null) {
    return undefined;
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

  return {
    title: title.length > 0 ? title : '(untitled)',
    level: parseInt(match[1], 10),
    from: node.from,
    to: node.to,
  };
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
