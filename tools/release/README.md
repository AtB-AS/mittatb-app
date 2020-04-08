# Managing new releases

Currently we setup deploy through AppCenter directly and build on two branches:

- `master` - Continous integrated and distributed to test devices and development team. Also we can do some [QA](https://github.com/AtB-AS/org/blob/master/guides/workflow-and-qa-progress-apps.md).
- `alpha-release` - Periodic manually built and distributed to internal people on the "alpha" release plan (Test Flight for iOS and alpha store on Google Play Store).

For `master` we just merge new changes through Pull Requests and feature branches with squash and rebase. But if we really want to test larger concepts and features, we should distribute to the internal testing team through the alpha channel. For this we make changes as a "sync pull request" to `alpha-release`. This is what this script solves.

### Requirements

- `gh` (Github CLI): https://cli.github.com/
- `bash` 😬

## Normal flow

1. Do continuous changes on master through PR
1. When you want to do an alpha release, run the following on the `master` branch (from project root): `yarn release-draft`
1. Revise and review PR on Github, making sure all checks pass.

Running this script does the following:

1. Find the last commit of the previous alpha release
1. Generate changelog [using conventional changelog](https://github.com/conventional-changelog/conventional-changelog) for all changes from now to previous release (see step 1)
1. Create PR from `master` to `alpha-release`.
