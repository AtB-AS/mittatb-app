# Managing new releases

Currently we distribute builds through Firebase App distribution, but build on Github with Github Actions. We build for two different environments:

- `staging` - Continous integrated from `master` and distributed to test devices and development team. Also where we do most of our [QA](https://github.com/AtB-AS/org/blob/master/guides/workflow-and-qa-progress-apps.md).
- `store` - Periodic manually triggered by Github-releases, and distributed to internal testers on the "alpha" release plan (TestFlight for iOS and Alpha-channel on Google Play Store). When a `store` build is ready for Production-channels, we promote the builds inside the respective store-pages (Github is not involved).

Whenever a new change is merged to `master`, through Pull Requests or similar, we build a QA-version for the `staging` environment. When we're getting ready to distribute to our Production-channels, we create a `release/x.xx` branch and create releases on Github from it, which triggers alpha-channel builds. This is what these scripts solve.

See [docs/Release.md](../../docs/Release.md) for the full release process.

### Requirements

- `gh` (Github CLI): https://cli.github.com/
- `gcloud`, for registering new app versions at Entur
- `bash` 😬

## Scripts

### `release.sh` (`pnpm release`)

Automates the release process based on the current branch:

- On `master`: creates the next `release/x.xx` branch, creates the `rc1` release, and opens a draft PR bumping the version on `master`. After the bump, the new version is registered at Entur (optional but highly recommended, only Mobile Token breaks for that version without it).
- On `release/x.xx`: creates the next release candidate (e.g. `v1.80-rc2`).
- On other branches: previews as if on `master`.

Options: `--preview` to only show what will happen, `--publish` to publish the release immediately instead of creating a draft.

### `release-draft.sh` (`pnpm release-draft`)

Creates a draft release for a given tag, used by `release.sh` and for manual releases (e.g. org-specific tags like `v1.80-rc3-nfk`). It does the following:

1. Generate changelog [using conventional changelog](https://github.com/conventional-changelog/conventional-changelog) for all changes since the previous release
1. Create a draft release on Github targeting the current branch
