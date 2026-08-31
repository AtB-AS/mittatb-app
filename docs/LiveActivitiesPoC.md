# iOS Live Activities — Proof of Concept

This documents the Live Activities PoC: what was built, how to run it, and — most
importantly for the real implementation — **how Live Activity updates actually
work** (local and push).

Live Activities show glanceable, live-updating trip info on the **lock screen**
and in the **Dynamic Island** (e.g. "walk to stop X, take bus 42", "get off at
next stop", "departs 09:53"). iOS 16.1+ (this PoC targets 16.2+).

## Scope of the PoC

- **AtB flavor only.**
- Local updates driven from the app via a debug-menu interface. No server, no real
  trip data yet.
- **Push updates verified by hand** — the activity requests a push token, and
  updates have been sent to it from Apple's Push Notifications Console. No backend.
  See [Testing push updates by hand](#testing-push-updates-by-hand).
- Real-brand SwiftUI design (three trip phases + Dynamic Island).

Not in scope (see [Real implementation](#real-implementation-what-comes-next)):
a push backend, push-to-start, real data, other whitelabel flavors, Fastlane/Match
provisioning for the new target.

## How to run it

1. `cd ios && pod install` (regenerates TurboModule codegen for the new module).
2. Open `ios/atb.xcworkspace`, build the **app** scheme on an **iOS 16.2+
   simulator** or device. (Simulators support Live Activities.)
3. In the app: **Profile → Debug info** (the debug menu). The first section is
   **"Live Activities (PoC)"**.
4. Tap a **Start** button, then **lock the screen** (Cmd+L on simulator) to see
   the lock-screen banner. Long-press the Dynamic Island on devices/simulators
   that have one (e.g. iPhone 15 Pro).
5. **Update** buttons mutate the running activity (e.g. → "get off now / STOPPER").
   **End** / **End all** remove it.

> Device (non-simulator) builds: the new `liveActivity` extension target uses
> manual signing and references a `match Development …liveactivity` profile that
> does not exist yet. Simulator builds ignore provisioning, so the PoC runs there
> without setup. For device/TestFlight, see
> [Whitelabel & signing](#whitelabel--signing-rollout).

### Dynamic Island — presentations & gotchas

A Live Activity has **four presentations**, all implemented here. The _system_
(not the app) chooses which to show, based on foreground state, how many
activities are active, and user interaction:

| Presentation         | When it shows                                                                  | Code                                                      |
| -------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Lock screen / banner | on the lock screen; slides down as a banner on start                           | `TransitLockScreenView`                                   |
| Compact              | small bits hugging the pill — the idle island state with one activity          | `compactLeading` + `compactTrailing`                      |
| Minimal              | tiny circle — when several activities are active, each collapses to this       | `minimal`                                                 |
| Expanded             | the big full-width view — on long-press, and auto-pops briefly on start/update | `DynamicIslandExpandedRegion(.leading/.trailing/.bottom)` |

Gotchas when testing (these are system behavior, not bugs):

- **Needs a Pro model to appear at all.** Use an iPhone 14 Pro / 15 Pro / 16 Pro
  simulator (or device). Non-Pro models show the **lock screen only** — no island.
- **The island stays expanded while the owning app is in the foreground.** To see
  it collapse to **compact**, background the app (Home / `⇧⌘H` on simulator). It
  will not compact while you sit on the debug screen.
- **Every `Update` re-triggers the brief auto-expand**, so rapid updates keep it
  popping open.
- Long-press the compact island to expand on demand.
- Dynamic Island rendering is flaky on the simulator; if compact/minimal never
  appear, verify on a physical Pro device.

## Architecture

```
JS (debug menu)
  └─ NativeLiveActivities (TurboModule spec, src/modules/native/NativeLiveActivities.ts)
       └─ RCTLiveActivities (.h/.mm, ObjC++ TurboModule bridge)     ┐
            └─ LiveActivitiesImpl.swift (ActivityKit start/update/end) │ app target
                 └─ Activity<TransitActivityAttributes>               ┘
                        ⇅  (shared attributes type, dual target membership)
liveActivity widget extension (SwiftUI)  ── renders lock screen + Dynamic Island
```

### Files

**Native module (app target)** — lives in `ios/TurboModules/`, which is an Xcode
_file-system-synchronized group_, so files there compile into the app
automatically (no `.pbxproj` entry needed):

- `LiveActivitiesImpl.swift` — ActivityKit logic (`Activity.request/update/end`,
  authorization check, and `observe(_:)`: push-token / content / lifecycle logging).
- `RCTLiveActivities.h` / `.mm` — TurboModule bridge (mirrors `RCTApplePayHandler`).
- `LiveActivitiesImplObjC.h` — ObjC-visible declaration of the Swift impl.

**Shared model** — `ios/Shared/TransitActivityAttributes.swift`:

- The ActivityKit model, plus the hand-written `ContentState.init(from:)` (see
  [Data model](#data-model)) and `debugJson`. **Member of BOTH the `app` and
  `liveActivity` targets** (the same source compiled into both). This is mandatory:
  if it were only in the extension, `Activity.request` would succeed but nothing
  would render.

**Widget extension (`liveActivity` target)** — `ios/liveActivity/`:

- `TransitLiveActivity.swift` — `Widget` with `ActivityConfiguration` + `DynamicIsland`.
- `TransitLockScreenView.swift` — the two-row light card + shared subviews
  (`LineBadge`, `IllustrationIcon`, `TimeText`).
- `TransitTheme.swift` — AtB colors/fonts/icons (hardcoded for the PoC).
- `LiveActivityBundle.swift` — `@main WidgetBundle`.
- `Info.plist`, `liveActivity.entitlements`, `liveActivityDebug.entitlements`.

**JS/config:**

- `src/modules/native/NativeLiveActivities.ts` — TurboModule spec (payloads are
  JSON strings, keeping codegen trivial and the shape free to evolve).
- `src/stacks-hierarchy/.../components/DebugLiveActivities.tsx` — the debug UI.
- `package.json` → `codegenConfig.ios.modulesProvider` maps
  `"LiveActivities": "RCTLiveActivities"`.
- `ios/atb/Info.plist` → `NSSupportsLiveActivities = true` (required on the **app**).
- `scripts/get-activity-payload.sh` — prints an APNs payload with a fresh
  `timestamp`/`eventTime` for the Push Console.

The `liveActivity` Xcode target was added by
`scripts`-style Ruby using the `xcodeproj` gem, mirroring the existing
`departureWidget` extension (same base xcconfig, signing, embedding).

### Data model

The lock screen is a **two-row light card** (matching the AtB reference design):

```
┌────────────────────────────────────────────┐
│ [illustration]  6 stopp igjen               │  row 1: title
│                 Du skal av på Nidarosdomen   │          subtitle
│ ──────────────────────────────────────────  │
│ ( 🚌 3 )        3 Lohove                     │  row 2: "lineNumber lineName"
│                 Ankommer Nidarosdomen 08:30  │          footnote + time
└────────────────────────────────────────────┘
```

`TransitActivityAttributes` (static, fixed per activity):

| field        | meaning                                |
| ------------ | -------------------------------------- |
| `toName`     | final destination, e.g. "Nidarosdomen" |
| `brandLabel` | operator label, e.g. "AtB"             |
| `tripId`     | stable trip id                         |

`ContentState` (dynamic, updated as the trip progresses):

| field                    | meaning                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `mode`                   | `bus` \| `tram` \| `rail` \| `water` \| `walk` — badge icon + accent |
| `lineNumber`, `lineName` | badge number + row-2 title, e.g. "3" / "Lohove"                      |
| `title`                  | row-1 bold line, e.g. "6 stopp igjen"                                |
| `subtitle`               | row-1 secondary, e.g. "Du skal av på Nidarosdomen"                   |
| `footnote`               | row-2 secondary prefix, e.g. "Ankommer Nidarosdomen" (time appended) |
| `eventTime`              | arrival/departure time for the clock/countdown (see below)           |
| `eventIsCountdown`       | render `eventTime` as a live countdown vs absolute clock             |
| `pushMessage` (optional) | PoC only: free text shown on the lock screen, to verify push         |

Text (`title`/`subtitle`/`footnote`) is passed **pre-formatted/localized from JS**,
so the widget stays dumb. The row-1 illustration is a placeholder tile
(`IllustrationIcon`) — drop a real artwork image into the extension and swap it.

**Store an absolute `Date`, not a minute count.** The widget self-ticks with
`Text(timerInterval:)` / `Text(date, style: .timer)`; widgets can't run timers, so
never push per-minute integer updates.

**`eventTime` is an ISO-8601 string everywhere** — JS, push payloads, and
ActivityKit's own app→extension transfer — with fractional seconds optional on the
way in and always written on the way out.

That only holds because `ContentState` has a hand-written `init(from:)` **and**
`encode(to:)` that read/write the string themselves. **Don't delete them and fall
back on synthesized conformance.** `Date` is otherwise coded via the _coder's_
`dateDecodingStrategy`, and two coders touch this type that we don't configure:
ActivityKit's internal one, and the one decoding pushed `content-state`. Both
default to numeric seconds since 2001-01-01, so with synthesized conformance an
ISO string in a push is rejected and the Live Activity just greys out with a
spinner — decoding fails before any of our code runs, so nothing is logged.

---

## How updates work

This is the part that matters for the real feature. There are two mechanisms:
**local** (used by the PoC) and **push** (needed in production).

### Lifecycle basics

- Start with `Activity.request(attributes:content:pushType:)`. `pushType: nil`
  = local-only; `pushType: .token` = APNs-updatable.
- Update with `await activity.update(ActivityContent(state:staleDate:))`.
- End with `await activity.end(_:dismissalPolicy:)` — `.immediate` removes it at
  once; `.default` keeps it on the lock screen up to ~4h; `.after(date)` is timed.
- **System limits:** an activity can be _updated_ for up to **8 hours**, then stays
  visible (not updatable) for up to **12 hours** total before the system ends it.
- **Authorization:** `ActivityAuthorizationInfo().areActivitiesEnabled` (users can
  turn Live Activities off per-app in Settings). The PoC checks this before start.

### 1. Local updates (what the PoC uses)

The app calls `activity.update(...)` directly.

- **Foreground:** works freely and immediately.
- **Background:** works, but on a **budget**. iOS throttles background runtime;
  you get updates via BGTask / significant-location / silent push wake-ups, and
  frequent background updates get rate-limited. You cannot reliably update every
  minute from the background this way.
- **Suspended/terminated:** no local updates happen at all.

➡️ Local updates alone are fine for a demo and for short foreground flows, but
**not** for a trip that runs while the phone is locked in a pocket. That needs push.

### 2. Push updates (needed for production)

ActivityKit updates the activity from **APNs**, even when the app is suspended.

**a) Per-activity update token**

- Start with `pushType: .token`, then read the token stream:
  ```swift
  for await tokenData in activity.pushTokenUpdates {
    let token = tokenData.map { String(format: "%02x", $0) }.joined()
    // send `token` + activity id to our backend
  }
  ```
- The token can rotate — always send the latest. Register it server-side keyed by
  trip/activity.

**b) The APNs push — the backend calls APNs directly**

> ⚠️ **FCM does not forward `liveactivity` pushes.** Even though the app uses
> Firebase, the backend must speak the **APNs HTTP/2 protocol itself** for Live
> Activity updates — a separate path from the normal notification flow (same
> `.p8` key, different push type/topic).

"Directly" means: one HTTP/2 `POST` per update to Apple's push gateway.

**Endpoint**

```
POST https://api.push.apple.com/3/device/<PUSH_TOKEN_HEX>       # production
POST https://api.sandbox.push.apple.com/3/device/<PUSH_TOKEN_HEX>  # dev builds
```

- HTTP/2 is mandatory (APNs rejects HTTP/1.1).
- `<PUSH_TOKEN_HEX>` = the **per-activity token from `activity.pushTokenUpdates`**
  (or the `pushToStartTokenUpdates` token for `event:"start"`). **Not** the FCM
  token, **not** the normal APNs device token.
- Environment must match the build: **sandbox** for dev/TestFlight-dev,
  **production** otherwise — mismatch is the #1 "push silently does nothing" cause.

**Auth (token-based, recommended)**

- Apple Developer portal → create an **APNs Auth Key** → download `.p8` (EC P-256
  private key) + note **Key ID** + **Team ID**. One key covers all team apps.
- Build a JWT, **ES256**-signed with the `.p8`:
  - header `{ "alg":"ES256", "kid":"<KeyID>" }`
  - claims `{ "iss":"<TeamID>", "iat": <now-unix> }`
- Send as `authorization: bearer <JWT>`. **Reuse it; refresh < 60 min** (APNs
  rejects tokens > 1h old and 429s if you mint one per request).
- Store `.p8` + Key ID + Team ID in the secret manager.

**Headers**

```
authorization:  bearer <JWT>
apns-push-type: liveactivity
apns-topic:     <app-bundle-id>.push-type.liveactivity
apns-priority:  10        # or 5 for routine ticks
apns-expiration: 0
```

**Body — must match `ContentState` exactly**

```jsonc
{
  "aps": {
    "timestamp": 1751443260, // REQUIRED, unix seconds; orders/dedups updates
    "event": "update", // "update" | "end"  ("start" for push-to-start)
    "content-state": {
      // EXACT Codable shape of our ContentState
      "mode": "bus",
      "lineNumber": "3",
      "lineName": "Lohove",
      "title": "2 stopp igjen",
      "subtitle": "Du skal av på Nidarosdomen",
      "footnote": "Ankommer Nidarosdomen",
      "eventTime": "2026-08-31T09:41:00Z", // ISO-8601; see Data model
      "eventIsCountdown": false,
    },
    "stale-date": 1751443560, // grey out if no fresh update by then
    "relevance-score": 100, // Dynamic Island ordering when several exist
    "dismissal-date": 1751443560, // only for event:"end"
    // "alert": { "title": "…", "body": "…" }   // optional: also notify the user
  },
}
```

- Every non-optional `ContentState` field must be present; one missing or misencoded
  field drops the whole payload silently. Limit ~4 KB. `eventTime` is an ISO-8601
  string, which works only because of the hand-written Codable conformance — see
  [Data model](#data-model).
- `timestamp` must be current and increasing; older values are dropped as stale.

**Responses to handle**

- `200` = accepted (not a delivery guarantee).
- `400 BadDeviceToken` / `403` (bad JWT) → fix config.
- `410` → token dead: **stop pushing it, prune from DB**.
- `429` / `413` → back off / shrink payload.

**End-to-end**

```
app:  Activity.request(pushType:.token)
        └ pushTokenUpdates → hex ──► POST /our-api {activityId, tripId, token, env}
backend: store token ↔ trip ↔ user
  on real-time event (delay / next stop / arrival):
        build JWT → HTTP/2 POST api.push.apple.com/3/device/<token> (headers + body)
  on arrival: event:"end"
app:  token rotates → re-POST the new token   (must be handled)
```

**Rust backend (Axum)** — two options:

- **Thin & full control:** `reqwest` (HTTP/2) + `jsonwebtoken` (ES256 with the
  `.p8`); set the `apns-push-type`/`apns-topic` headers + body yourself. Simplest
  for the custom `liveactivity` type.
- **Crate:** `a2` (async APNs, token auth) — set the custom topic/push-type;
  verify it exposes `liveactivity`.

**c) Push-to-start (iOS 17.2+)**

- Start an activity remotely with the app **not running**:
  ```swift
  for await token in Activity<TransitActivityAttributes>.pushToStartTokenUpdates { … }
  ```
  Send that token to the backend; push with `event: "start"` and both
  `content-state` and `attributes`. Lets us begin a trip activity from a server
  signal (e.g. a scheduled departure) without the user opening the app.

**d) Frequent updates**

- For minute-by-minute updates (approaching a stop), add
  `NSSupportsLiveActivitiesFrequentUpdates = true` to the **app** Info.plist. Even
  then there is a delivery budget; use `apns-priority: 5` for routine ticks and
  `10` only for important changes (alight now, big delay). Prefer letting the
  widget self-tick the countdown and only push when the _facts_ change (delay,
  platform, next stop), not every minute.

**e) Staleness & relevance**

- `stale-date` / `staleDate`: after it passes, iOS greys the content as "stale" —
  set it so the UI never shows confidently-wrong times if updates stop.
- `relevance-score`: when several Live Activities exist, higher scores win the
  Dynamic Island.

### Testing push updates by hand

No backend needed. Apple's [Push Notifications
Console](https://icloud.developer.apple.com/dashboard/notifications) sends the
push, so there is no `.p8`, JWT or script to set up.

**A physical device is required** — the simulator never issues an ActivityKit push
token (`pushTokenUpdates` simply never emits). That means the `liveActivity`
target's signing must be sorted first, see
[Device / CI signing](#device--ci-signing-required-before-any-device--testflight-build).

1. Run the app from Xcode on a device, then **Profile → Debug info → Start**.
2. Copy the token from the Xcode console:
   `[LiveActivity] push token: …`. It is **much longer than a 64-char device
   token** (100+ hex chars) — copying only the first line is an easy mistake, and
   yields "discarded as application was not registered".
3. Generate a payload with a fresh `timestamp` and `eventTime`:
   ```
   scripts/get-activity-payload.sh <push-token> | pbcopy
   ```
4. In the console: paste the token as recipient, set **Push Type =
   `liveactivity`**, environment **Development** for Debug builds, paste the
   payload, send. `apns-topic` is fixed to the app bundle id in the UI; the console
   appends `.push-type.liveactivity` itself.

Tokens are per-activity and per-install: they die when the activity ends, when
End/End all is tapped, and on every reinstall. Re-copy after each Start.

**Diagnosing a push that does nothing**

| symptom                                                             | cause                                       |
| ------------------------------------------------------------------- | ------------------------------------------- |
| console delivery log: "discarded as application was not registered" | truncated/stale token, or wrong environment |
| activity greys out with a spinner                                   | `content-state` failed to decode            |
| nothing at all, activity unchanged                                  | stale `timestamp`, or the activity ended    |

Logs, in two different processes:

- **App target** — `[LiveActivity] started / push token / content update / activity
state`, from `observe(_:)` in `LiveActivitiesImpl.swift`. Xcode console. Only fires
  while the app process is alive.
- **Widget extension** — `[LiveActivity] render:` (DEBUG only), from
  `TransitLockScreenView`. **Not** in the Xcode console; use Console.app with the
  device selected, or:
  ```
  log stream --device-name "<iPhone>" --predicate 'eventMessage CONTAINS "[LiveActivity]"'
  ```
  This is the one that proves a push landed while the app was suspended.

Both log the _decoded_ `ContentState` — the raw APNs payload is never handed to the
app. A payload ActivityKit rejects produces no log line at all; those errors appear
only in the system log:

```
log stream --device-name "<iPhone>" --predicate 'process == "liveactivitiesd" OR process == "apsd"'
```

`apsd` silent means the push never reached the phone (token/topic/environment);
`apsd` logging it but `liveactivitiesd` erroring means the payload is wrong.

### App Group / shared data

The extension is a separate bundle and cannot read the app's JS state. Both the
app and `liveActivity` targets already share `$(APP_GROUP_NAME)` (in the
entitlements). If the widget ever needs richer local data (icons, cached
timetable) beyond what's in `ContentState`, write it to the shared App Group
container (as `departureWidget` does) and read it in the extension.

---

## Real implementation: what comes next

1. **Data source.** Map real trip/departure data → `ContentState`. Trigger points:
   - `start` when a journey begins (or push-to-start at scheduled departure).
   - `update` on delay changes, next-stop transitions, transfers (`lineNumber`
     can change mid-trip — it lives in `ContentState`, not attributes).
   - `getOff` + `alert` when approaching the alight stop; `end` on arrival.
2. **Push backend.** Store per-activity push tokens; send APNs `liveactivity`
   pushes on real-time events (SIRI/real-time feed). Add push-to-start tokens for
   remote start. This is where the bulk of the real work is — the app side is
   mostly done.
3. **Localization.** `headline`/`secondaryText` are currently passed pre-formatted
   from JS. Keep localizing on the JS side (reuse `@atb/translations`) so the
   extension stays dumb, or move to string catalogs in the extension.
4. **Theming from tokens.** Colors are hardcoded in `TransitTheme.swift`. Generate
   them from `@atb-as/theme` (or an App Group / build-time export) so brand changes
   don't drift.

### Device / CI signing (required before any device / TestFlight build)

**The simulator PoC needs none of this** — simulators don't enforce signing. But
the `liveActivity.appex` is embedded in the app, so the moment you build for a
device or archive through Fastlane/CI, code signing for the new
`$(IOS_APP_LIVEACTIVITY_IDENTIFIER)` bundle id must be wired up. Today it
is **not**, so device/TestFlight/archive builds will fail signing.

`fastlane/Fastfile` is hardcoded for exactly three identifiers
(`IOS_BUNDLE_IDENTIFIER`, `IOS_APP_WIDGET_IDENTIFIER`, `IOS_APP_INTENT_IDENTIFIER`).
Add the fourth everywhere they appear:

1. `IOS_APP_LIVEACTIVITY_IDENTIFIER` must be set in **every** `env/*/*/.env` (it is
   the extension's `PRODUCT_BUNDLE_IDENTIFIER`, with no fallback) — e.g.
   `no.mittatb.debug.tripLiveActivity` for `env/atb/dev`. Add it to each
   `ensure_env_vars`. It must be prefixed by that env's app bundle id.
2. Add it to every `match(...)` `identifiers:` array (the arrays currently listing
   the three ids).
3. Add an `update_project_provisioning` call with `target_filter: "liveActivity"`
   inside the widget-enabled block (mirror the `departureWidget`/`AtbAppIntent`
   calls) — plus a `liveact_cert_info` helper mirroring `widget_cert_info`.
4. Add the id → profile mapping to `build_app` `export_options.provisioningProfiles`.
5. Run Match (`update_devices` / cert generation) so it creates the
   Live Activity Development + distribution profiles in the Match git repo.

For local Debug **device** builds, the target references a
`match Development $(IOS_APP_LIVEACTIVITY_IDENTIFIER)` profile in its Debug config
— create that via Match first. The Release config is left empty (like the other extensions) so
Fastlane injects the distribution profile at CI time.

### Whitelabel rollout (other flavors)

Per non-AtB flavor (FRAM, Nfk, Troms, …): the bundle id comes from each flavor's
`IOS_APP_LIVEACTIVITY_IDENTIFIER`, so every `env/*/*/.env` needs its own value,
and each flavor still needs its own Match profiles (step 5 above per
flavor) and per-brand colors in `TransitTheme.swift` (or generated tokens).

## Known limitations of the PoC

- No backend and no real data; pushes are sent by hand from the Push Console, and
  the push token is only logged, never uploaded.
- `pushMessage` and the `[LiveActivity]` logging are debug scaffolding — drop them
  when real data lands.
- Push requires a device (no simulator tokens); AtB flavor only, device signing not
  set up.
- Colors/fonts hardcoded; strings pre-formatted in JS.
- Dynamic Island expanded layout is tuned for the onboard/alight phases.
