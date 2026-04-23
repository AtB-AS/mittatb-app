---
name: create-feature-toggle
description: Add a new feature toggle backed by Firebase Remote Config. Use when the user asks to create a new feature toggle.
---

## Required Input

Ask the user for:
1. **Feature name** - descriptive name (e.g. "surface view map", "ticket information")
2. **Default value** - `true` or `false`

The remote config key will be derived as `enable_<snake_case_name>` and the toggle spec name as `is<PascalCaseName>Enabled`.

## Steps

### 1. Add to Remote Config type (`src/modules/remote-config/remote-config.ts`)

Add the new key to the `RemoteConfig` type (keep alphabetical order among `enable_*` keys):

```ts
enable_<name>: boolean;
```

### 2. Set the default value (`src/modules/remote-config/remote-config.ts`)

Add to `defaultRemoteConfig` (keep alphabetical order):

```ts
enable_<name>: <default_value>,
```

### 3. Read from Firebase (`src/modules/remote-config/remote-config.ts`)

In the `getConfig()` function, add a variable that reads the value with fallback to default (keep alphabetical order among similar declarations):

```ts
const enable_<name> =
  values['enable_<name>']?.asBoolean() ??
  defaultRemoteConfig.enable_<name>;
```

Then add `enable_<name>` to the returned object in `getConfig()` (keep alphabetical order).

### 4. Add toggle specification (`src/modules/feature-toggles/toggle-specifications.ts`)

Add a new entry to the `toggleSpecifications` array (keep alphabetical order):

```ts
{
  name: 'is<PascalCaseName>Enabled',
  remoteConfigKey: 'enable_<name>',
},
```

### 5. Verify

Run `yarn tsc` to check for type errors, then run `yarn prettier --write` on changed files followed by `yarn prettier` to verify formatting.
