---
name: release
description: Cut a new release of the MarkEdit Outline Sidebar extension — bump the version, build, commit the compiled bundle, tag, push, and publish a GitHub release. Use when the user says "release", "cut a release", "ship a new version", "publish v1.2.0", or wants to make the in-app auto-updater offer a new build.
---

# Release the MarkEdit Outline Sidebar

This extension has an in-app self-updater (`src/updater.ts`). Installed copies poll
`api.github.com/repos/Nigelw/MarkEdit-outline-sidebar/releases/latest`, compare the
release's tag against their baked-in version, and download the new build from
**`raw.githubusercontent.com/Nigelw/MarkEdit-outline-sidebar/refs/tags/<tag>/dist/markedit-outline.js`**
(Method A — the compiled bundle is served straight from the tagged commit).

So a release is only usable by the updater if **three things agree at the tagged commit**:

1. `package.json` `version` = the new version (this is baked into the bundle at build time).
2. `dist/markedit-outline.js` is freshly rebuilt from that version and **committed**.
3. The git tag is `v<version>` and points at the commit containing that rebuilt bundle.

If any of these drift (e.g. tagging without rebuilding), users download stale or mismatched
code. The steps below keep them in lockstep.

## Before starting

- Confirm the working tree is clean (`git status`) and you're on `main`. If there are unrelated
  uncommitted changes, stop and ask the user how to proceed.
- Determine the new version. If the user didn't specify one, ask whether it's a patch, minor, or
  major bump and compute it from the current `package.json` `version`. Use plain semver
  (`MAJOR.MINOR.PATCH`); the git tag is that with a `v` prefix (`v1.2.0`).

## Steps

1. **Bump the version** in `package.json` to the new version (no `v` prefix). Edit the file
   directly — don't run `npm version`, which also creates a tag and would fight step 7.

2. **Update `CHANGELOG.md` — suggest, then let the user edit and confirm.** This is a required,
   interactive step; do not silently generate the final changelog.

   1. **Gather the commits since the previous release.** Find the previous tag with
      `git describe --tags --abbrev=0` (this returns the latest existing tag, i.e. the previous
      release, since the new one isn't tagged yet). Then list the commits:
      `git log <prev-tag>..HEAD --pretty=format:'%s%n%b%x1e'`. If there's no previous tag (first
      release), use `git log --pretty=format:'%s%n%b%x1e'` over all history.
   2. **Draft suggested entries**, grouped under `### New`, `### Improved`, and `### Fixed`
      (include only the groups that have items). Translate commit subjects into **user-facing**
      language — describe what changed for the user, not the internal commit wording — and merge
      related commits into one bullet. Skip noise: release/version-bump commits, pure-docs or
      CI/chore commits, merge commits, and anything with no user-visible effect. Also fold in
      anything already sitting under the `## Unreleased` heading.
   3. **Present the draft to the user and ask them to edit and confirm it.** Show the proposed
      `### New/Improved/Fixed` bullets and explicitly invite changes (add, remove, reword,
      regroup). **Do not write the file until the user approves.** Iterate on their edits until
      they confirm.
   4. **Write the approved entries into `CHANGELOG.md`:** replace the empty `## Unreleased`
      section with a new `## <version> (<YYYY-MM-DD>)` heading (today's date) holding the
      confirmed content, and leave a fresh empty `## Unreleased` section above it. Preserve the
      existing `# Changelog` title and all older version sections. Keep the format identical to
      the existing entries (Keep a Changelog style: `### New/Improved/Fixed`, `-` bullets,
      two-space-indented nested bullets).

3. **Typecheck**: `npm run typecheck`. Fix or report any errors before continuing.

4. **Build**: `npm run build`. This bakes the new `package.json` version into the bundle as
   `__EXTENSION_VERSION__`, writes `dist/markedit-outline.js`, and deploys a copy into the local
   MarkEdit scripts folder.

5. **Verify the bundle carries the new version**:
   `grep -c "<new-version>" dist/markedit-outline.js` should be ≥ 1. If it's 0, the build didn't
   pick up the bump — stop and investigate rather than shipping a mismatched build.

6. **Commit** the release files together:
   `git add package.json CHANGELOG.md dist/markedit-outline.js` then commit as
   `Release v<version>`. (Include any other intended changes for this release in the same or
   prior commits — the tag must sit on top of everything the release contains.)

7. **Tag** the release commit: `git tag -a v<version> -m "v<version>"` (annotated tag).

8. **Push** the branch and the tag: `git push origin main` and `git push origin v<version>`.

9. **Publish the GitHub release** so `releases/latest` advances (the updater reads *latest*, so an
   unpublished tag alone won't trigger updates):
   `gh release create v<version> --title "v<version>" --notes "<changelog section>"`
   Prefer reusing the confirmed `CHANGELOG.md` section for this version as the release notes (so
   GitHub and the changelog match); `--generate-notes` is an acceptable fallback. Do **not**
   attach a binary asset — Method A serves the bundle from the raw tag path, not from release
   assets.

10. **Verify the updater's download URL resolves** (catches a missing/mis-committed `dist/`):
    ```
    curl -sSfI "https://raw.githubusercontent.com/Nigelw/MarkEdit-outline-sidebar/refs/tags/v<version>/dist/markedit-outline.js" | head -1
    ```
    Expect `HTTP/2 200`. A 404 means the built bundle isn't present at that tag — the release will
    fail to install for users. (raw.githubusercontent can lag a tag push by a few seconds; retry
    once before treating a 404 as a real problem.)

## Report back

Tell the user the released version, the release URL (`gh release view v<version> --web` gives it),
and the result of the step-10 URL check so they know the auto-updater will serve it.

## Notes & gotchas

- **The repo must stay public** for the unauthenticated api.github.com / raw.githubusercontent
  fetches the updater makes.
- **Never tag without rebuilding.** The whole scheme relies on the committed `dist/` at the tag
  matching `package.json`'s version. Step 5 guards this.
- The version an *installed* user compares against is the one baked into their old build, so the
  new tag simply needs to be a higher semver than the last release. Skipped/never modes are the
  user's own `update` setting and don't affect how you cut the release.
- To test the end-to-end update flow yourself, temporarily lower `package.json` to an older
  version, `npm run build`, relaunch MarkEdit, and the running copy should offer the latest
  release. Restore the real version afterward.
