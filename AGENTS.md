# AGENTS.md

This file provides guidance to AI agents when working with the code in this repository.

## Project Overview

AtB App is a whitelabel travel companion/ticketing app in Trondheim, Norway.

## Tech Stack

- React Native
- TypeScript
- Tanstack React Query
- pnpm
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
  - modules/: Feature modules (auth, situations, etc.)
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

- **Code formatting**: All generated code must conform to the project's Prettier configuration. Run `pnpm prettier --write` on changed files before the Final gate (step 8) — not necessarily after every individual edit. `pnpm lint` and `pnpm prettier` should never fail on generated code.
- **No `TouchableOpacity`**: Use `PressableOpacity` instead (enforced by ESLint).
- **No default exports** (except SVG assets, translation files, and Storybook stories).
- **No Firebase Auth imports outside `src/modules/auth/`** (enforced by ESLint).
- **Commit messages**: Follow Conventional Commits with Angular preset (e.g. `fix(nearby): ...`, `feat(ticketing): ...`). PR title is what goes into the changelog.
- **Path alias**: `@atb/*` maps to `src/*` (configured in `tsconfig.json` and `jest.config.js`).
- **Time durations**: Use seconds (not minutes) for time duration parameters, consistent with the rest of the codebase (e.g. `secondsBetween`, `significantWaitTime`).

## Development Commands

### Test

- `pnpm test` - Run Jest unit tests, can specify which tests to run using: `pnpm test partlyMatchingPathOrFilename`

### Code Quality

- `pnpm tsc` - Run TypeScript compiler check
- `pnpm lint` - Run ESLint `eslint . --ext .ts,.tsx`
- `pnpm prettier` - Runs `prettier -c src`

### Final verification

- `pnpm check-all` - runs `pnpm tsc && pnpm lint && pnpm test --coverage --coverageReporters && pnpm prettier`

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

**Grep/Glob/Read are for text (and project-wide symbol fallback):**

- String literals, error messages, log lines, comments, TODOs
- Config keys, env var names, route paths, SQL, JSON
- Cross-file text patterns LSP can't model
- Project-wide symbol search (fallback): Don't use LSP `workspaceSymbol` (unreliable on large TS codebases) — use `rg` with a symbol-shaped regex instead (e.g. `rg "\bfunctionName\b"`)

**Diagnostics are a hard gate.**
After every meaningful/logical unit of Edits or Writes to a `.ts` / `.tsx` / `.js` / `.jsx` file, check LSP diagnostics on the changed file(s) immediately. Do not batch edits and check at the end — TS errors cascade and you'll get misleading noise. Fix type errors and missing imports immediately. For project-wide verification beyond single-file diagnostics, see the Final gate (step 8) in the Workflow section.

## Workflow

Treat every task as a structured pair programming session. No "vibe coding" — do not implement large chunks of code autonomously and hope for the best.

### Before implementing

1. **Understand the problem**: Read the relevant code and understand how it relates to the task.
2. **Explain your understanding**: Show the developer what you think the problem is and which code is involved. State your assumptions explicitly. If uncertain, ask.
3. **Confirm understanding**: Ask the developer if they agree before planning.
  - If multiple interpretations exist, present them - don't pick silently.
  - If something is unclear, stop. Name what's confusing. Ask.
4. **Propose a plan**: Suggest solutions (multiple if relevant), broken into small steps.
  - If a simpler approach exists, say so. Push back when warranted.
  - Keep plans extremely concise. Sacrifice grammar for brevity.
  - End each plan with a list of unresolved questions, if any.
5. **Confirm the plan**: Never start implementing before getting developer confirmation.

Don't assume. Don't hide confusion. Surface tradeoffs.

### During implementation

1. **One step at a time:** Pause for review between steps. Exception: purely mechanical changes (rename across files, updating imports) may be batched into one step if the logic is obvious.
2. **Touch only what you must:** Every changed line should trace directly to the task.
  - Don't "improve" adjacent code, comments, or formatting.
  - Don't refactor things that aren't broken.
  - Match existing style, even if you'd do it differently.
  - If you notice unrelated issues, mention them — don't fix them.
3. **Clean up only your own mess:** Remove imports/variables/functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.
4. **Share new findings:** Keep the developer in the loop about new problems or needed adjustments.
5. **Report progress:** After each step, explain what was done, what remains, and any blockers/concerns/questions.
6. **Build and test often:** After each logical step, run `yarn test <relevantPath>` to catch regressions early. LSP diagnostics handle type errors per-step; `yarn tsc` runs as part of the Final gate. This doesn't require developer confirmation — treat it as part of the step.
7. **Never proceed** to the next *logical* step without developer confirmation.
8. **Final gate:** After the last step is confirmed, run `yarn check-all`. No confirmation needed — this is a post-condition, not a step.
