import { MarkEdit } from 'markedit-api';
import {
  LAST_CHECK_STORAGE_KEY,
  LATEST_RELEASE_URL,
  SKIPPED_VERSIONS_STORAGE_KEY,
  UPDATE_ASSET_NAME,
} from './constants';
import type { UpdateBehavior } from './settings';

/**
 * Self-updater: on launch (and on demand from the menu) it asks GitHub for the
 * latest release, and — depending on the `update` setting — silently installs
 * it, prompts first, or does nothing. Installing means downloading the release's
 * `markedit-outline.js` asset (Method B) and overwriting this very script file
 * with it; the new code takes effect on the next MarkEdit launch.
 */

/** Version baked in at build time (see globals.d.ts / vite.config.mts). */
const CURRENT_VERSION = __EXTENSION_VERSION__;

/** Don't auto-check more than once per day (manual checks bypass this). */
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  name?: string;
  html_url?: string;
  assets?: ReleaseAsset[];
}

/** Parse `"v1.2.3"` / `"1.2.3"` into `[1, 2, 3]`, or `undefined` if unparseable. */
function parseVersion(value: string): number[] | undefined {
  const match = value.trim().match(/^v?(\d+(?:\.\d+)*)/);
  if (match === null) {
    return undefined;
  }
  return match[1].split('.').map((part) => parseInt(part, 10));
}

/** True when `remote` is a strictly higher semver than `current`. */
function isNewer(remote: string, current: string): boolean {
  const a = parseVersion(remote);
  const b = parseVersion(current);
  if (a === undefined || b === undefined) {
    // Fall back to a plain inequality if either side isn't a clean version.
    return remote !== current;
  }
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) {
      return diff > 0;
    }
  }
  return false;
}

function skippedVersions(): Set<string> {
  try {
    const raw = localStorage.getItem(SKIPPED_VERSIONS_STORAGE_KEY);
    const parsed = JSON.parse(raw ?? '[]') as unknown;
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function skipVersion(tag: string): void {
  const set = skippedVersions();
  set.add(tag);
  localStorage.setItem(SKIPPED_VERSIONS_STORAGE_KEY, JSON.stringify([...set]));
}

async function fetchLatestRelease(): Promise<Release | undefined> {
  const response = await fetch(LATEST_RELEASE_URL);
  if (!response.ok) {
    return undefined;
  }
  const json = (await response.json()) as Partial<Release>;
  return typeof json.tag_name === 'string' ? (json as Release) : undefined;
}

/**
 * Download the release's `markedit-outline.js` asset and overwrite this script
 * file with it. Returns false if the release has no such asset or the download
 * or write fails.
 */
async function downloadAndInstall(release: Release): Promise<boolean> {
  const path = __FILE_PATH__;
  if (typeof path !== 'string') {
    console.error('Outline Sidebar updater: unknown script path, cannot install.');
    return false;
  }
  const asset = release.assets?.find((a) => a.name === UPDATE_ASSET_NAME);
  if (asset === undefined) {
    console.error(`Outline Sidebar updater: release ${release.tag_name} has no ${UPDATE_ASSET_NAME} asset.`);
    return false;
  }
  try {
    const response = await fetch(asset.browser_download_url);
    if (!response.ok) {
      console.error(`Outline Sidebar updater: failed to download ${asset.browser_download_url} (${response.status}).`);
      return false;
    }
    const code = await response.text();
    return MarkEdit.createFile({ path, string: code, overwrites: true });
  } catch (error) {
    console.error('Outline Sidebar updater: download failed:', error);
    return false;
  }
}

async function installAndReport(release: Release): Promise<void> {
  const ok = await downloadAndInstall(release);
  await MarkEdit.showAlert(
    ok
      ? {
          title: `Updated to ${release.tag_name}`,
          message: 'Restart MarkEdit to start using the new version of the Outline Sidebar.',
          buttons: ['OK'],
        }
      : {
          title: 'Update failed',
          message:
            "The Outline Sidebar couldn't download the latest build. Check your connection and " +
            'try again from Extensions → Outline Sidebar → Check for Updates….',
          buttons: ['OK'],
        },
  );
}

/** Ask the user what to do about an available release. */
async function promptForUpdate(release: Release): Promise<void> {
  const choice = await MarkEdit.showAlert({
    title: `Outline Sidebar ${release.tag_name} is available`,
    message: `You have ${CURRENT_VERSION}. Update now?`,
    buttons: ['Update Now', 'Skip This Version', 'Later'],
  });
  if (choice === 0) {
    await installAndReport(release);
  } else if (choice === 1) {
    skipVersion(release.tag_name);
  }
}

/**
 * Run an update check.
 *
 * @param behavior the configured `update` setting.
 * @param manual   true when triggered from the menu — bypasses the once-a-day
 *                 throttle and the skip list, and reports "up to date".
 */
export async function checkForUpdates(behavior: UpdateBehavior, manual = false): Promise<void> {
  if (behavior === 'never' && !manual) {
    return;
  }

  if (!manual) {
    const last = Number(localStorage.getItem(LAST_CHECK_STORAGE_KEY) ?? '0');
    if (Date.now() - last < CHECK_INTERVAL_MS) {
      return;
    }
    localStorage.setItem(LAST_CHECK_STORAGE_KEY, String(Date.now()));
  }

  let release: Release | undefined;
  try {
    release = await fetchLatestRelease();
  } catch (error) {
    console.error('Outline Sidebar updater: failed to check for updates:', error);
    if (manual) {
      await MarkEdit.showAlert({
        title: 'Update check failed',
        message: "Couldn't reach GitHub to check for updates. Please try again later.",
        buttons: ['OK'],
      });
    }
    return;
  }

  const upToDate = release === undefined || !isNewer(release.tag_name, CURRENT_VERSION);
  if (upToDate) {
    if (manual) {
      await MarkEdit.showAlert({
        title: "You're up to date",
        message: `Outline Sidebar ${CURRENT_VERSION} is the latest version.`,
        buttons: ['OK'],
      });
    }
    return;
  }

  if (!manual && skippedVersions().has(release!.tag_name)) {
    return;
  }

  if (behavior === 'automatic' && !manual) {
    await installAndReport(release!);
  } else {
    await promptForUpdate(release!);
  }
}
