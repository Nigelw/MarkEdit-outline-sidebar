---
name: submit-registry
description: Submit the latest released MarkEdit Outline Sidebar build to the official MarkEdit extensions registry. Use when asked to submit, register, or publish the latest release to MarkEdit-app/extensions, including updating an existing registry entry. Draft and obtain explicit approval for both the entry JSON and pull-request body before opening a draft PR.
---

# Submit the Latest Release to the Registry

Publish the latest semver release from this repository to `MarkEdit-app/extensions`.
The registry downloads `dist/markedit-outline.js` from an immutable Git tag and verifies its
SHA-256; MarkEdit's Extension Manager then delivers updates.

## Guardrails

- Do not tag, release, or change the extension source. This skill submits an already-published
  release only. Use the `release` skill first if no suitable release exists.
- Never move or recreate an existing release tag.
- Open a **draft** PR only after the user explicitly approves both the exact registry JSON and the
  exact PR body. A request to submit is not approval of either draft.
- Stage and commit only `extensions/<id>.json`. The registry build regenerates `index.json` and
  `site/`; leave generated output unstaged.

## 1. Inspect the release

1. Confirm the working tree is understood, then find the newest release tag with
   `git tag --sort=-v:refname`.
2. Verify the tag is published with `gh release view v<version>`.
3. Verify the tag contains `dist/markedit-outline.js`. Fetch the immutable raw URL:

   ```sh
   registry_url="https://raw.githubusercontent.com/Nigelw/MarkEdit-outline-sidebar/v<version>/dist/markedit-outline.js"
   curl -fsSL -o /tmp/markedit-outline-v<version>.js "$registry_url"
   shasum -a 256 /tmp/markedit-outline-v<version>.js
   ```

4. Compare the downloaded bytes with the tagged file or the release checkout using `cmp -s`.
   Stop if the URL is unreachable or the bytes differ.

## 2. Determine the entry

1. Use `markedit-outline` as the ID unless an existing registry entry or the user specifies a
   different ID. The filename must be `extensions/<id>.json`.
2. Fetch the upstream entry if it exists. For an existing entry, retain its metadata and prepend
   the new version object to `versions`; preserve older versions. For a new entry, draft all
   required metadata: `id`, `name`, `description`, `author`, and `homepage`.
3. Use the extension schema URL and the exact `registry_url` and hash from step 1. Add short
   non-empty `notes` when release notes are available.
4. Check for an existing open upstream PR from the user's fork for the same ID/version. Amend it
   rather than opening a duplicate PR when appropriate.

## 3. Review the JSON — required stop

Create the proposed `extensions/<id>.json` in the fork worktree, but do not stage, commit, push,
or open a PR. Show the complete JSON file and state the raw URL and SHA-256. Ask for explicit
approval or edits. Do not proceed until the user approves the exact JSON content.

## 4. Validate after JSON approval

1. Fork `MarkEdit-app/extensions` if needed, then clone the fork into a temporary directory and
   create a dedicated branch.
2. Run the registry's documented validation (`yarn install --frozen-lockfile && yarn build`). If
   Yarn is unavailable, use npm only to install the declared dependencies without changing
   lockfiles, then run `npm run build`; report that substitution.
3. Confirm the build succeeds and fetches/hash-checks the extension bundle. Do not stage generated
   `index.json` or `site/` output.

## 5. Review the PR body — required stop

Write a concise Markdown PR body covering the registry entry, immutable bundle URL, update-delivery
model, and validation result. Show the complete body to the user and ask for explicit approval or
edits. Do not stage, commit, push, or create the PR until the user approves the exact body.

## 6. Submit the approved drafts

1. Stage only `extensions/<id>.json`, inspect the staged diff, and commit it.
2. Push the branch to the user's fork.
3. Create a **draft** PR to `MarkEdit-app/extensions:main`. For a cross-fork PR, use `gh pr create`
   with an explicit `--head <owner>:<branch>`, `--base main`, `--draft`, and the approved body file.
4. Report the PR URL, branch, version, raw URL, SHA-256, and validation result. Say clearly that
   the PR is a draft and must be marked ready for review by the user when desired.
