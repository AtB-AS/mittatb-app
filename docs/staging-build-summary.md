# Staging Build Process Summary

This document explains the concepts behind the staging CI builds. For exact step-by-step details, see the flow graphs in [android-build-staging-graph.md](./android-build-staging-graph.md) and [ios-build-staging-graph.md](./ios-build-staging-graph.md).

---

## Triggers

Both platforms share the same triggers: push to `master`/`release/**`, a weekday cron schedule, and manual `workflow_dispatch`. A change detection step can skip the build entirely if nothing meaningful changed since the last run.

Builds run as a **matrix across orgs** (atb, nfk, fram, troms), each with its own environment secrets and `.env` configuration.

---

## The Two-Path Architecture

The key design decision in these builds is **native artifact caching**. The cache key covers native code and dependencies — if those haven't changed, the previously compiled APK/IPA is reused.

This creates two paths:

- **Fresh build** — full native compilation via Fastlane (Gradle on Android, Xcode on iOS), producing a new artifact from scratch.
- **Cached build** — skips native compilation. Regenerates only the JS bundle, injects it into the cached artifact, and re-signs it.

Since most changes are JS/TS only, the cached path is the common case and avoids the most expensive part of the build.

### How bundle replacement works

On a cache hit, the build regenerates the JS bundle via `npx react-native bundle`, then swaps it into the existing native artifact:

- **Android** — the APK is decompiled, the bundle is replaced, version info is updated, and the APK is recompiled and re-signed.
- **iOS** — the IPA is unzipped, the bundle is replaced, the version is updated, and the IPA is re-signed using certificates fetched via Fastlane Match.

---

## What happens after the build

Regardless of which path was taken, the resulting artifact goes through the same post-build steps:

1. **Distribution** — uploaded to Firebase App Distribution with generated release notes.
2. **Error tracking** — JS sourcemaps are uploaded to Bugsnag so crash reports map back to source code. Native debug symbols (dSYMs on iOS) are uploaded on fresh builds only, since native code didn't change on cached builds.
3. **Version registration** — the app version is registered with Entur's service registry.

---

## Platform differences

Android builds run on Linux, support configurable CPU architectures (ABI), and can produce either APK (for distribution) or AAB (for build testing). iOS builds run on macOS, have per-org configuration for features like the widget extension and Apple Pay, and use Fastlane Match for code signing certificate management.
