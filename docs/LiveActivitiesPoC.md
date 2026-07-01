# iOS Live Activities — Proof of Concept

This documents the Live Activities PoC: what was built, how to run it, and — most
importantly for the real implementation — **how Live Activity updates actually
work** (local and push).

Live Activities show glanceable, live-updating trip info on the **lock screen**
and in the **Dynamic Island** (e.g. "walk to stop X, take bus 42", "get off at
next stop", "departs 09:53"). iOS 16.1+ (this PoC targets 16.2+).

## Scope of the PoC

- **AtB flavor only.**
- **Local updates only** — everything is driven from the app while it runs, via a
  debug-menu interface. No push, no server, no real trip data yet.
- Real-brand SwiftUI design (three trip phases + Dynamic Island).

Not in scope (see [Real implementation](#real-implementation-what-comes-next)):
push updates, push-to-start, real data, other whitelabel flavors, Fastlane/Match
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

A Live Activity has **four presentations**, all implemented here. The *system*
(not the app) chooses which to show, based on foreground state, how many
activities are active, and user interaction:

| Presentation | When it shows | Code |
|---|---|---|
| Lock screen / banner | on the lock screen; slides down as a banner on start | `TransitLockScreenView` |
| Compact | small bits hugging the pill — the idle island state with one activity | `compactLeading` + `compactTrailing` |
| Minimal | tiny circle — when several activities are active, each collapses to this | `minimal` |
| Expanded | the big full-width view — on long-press, and auto-pops briefly on start/update | `DynamicIslandExpandedRegion(.leading/.trailing/.bottom)` |

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
*file-system-synchronized group*, so files there compile into the app
automatically (no `.pbxproj` entry needed):

- `LiveActivitiesImpl.swift` — ActivityKit logic (`Activity.request/update/end`,
  authorization check, lenient ISO-8601 date decoding).
- `RCTLiveActivities.h` / `.mm` — TurboModule bridge (mirrors `RCTApplePayHandler`).
- `LiveActivitiesImplObjC.h` — ObjC-visible declaration of the Swift impl.

**Widget extension (`liveActivity` target)** — `ios/liveActivity/`:

- `TransitActivityAttributes.swift` — the ActivityKit model. **Member of BOTH the
  `app` and `liveActivity` targets** (the same source compiled into both). This is
  mandatory: if it were only in the extension, `Activity.request` would succeed
  but nothing would render.
- `TransitLiveActivity.swift` — `Widget` with `ActivityConfiguration` + `DynamicIsland`.
- `TransitLockScreenView.swift` — the three lock-screen layouts + shared subviews.
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

The `liveActivity` Xcode target was added by
`scripts`-style Ruby using the `xcodeproj` gem, mirroring the existing
`departureWidget` extension (same base xcconfig, signing, embedding).

### Data model

`TransitActivityAttributes` (static, fixed per activity):

| field | meaning |
|---|---|
| `toName` | final destination, e.g. "Festplassen" |
| `brandLabel` | operator label, e.g. "AtB" |
| `tripId` | stable trip id |

`ContentState` (dynamic, updated as the trip progresses):

| field | meaning |
|---|---|
| `phase` | `walking` \| `waiting` \| `onboard` \| `getOff` — selects the layout |
| `mode` | `bus` \| `tram` \| `rail` \| `water` \| `walk` — icon + accent color |
| `lineNumber`, `lineName` | line badge, e.g. "42 Sentrum" |
| `fromStopName`, `toStopName` | board / alight (or walk-to) stops |
| `headline`, `secondaryText` | instruction labels, e.g. "Gå av på" / "Neste stopp" |
| `eventTime` (ISO-8601) | departure/arrival time used for the clock/countdown |
| `eventIsCountdown` | render `eventTime` as a live countdown vs absolute clock |
| `alert`, `alertText` | emphasis + badge (e.g. "STOPPER") |

**Store an absolute `Date`, not a minute count.** The widget self-ticks with
`Text(timerInterval:)` / `Text(date, style: .timer)`; widgets can't run timers, so
never push per-minute integer updates.

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
- **System limits:** an activity can be *updated* for up to **8 hours**, then stays
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

**b) The APNs push**

- Endpoint: APNs (token-based auth, `.p8` key). Environment must match the build:
  **sandbox** for dev/TestFlight-dev, **production** otherwise — mismatched
  environment is the #1 "push silently does nothing" cause.
- Headers:
  - `apns-push-type: liveactivity`
  - `apns-topic: <app-bundle-id>.push-type.liveactivity`
  - `apns-priority: 10` (immediate) or `5` (throttled/low-power)
- Payload:
  ```jsonc
  {
    "aps": {
      "timestamp": 1712345678,
      "event": "update",              // or "start" (17.2+) / "end"
      "content-state": { /* exactly the ContentState JSON */ },
      "stale-date": 1712349278,       // when the content should be considered stale
      "relevance-score": 100,          // Dynamic Island ordering when several exist
      "dismissal-date": 1712349278,    // for event:"end"
      "alert": { "title": "…", "body": "…" } // optional: also alerts the user
    }
  }
  ```
- `content-state` must be **exactly** the `Codable` shape of `ContentState`
  (including the `eventTime` date encoding the app expects).

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
  widget self-tick the countdown and only push when the *facts* change (delay,
  platform, next stop), not every minute.

**e) Staleness & relevance**

- `stale-date` / `staleDate`: after it passes, iOS greys the content as "stale" —
  set it so the UI never shows confidently-wrong times if updates stop.
- `relevance-score`: when several Live Activities exist, higher scores win the
  Dynamic Island.

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
`$(IOS_APP_WIDGET_IDENTIFIER).liveactivity` bundle id must be wired up. Today it
is **not**, so device/TestFlight/archive builds will fail signing.

`fastlane/Fastfile` is hardcoded for exactly three identifiers
(`IOS_BUNDLE_IDENTIFIER`, `IOS_APP_WIDGET_IDENTIFIER`, `IOS_APP_INTENT_IDENTIFIER`).
Add the fourth everywhere they appear:

1. Add an env var, e.g. `IOS_APP_LIVEACTIVITY_IDENTIFIER` =
   `$(IOS_APP_WIDGET_IDENTIFIER).liveactivity` (and to each `ensure_env_vars`).
2. Add it to every `match(...)` `identifiers:` array (the arrays currently listing
   the three ids).
3. Add an `update_project_provisioning` call with `target_filter: "liveActivity"`
   inside the widget-enabled block (mirror the `departureWidget`/`AtbAppIntent`
   calls) — plus a `liveact_cert_info` helper mirroring `widget_cert_info`.
4. Add the id → profile mapping to `build_app` `export_options.provisioningProfiles`.
5. Run Match (`update_devices` / cert generation) so it creates the
   `…liveactivity` Development + distribution profiles in the Match git repo.

For local Debug **device** builds, the target references a
`match Development …liveactivity` profile in its Debug config — create that via
Match first. The Release config is left empty (like the other extensions) so
Fastlane injects the distribution profile at CI time.

### Whitelabel rollout (other flavors)

Per non-AtB flavor (FRAM, Nfk, Troms, …): the bundle id
`$(IOS_APP_WIDGET_IDENTIFIER).liveactivity` already parameterizes per flavor via
xcconfig, but each flavor still needs its own Match profiles (step 5 above per
flavor) and per-brand colors in `TransitTheme.swift` (or generated tokens).

## Known limitations of the PoC

- Local updates only; no push, no real data.
- AtB flavor only; device signing not set up.
- Colors/fonts hardcoded; strings pre-formatted in JS.
- Dynamic Island expanded layout is tuned for the onboard/alight phases.
