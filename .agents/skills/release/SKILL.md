---
name: release
description: Cut a new release of the MarkEdit Outline Sidebar extension — bump the version, update the changelog, build, commit the bundle, tag, push, publish release notes, and update the official registry. Use when the user says "release", "cut a release", "ship a new version", or "publish v1.2.0".
---

# Release the MarkEdit Outline Sidebar

The official MarkEdit extension registry downloads a bundle from a raw GitHub URL pinned to
the release tag and verifies its SHA-256. MarkEdit's Extension Manager centrally manages updates
from that registry. So a release is installable when **all of these agree**:

1. `package.json` `version` = the new version recorded in the registry entry.
2. `dist/markedit-outline.js` is freshly rebuilt from that version.
3. The `v<version>` tag contains that exact `dist/markedit-outline.js` file.
If the bundle and tag drift, the registry rejects the release. The steps below keep them in lockstep.

`dist/markedit-outline.js` is a committed release artifact. It must be committed before tagging
so `https://raw.githubusercontent.com/Nigelw/MarkEdit-outline-sidebar/v<version>/dist/markedit-outline.js`
is immutable and usable by the registry.

## Before starting

- Confirm the working tree is clean (`git status`) and you're on `main`. If there are unrelated
  uncommitted changes, stop and ask the user how to proceed.
- Determine the new version. If the user didn't specify one, ask whether it's a patch, minor, or
  major bump and compute it from the current `package.json` `version`. Use plain semver
  (`MAJOR.MINOR.PATCH`); the git tag is that with a `v` prefix (`v1.2.0`).

## Steps

1. **Bump the version** in `package.json` to the new version (no `v` prefix). Edit the file
   directly — don't run `npm version`, which also creates a tag and would fight step 7.

2. **Update `CHANGELOG.md` — draft, let the user edit, then confirm.** This is a required,
   interactive step; do not continue until the user explicitly approves the changelog section.

   1. **Gather the commits since the previous release.** Find the previous tag with
      `git describe --tags --abbrev=0` (this returns the latest existing tag, i.e. the previous
      release, since the new one isn't tagged yet). Then list the commits:
      `git log --no-merges <prev-tag>..HEAD --pretty='%s%n%b'`. If there's no previous tag (first
      release), use `git log --no-merges --pretty='%s%n%b'` over all history.
   2. **Create a new `CHANGELOG.md` release section** for the chosen version directly under the
      `# Changelog` title:
      ```markdown
      ## <version> (YYYY-MM-DD)

      ### New

      - ...
      ```
      Preserve the existing `# Changelog` title and all older version sections, and keep the
      format identical to the existing entries (Keep a Changelog style: `### New/Improved/Fixed`,
      `-` bullets, two-space-indented nested bullets).
   3. **Draft the section from the commits.** Author short user-facing Markdown, applying these
      rules:
      - Draft release note entries under `### New`, `### Improved`, and `### Fixed` headings, in
        that order. Omit a bucket if it has no entries.
      - Rewrite every entry from the user's perspective. Describe what changed for someone using
        the extension.
      - Drop anything with no user-visible impact, including internal refactors, tests, CI,
        dependency bumps, and documentation-only edits.
      - Use one succinct line per entry, with no jargon, file names, symbols, or implementation
        detail.
      - Merge related commits into one bullet, and skip release/version-bump commits.
   4. **Write the draft section into `CHANGELOG.md`, then let the user review or edit it.** Show
      the new `CHANGELOG.md` section in the conversation, offer to open the file with
      `${EDITOR:-${VISUAL:-open}} CHANGELOG.md`, or take edits in conversation.
   5. **Get explicit confirmation before continuing.** Iterate on any edits the user requests.
      The confirmed `CHANGELOG.md` section is the source for the GitHub release body in step 9.

3. **Typecheck**: `npm run typecheck`. Fix or report any errors before continuing.

4. **Build**: `npm run build`. This writes `dist/markedit-outline.js` and deploys a copy into the
   local MarkEdit scripts folder.

5. **Verify the bundle was built**:
   `test -s dist/markedit-outline.js` must succeed. If it doesn't, stop and investigate rather
   than tagging a missing or empty registry artifact.

6. **Commit** the release files:
   `git add package.json CHANGELOG.md dist/markedit-outline.js` then commit as `Release v<version>`.
   Include any other intended changes for this release in the same or prior commits — the tag must
   sit on top of everything the release contains. The tag must include the bundle; otherwise the
   registry cannot use an immutable raw-GitHub URL for it.

7. **Tag** the release commit: `git tag -a v<version> -m "v<version>"` (annotated tag).

8. **Push** the branch and the tag: `git push origin main` and `git push origin v<version>`.

9. **Publish GitHub release notes**:
   `gh release create v<version> --title "v<version>" --notes "<changelog section>"`.
   Prefer reusing the confirmed `CHANGELOG.md` section for the release body so GitHub and the
   changelog match; `--generate-notes` is an acceptable fallback. Do not attach the extension
   bundle: MarkEdit downloads the tag-pinned raw file recorded in the official registry.

10. **Verify the tagged bundle.** Verify the registry URL and capture its
    hash:
    ```
    registry_url="https://raw.githubusercontent.com/Nigelw/MarkEdit-outline-sidebar/v<version>/dist/markedit-outline.js"
    curl -fsSL -o /tmp/markedit-outline.js "$registry_url" && shasum -a 256 /tmp/markedit-outline.js
    ```
    Confirm the fetched bytes equal the committed `dist/markedit-outline.js` (for example,
    `cmp -s /tmp/markedit-outline.js dist/markedit-outline.js`).

11. **Update the official registry.** In `MarkEdit-app/extensions`, prepend a new version object
    to this extension's `extensions/<id>.json`, using `registry_url` and the SHA-256 from step 10,
    then open a pull request. Do not remove older version objects.

## Report back

Tell the user the released version, the release URL (`gh release view v<version> --web` gives it),
the result of the step-10 registry check, and the registry PR URL (or that it still needs to be
opened).

## Notes & gotchas

- **The repo must stay public** for the unauthenticated raw-file fetches the registry makes.
- **Never tag without rebuilding.** The registry URL's contents must match the SHA-256 recorded
  in its entry. Step 5 guards the build.
