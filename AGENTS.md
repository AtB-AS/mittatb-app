# AGENTS.md

This file provides guidance to AI agents when working with the code in this repository.

## Project Overview

AtB App is a whitelabel travel companion/ticketing app in Trondheim, Norway.

## Tech Stack

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

**BLOCKING: LSP for navigating or editing symbols.**
Navigating symbols MUST use LSP! Before any Edit to a `.ts`/`.tsx` file that changes a symbol, you MUST run the corresponding LSP operation first. No exceptions — do not skip this and use Grep instead.

| Trigger                                                       | Required LSP operation                                   |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| Adding, removing, or renaming a **prop**                      | `findReferences` on the prop/type to find all call sites |
| Adding, removing, or renaming a **function/component export** | `findReferences` to find all consumers                   |
| Changing a **type or interface** shape                        | `findReferences` on the type to find all usages          |
| Navigating to a symbol's **definition** (to understand it)    | `goToDefinition` (not Grep, not Read + scroll)           |
| Checking what **type** a variable/param has                   | `hover` (not opening the file to read)                   |
| Understanding a file's **exports**                            | `documentSymbol` (not reading the whole file)            |
| Tracing **who calls** a function                              | `incomingCalls` (not grepping the function name)         |

**When an LSP call returns empty or errors, do not silently fall back to grep.** Try in order:

1. Retry with the fully-qualified name (`Namespace.Symbol`, or the imported name in scope)
2. `documentSymbol` on the likely file to confirm the symbol exists and check its exact name
3. Only then grep — and say out loud why LSP didn't work

**Grep/Glob/Read are for text, not symbols:**

- String literals, error messages, log lines, comments, TODOs
- Config keys, env var names, route paths, SQL, JSON
- Cross-file text patterns LSP can't model
- Project-wide symbol search: LSP `workspaceSymbol` is unreliable on large TS codebases — use `rg` with a symbol-shaped regex instead (e.g. `rg "\bfunctionName\b"`)

**Diagnostics are a hard gate.**
After every meaningful/logical unit of Edits or Writes to a `.ts` / `.tsx` / `.js` / `.jsx` file, check diagnostics on that file before the next tool call. Do not batch edits and check at the end — TS errors cascade and you'll get misleading noise. Fix type errors and missing imports immediately.

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
