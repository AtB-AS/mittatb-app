# AGENTS.md

This file provides guidance to AI agents when working with the code in this repository.

## Project Overview
AtB App is a travel companion/ticketing app in Trondheim, Norway.

## Tech Stack
Check @package.json for complete information along with actual version number
- React Native
- TypeScript
- Tanstack React Query
- Yarn
- ESLint
- Jest
- RNMapBox

## Project Structure

- ./src/: Main application source code (React Native)
  - api/: API queries and type definitions (vehicles, stops, mobility, geofencing)
  - assets/: In-app static assets (images used in UI)
  - components/: Reusable React UI components (buttons, inputs, headers, loading indicators, etc.)
  - stacks-hierarchy/: Navigation structure — React Navigation stacks and screen definitions (root stacks, tab navigators, individual screens)
  - translations/: i18n / localization resources, organized per screen/feature
  - utils/: Shared utility functions (date formatting, debounce, validation, etc.)
- ./android/: Android native project (Gradle configs, APK build)
- ./ios/: iOS native project (Xcode configs, scripts)
- ./e2e/: End-to-end tests (WebdriverIO-based mobile automation)
- ./docs/: Developer documentation, setup guides, release notes
- ./scripts/: Utility scripts for environment setup, config management
- ./fastlane/: Build & deploy automation (Fastlane)
- ./patches/: Patch files for third-party dependencies
- ./assets/: App-level assets (logos, splash screens)
- ./eslint-rules/: Custom ESLint rules for the project
- ./types/: Global TypeScript declarations
- ./.github/: PR templates, CODEOWNERS, GitHub Actions

## Development Commands

### Test
- `yarn test` - Run Jest unit tests, can specify which tests to run using: `yarn test partlyMatchingPathOrFilename`

### Code Quality
- `yarn tsc` - Run TypeScript compiler check
- `yarn lint` - Run ESLint `eslint . --ext .ts,.tsx`
- `yarn prettier` - Runs `prettier -c src`

### Final verification
- `yarn check-all` - runs `yarn tsc && yarn lint && yarn test --coverage --coverageReporters && yarn prettier`