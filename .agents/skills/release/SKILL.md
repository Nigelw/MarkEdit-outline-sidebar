---
name: release
description: Cut a new release of the MarkEdit Outline Sidebar extension — bump the version, update the changelog, build, commit the bundle, tag, push, and publish GitHub release notes. Use when the user says "release", "cut a release", "ship a new version", or "publish v1.2.0". Do not submit to the official extensions registry; use the separate `submit-registry` skill for that activity.
---

# Release the MarkEdit Outline Sidebar

This skill publishes a GitHub release only. Registry submission is a separate activity performed
by the `submit-registry` skill after the release is complete.

The release tag must contain the freshly built bundle so a later registry submission can reference
an immutable raw-GitHub URL:

1. `package.json` `version` = the new version recorded in the registry entry.
2. `dist/markedit-outline.js` is freshly rebuilt from that version.
3. The `v<version>` tag contains that exact `dist/markedit-outline.js` file.
If the bundle and tag drift, a later registry submission will be rejected. The steps below keep
them in lockstep.

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
   than tagging a missing or empty release artifact.

6. **Commit** the release files:
   `git add package.json CHANGELOG.md dist/markedit-outline.js` then commit as `Release v<version>`.
   Include any other intended changes for this release in the same or prior commits — the tag must
   sit on top of everything the release contains. The tag must include the bundle so a later
   registry submission can use an immutable raw-GitHub URL for it.

7. **Tag** the release commit: `git tag -a v<version> -m "v<version>"` (annotated tag).

8. **Push** the branch and the tag: `git push origin main` and `git push origin v<version>`.

9. **Publish GitHub release notes**:
   `gh release create v<version> --title "v<version>" --notes "<changelog section>"`.
   Prefer reusing the confirmed `CHANGELOG.md` section for the release body so GitHub and the
   changelog match; `--generate-notes` is an acceptable fallback. Do not attach the extension
   bundle: the separate `submit-registry` skill uses the tag-pinned raw file.

## Report back

Tell the user the released version, the release URL (`gh release view v<version> --web` gives it),
and that the release is ready for a separate registry submission when requested.

## Notes & gotchas

- **The repo must stay public** for a future registry submission to fetch the tag-pinned raw file.
- **Never tag without rebuilding.** A later registry submission hashes the exact bytes in the tag.
  Step 5 guards the build.
