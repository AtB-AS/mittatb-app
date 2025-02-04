# Managing new releases

Currently we distribute builds through Firebase App distribution, but build on Github with Github Actions. We target a single branch, `master`, and build for two different environments:

- `staging` - Continous integrated and distributed to test devices and development team. Also where we do most of our [QA](https://github.com/AtB-AS/org/blob/master/guides/workflow-and-qa-progress-apps.md).
- `store` - Periodic manually triggered by Github-releases, and distributed to internal testers on the "alpha" release plan (TestFlight for iOS and Alpha-channel on Google Play Store). When a `store` build is ready for Production-channels, we promote the builds inside the respective store-pages (Github is not involved).

Whenever a new change is merged to `master`, through Pull Requests or similar, we build a QA-version for the `staging` environment. When we're getting ready to distribute to our Production-channels, and we want to test larger concepts and features, we will build for our `store` environment and distribute to the internal testing team through the store alpha channels (TestFlight/Alpha). For this we make create releases on Github which triggers alpha-channel builds. This is what this script solves.

### Requirements

- `gh` (Github CLI): https://cli.github.com/
- `bash` 😬

## Normal flow

1. Do continuous changes on master through PR
1. When you want to do an alpha release, run the following on the `master` branch (from project root): `yarn release-draft`
1. Revise and review the release draft on Github
1. Publish the release when you want to trigger the `store` build and distribute to our alpha-channels

Running this script does the following:

1. Find the last commit of the previous alpha release
1. Generate changelog [using conventional changelog](https://github.com/conventional-changelog/conventional-changelog) for all changes from now to previous release (see step 1)
1. Create a draft release on Github
