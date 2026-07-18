import { MarkEdit } from 'markedit-api';
import { extractHeadings, activeHeadingIndex, type Heading } from './toc';
import { goToHeading, activePreviewHeadingIndex } from './navigation';
import { CSS, STYLE_ELEMENT_ID } from './styles';
import { VISIBLE_STORAGE_KEY, WIDTH_STORAGE_KEY } from './constants';
import type { OutlineSettings } from './settings';

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 160;

export class OutlineSidebar {
  private readonly settings: OutlineSettings;

  private mounted = false;
  private opened = false;
  private width: number;

  private root!: HTMLElement;
  private list!: HTMLElement;
  private empty!: HTMLElement;
  private resizer!: HTMLElement;

  private headings: Heading[] = [];
  private items: HTMLElement[] = [];
  private activeIndex = -1;

  private readonly scrollHandler = (event: Event) => this.onDocumentScroll(event);
  private spyScheduled = false;

  constructor(settings: OutlineSettings) {
    this.settings = settings;
    this.width = DEFAULT_WIDTH;
  }

  /** Build the DOM and attach it to the document. Safe to call more than once. */
  mount(): void {
    if (this.mounted) {
      return;
    }
    this.mounted = true;

    this.injectStyles();
    this.buildSidebar();

    // Restore a width the user previously dragged to, overriding the default.
    const storedWidth = readStoredWidth();
    if (storedWidth !== undefined) {
      this.setWidth(storedWidth, false);
    }

    this.applyTheme();
    // A theme extension may repaint the editor asynchronously after the OS
    // appearance flips (e.g. markedit-theme-basic defers its restyle ~200ms),
    // so a single synchronous read here would capture the pre-switch colors.
    // Poll until the editor's background matches the new appearance instead.
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.repollTheme());
  }

  isOpen(): boolean {
    return this.opened;
  }

  /** Whether the sidebar should be open on launch, per the `onLaunch` setting. */
  shouldStartOpen(): boolean {
    switch (this.settings.onLaunch) {
      case 'open':
        return true;
      case 'closed':
        return false;
      case 'remember':
        return readStoredVisibility() ?? false;
    }
  }

  open(): void {
    if (!this.mounted || this.opened) {
      return;
    }
    this.opened = true;
    this.applyTheme();
    this.refresh();
    this.root.classList.add('meo-open');
    this.pushEditor(true);
    // Capture phase so we catch scroll from the preview's own container, which
    // doesn't bubble. Passive: we never call preventDefault.
    document.addEventListener('scroll', this.scrollHandler, { capture: true, passive: true });
    this.persistVisibility();
  }

  close(): void {
    if (!this.mounted || !this.opened) {
      return;
    }
    this.opened = false;
    this.root.classList.remove('meo-open');
    this.pushEditor(false);
    document.removeEventListener('scroll', this.scrollHandler, { capture: true });
    this.persistVisibility();
  }

  private persistVisibility(): void {
    if (this.settings.onLaunch !== 'remember') {
      return;
    }
    try {
      localStorage.setItem(VISIBLE_STORAGE_KEY, this.opened ? '1' : '0');
    } catch {
      // localStorage unavailable; remembering is best-effort.
    }
  }

  toggle(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Recompute the table of contents and re-render the list. */
  refresh(): void {
    if (!this.mounted) {
      return;
    }

    // Only pay for parsing / rendering when the panel is actually visible.
    if (!this.opened) {
      return;
    }

    this.headings = extractHeadings(MarkEdit.editorView.state);
    this.renderList();
    this.updateActive();
    // In preview mode the caret is stale, so prefer the preview's scroll position
    // for the initial highlight when a preview is visible.
    const previewIndex = activePreviewHeadingIndex(this.headings);
    if (previewIndex !== undefined) {
      this.setActive(previewIndex);
    }
  }

  /** Update which item is highlighted based on the current caret position. */
  updateActive(): void {
    if (!this.mounted || !this.opened || this.items.length === 0) {
      return;
    }

    const head = MarkEdit.editorView.state.selection.main.head;
    this.setActive(activeHeadingIndex(this.headings, head));
  }

  /**
   * Highlight the item at `index` (or clear the highlight when `index < 0`),
   * scrolling the list to keep it visible. Idempotent: re-setting the current
   * index is a no-op, so the caret-driven and preview-scroll-driven callers can
   * both feed it without fighting each other.
   */
  private setActive(index: number): void {
    if (index === this.activeIndex) {
      return;
    }

    if (this.activeIndex >= 0 && this.items[this.activeIndex]) {
      this.items[this.activeIndex].classList.remove('meo-active');
    }
    this.activeIndex = index;
    if (index >= 0 && this.items[index]) {
      this.items[index].classList.add('meo-active');
      this.ensureItemVisible(this.items[index]);
    }
  }

  /**
   * Track the preview's scroll position so the highlighted item follows what
   * you're reading in preview / side-by-side mode (where the caret doesn't move).
   * A single capture-phase listener on `document` catches scroll events from
   * whichever preview container is live, so it survives mode switches and preview
   * re-renders without any per-element observer bookkeeping.
   */
  private onDocumentScroll(event: Event): void {
    if (!this.opened || this.items.length === 0) {
      return;
    }
    // Ignore the sidebar list's own scrolling.
    const target = event.target as Node | null;
    if (target instanceof HTMLElement && target.closest('.meo-sidebar')) {
      return;
    }
    // Coalesce bursts of scroll events into one recompute per frame.
    if (this.spyScheduled) {
      return;
    }
    this.spyScheduled = true;
    requestAnimationFrame(() => {
      this.spyScheduled = false;
      if (!this.opened) {
        return;
      }
      const next = activePreviewHeadingIndex(this.headings);
      if (next !== undefined) {
        this.setActive(next);
      }
    });
  }

  // MARK: - DOM construction

  private injectStyles(): void {
    if (document.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }
    const style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  private buildSidebar(): void {
    const root = document.createElement('div');
    root.className = 'meo-sidebar';
    root.setAttribute('data-position', this.settings.position);
    root.style.setProperty('--meo-width', `${this.width}px`);
    root.style.width = `${this.width}px`;

    const header = document.createElement('div');
    header.className = 'meo-header';

    const title = document.createElement('span');
    title.className = 'meo-title';
    title.textContent = 'Outline';

    header.append(title);

    const list = document.createElement('div');
    list.className = 'meo-list';
    list.setAttribute('role', 'tree');
    list.addEventListener('click', (event) => this.onListClick(event));

    const empty = document.createElement('div');
    empty.className = 'meo-empty';
    empty.textContent = 'No headings in this document.';
    empty.style.display = 'none';

    const resizer = document.createElement('div');
    resizer.className = 'meo-resizer';
    resizer.title = 'Drag to resize';
    resizer.addEventListener('mousedown', (event) => this.startResize(event));

    root.append(header, list, empty, resizer);
    document.body.appendChild(root);

    this.root = root;
    this.list = list;
    this.empty = empty;
    this.resizer = resizer;
  }

  // MARK: - Resizing

  private maxWidth(): number {
    return Math.max(MIN_WIDTH, Math.min(600, window.innerWidth - 120));
  }

  /** Apply a new width, re-pushing the editor if open, and optionally persist it. */
  private setWidth(width: number, persist: boolean): void {
    const clamped = Math.max(MIN_WIDTH, Math.min(this.maxWidth(), Math.round(width)));
    this.width = clamped;
    this.root.style.width = `${clamped}px`;
    this.root.style.setProperty('--meo-width', `${clamped}px`);
    if (this.opened) {
      this.pushEditor(true);
    }
    if (persist) {
      try {
        localStorage.setItem(WIDTH_STORAGE_KEY, String(clamped));
      } catch {
        // localStorage unavailable; remembering the width is best-effort.
      }
    }
  }

  private startResize(event: MouseEvent): void {
    event.preventDefault();
    const right = this.settings.position === 'right';
    this.resizer.classList.add('meo-dragging');
    document.body.style.cursor = 'col-resize';
    document.documentElement.style.userSelect = 'none';

    const onMove = (e: MouseEvent) => {
      const width = right ? window.innerWidth - e.clientX : e.clientX;
      this.setWidth(width, false);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      this.resizer.classList.remove('meo-dragging');
      document.body.style.cursor = '';
      document.documentElement.style.userSelect = '';
      this.setWidth(this.width, true); // persist the final width
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // MARK: - Rendering

  private renderList(): void {
    this.list.textContent = '';
    this.items = [];
    this.activeIndex = -1;

    if (this.headings.length === 0) {
      this.empty.style.display = '';
      return;
    }
    this.empty.style.display = 'none';

    const fragment = document.createDocumentFragment();
    this.headings.forEach((heading, index) => {
      const item = document.createElement('button');
      item.className = 'meo-item';
      item.setAttribute('data-level', String(heading.level));
      item.setAttribute('data-index', String(index));
      item.title = heading.title;
      item.textContent = heading.title;
      this.items.push(item);
      fragment.appendChild(item);
    });
    this.list.appendChild(fragment);
  }

  private onListClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement | null)?.closest('.meo-item') as HTMLElement | null;
    if (target === null) {
      return;
    }
    const index = parseInt(target.getAttribute('data-index') ?? '', 10);
    if (Number.isNaN(index)) {
      return;
    }
    goToHeading(this.headings, index, true);
  }

  private ensureItemVisible(item: HTMLElement): void {
    const listTop = this.list.scrollTop;
    const listBottom = listTop + this.list.clientHeight;
    const itemTop = item.offsetTop - this.list.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;

    if (itemTop < listTop) {
      this.list.scrollTop = itemTop - 4;
    } else if (itemBottom > listBottom) {
      this.list.scrollTop = itemBottom - this.list.clientHeight + 4;
    }
  }

  // MARK: - Layout & theming

  private pushEditor(open: boolean): void {
    const width = this.width;
    const right = this.settings.position === 'right';
    const body = document.body.style;
    const root = document.documentElement.style;

    if (open) {
      // 1. Shrink the content container. In edit / side-by-side modes the
      //    editor and preview live in a CSS grid on <body>; constraining the
      //    body width reflows that grid into the space beside the panel.
      body.width = `calc(100vw - ${width}px)`;
      body.marginLeft = right ? '' : `${width}px`;
      body.marginRight = '';
      // 2. In pure preview mode the preview pane is absolutely positioned and
      //    ignores the body box; MarkEdit-preview exposes this CSS variable to
      //    inset that overlay, so we reserve the panel's edge here too.
      root.setProperty('--markedit-content-inset', right ? `0 ${width}px 0 0` : `0 0 0 ${width}px`);
      // 3. Expose the width and, for a left dock, a flag so the active-line
      //    indicator can be re-offset for the editor's rightward shift (styles.ts).
      root.setProperty('--meo-width', `${width}px`);
      document.documentElement.classList.toggle('meo-push-left', !right);
    } else {
      body.width = '';
      body.marginLeft = '';
      body.marginRight = '';
      root.removeProperty('--markedit-content-inset');
      document.documentElement.classList.remove('meo-push-left');
    }

    // Let CodeMirror re-measure so text reflows within the new width.
    MarkEdit.editorView.requestMeasure();
  }

  /**
   * Read the editor's background and foreground colors from its live computed
   * style, falling back to sensible defaults. Shared by `applyTheme` (to paint
   * the panel) and `repollTheme` (to detect when a deferred theme restyle has
   * landed).
   */
  private readEditorColors(): { bg: string; fg: string } {
    const view = MarkEdit.editorView;
    const editorStyle = getComputedStyle(view.dom);
    const contentStyle = getComputedStyle(view.contentDOM ?? view.dom);

    const bg = firstOpaqueColor([editorStyle.backgroundColor, getComputedStyle(document.body).backgroundColor]) ?? '#ffffff';
    const fg = firstOpaqueColor([contentStyle.color, editorStyle.color]) ?? '#1a1a1a';
    return { bg, fg };
  }

  /**
   * Re-apply the theme once the editor's background matches the appearance the
   * OS media query now reports, or give up after a short deadline. This bridges
   * theme extensions that repaint the editor asynchronously after an appearance
   * switch, where a single synchronous read would capture stale colors.
   */
  private repollTheme(): void {
    const wantDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const deadline = performance.now() + 500;

    const tick = () => {
      const settled = isDarkColor(this.readEditorColors().bg) === wantDark;
      if (settled || performance.now() >= deadline) {
        this.applyTheme();
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  /** Pull colors from the live editor theme so the panel matches it. */
  private applyTheme(): void {
    if (!this.mounted) {
      return;
    }

    const { bg, fg } = this.readEditorColors();
    const dark = isDarkColor(bg);

    const set = (name: string, value: string) => this.root.style.setProperty(name, value);
    // Panel background: a fixed #fafafa in light mode (a hair off the white
    // editor, so the color alone separates the two); in dark mode a subtle
    // lightening of the editor background for the same effect. Hover/active are
    // solid (not translucent) so rounded corners stay clean.
    set('--meo-bg', dark ? lighten(bg, 8) : '#fafafa');
    set('--meo-fg', fg);
    set('--meo-hover', dark ? lighten(bg, 22) : '#f0f0f0');
    set('--meo-active-bg', dark ? lighten(bg, 32) : '#e8e8e8');
    set('--meo-accent', 'AccentColor');

    // The preview-navigation flash is applied to preview headings, which live
    // outside the sidebar's subtree, so its color goes on <html> to inherit
    // everywhere. Dark themes get a slightly warmer amber.
    document.documentElement.style.setProperty(
      '--meo-flash',
      dark ? 'rgba(255, 214, 92, 0.60)' : 'rgba(255, 209, 71, 0.60)',
    );
  }
}

function readStoredWidth(): number | undefined {
  try {
    const value = localStorage.getItem(WIDTH_STORAGE_KEY);
    if (value !== null) {
      const width = parseInt(value, 10);
      if (Number.isFinite(width) && width > 0) {
        return width;
      }
    }
  } catch {
    // localStorage unavailable.
  }
  return undefined;
}

function readStoredVisibility(): boolean | undefined {
  try {
    const value = localStorage.getItem(VISIBLE_STORAGE_KEY);
    if (value === '1') {
      return true;
    }
    if (value === '0') {
      return false;
    }
  } catch {
    // localStorage unavailable.
  }
  return undefined;
}

function firstOpaqueColor(candidates: string[]): string | undefined {
  for (const color of candidates) {
    const rgb = parseColor(color);
    if (rgb !== undefined && rgb.a > 0.05) {
      return color;
    }
  }
  return undefined;
}

/** Lighten a color by adding `amount` to each RGB channel (clamped). */
function lighten(color: string, amount: number): string {
  const rgb = parseColor(color);
  if (rgb === undefined) {
    return color;
  }
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount)));
  return `rgb(${clamp(rgb.r)}, ${clamp(rgb.g)}, ${clamp(rgb.b)})`;
}

function isDarkColor(color: string): boolean {
  const rgb = parseColor(color);
  if (rgb === undefined) {
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }
  // Perceived luminance (ITU-R BT.601).
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.5;
}

function parseColor(color: string): { r: number; g: number; b: number; a: number } | undefined {
  const match = /rgba?\(([^)]+)\)/.exec(color);
  if (match === null) {
    return undefined;
  }
  const parts = match[1].split(',').map((p) => parseFloat(p.trim()));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) {
    return undefined;
  }
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length >= 4 ? parts[3] : 1 };
}
