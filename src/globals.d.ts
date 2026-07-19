/**
 * Injected by Vite at build time (see `vite.config.mts`) from `package.json`'s
 * `version`. The updater compares this against the latest GitHub release to
 * decide whether a newer build is available.
 */
declare const __EXTENSION_VERSION__: string;

/**
 * MarkEdit's CoreEditor exposes its live editor configuration on `window.config`.
 * We only read the fields we need; `typewriterMode` ("keep caret in the middle")
 * changes how we scroll the editor when navigating to a heading. The object is
 * updated in place when the user toggles settings, so reading it at click time
 * reflects the current state.
 */
interface Window {
  config?: {
    typewriterMode?: boolean;
  };
  __markeditBidirectionalScrollSync__?: {
    isActive?: boolean;
  };
}
