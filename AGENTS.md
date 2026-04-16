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

## Key Conventions

- **Code formatting**: All generated code must conform to the project's Prettier configuration. After writing or editing code, always run `yarn prettier --write` on the changed files to auto-fix formatting, then verify with `yarn prettier`. `yarn lint` and `yarn prettier` should never fail on generated code.
- **No `TouchableOpacity`**: Use `PressableOpacity` instead (enforced by ESLint).
- **No default exports** (except SVG assets, translation files, and Storybook stories).
- **No Firebase Auth imports outside `src/modules/auth/`** (enforced by ESLint).
- **Commit messages**: Follow Conventional Commits with Angular preset (e.g. `fix(nearby): ...`, `feat(ticketing): ...`). PR title is what goes into the changelog.
- **Path alias**: `@atb/*` maps to `src/*` (configured in `tsconfig.json` and `jest.config.js`).
- **Time durations**: Use seconds (not minutes) for time duration parameters, consistent with the rest of the codebase (e.g. `secondsBetween`, `significantWaitTime`).


## Development Commands

### Test
- `yarn test` - Run Jest unit tests, can specify which tests to run using: `yarn test partlyMatchingPathOrFilename`

### Code Quality
- `yarn tsc` - Run TypeScript compiler check
- `yarn lint` - Run ESLint `eslint . --ext .ts,.tsx`
- `yarn prettier` - Runs `prettier -c src`

### Final verification
- `yarn check-all` - runs `yarn tsc && yarn lint && yarn test --coverage --coverageReporters && yarn prettier`

### Code Intelligence

Prefer LSP over Grep/Glob/Read for code navigation, the only exception is `workspaceSymbol`,
use Grep/Glob/Read instead for that function, otherwise use the following LSP tool:

- `goToDefinition` / `goToImplementation` to jump to source
- `findReferences` to see all usages across the codebase
- `documentSymbol` to list all symbols in a file
- `hover` for type info without reading the file
- `incomingCalls` / `outgoingCalls` for call hierarchy

Before renaming or changing a function signature, use
`findReferences` to find all call sites first.

Use Grep/Glob only for text/pattern searches (comments,
strings, config values) where LSP doesn't help.

After writing or editing code, check LSP diagnostics before
moving on. Fix any type errors or missing imports immediately.

## Workflow

Treat every task as a structured pair programming session. No "vibe coding" — do not implement large chunks of code autonomously and hope for the best.

### Before implementing

1. **Understand the problem**: Read the relevant code and understand how it relates to the task.
2. **Explain your understanding**: Show the developer what you think the problem is and which code is involved.
3. **Confirm understanding**: Ask the developer if they agree before planning.
4. **Propose a plan**: Suggest solutions (multiple if relevant), broken into small steps.
5. **Confirm the plan**: Never start implementing before getting developer confirmation.

### During implementation

1. **One step at a time**: Give the developer time to review before moving to the next step.
2. **Share new findings**: As your understanding expands, keep the developer in the loop about new problems or needed adjustments.
3. **Report progress**: After each step, explain what was done, what remains, and any blockers/concerns/questions.
4. **Build and test often**: Show proof that the app builds and tests pass.
5. **Never proceed** to the next step without developer confirmation.