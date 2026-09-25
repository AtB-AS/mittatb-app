import {TurboModule, TurboModuleRegistry} from 'react-native';
import type {CodegenTypes} from 'react-native';

/**
 * A running Live Activity, identified by the ActivityKit activity id and the
 * trip it follows (from the activity's static attributes).
 *
 * `apnsToken` is the per-activity APNs token the backend pushes updates to. It
 * is absent until ActivityKit issues one, and never issued at all on the
 * simulator.
 */
export type LiveActivityInfo = {
  activityId: string;
  tripId: string;
  apnsToken?: string;
};

/**
 * Native module for iOS Live Activities (ActivityKit).
 *
 * The attributes (static) and content-state (dynamic) are passed as JSON
 * strings so the codegen spec stays trivial and the payload shape can evolve
 * without regenerating native code. See the Swift `TransitActivityAttributes`
 * for the expected JSON shape, and `buildTransitPayload` in the debug UI for a
 * typed helper that produces it.
 *
 * iOS only. On Android this resolves to `null` (guard before use).
 */
export interface Spec extends TurboModule {
  /**
   * The APNs push token for an activity, emitted when ActivityKit first issues
   * one and on every later rotation. Activities started in an earlier app
   * process emit here too, once they are observed again on startup.
   */
  readonly onPushTokenUpdate: CodegenTypes.EventEmitter<LiveActivityInfo>;
  /** Emitted once per activity when it ends or is dismissed. */
  readonly onActivityEnded: CodegenTypes.EventEmitter<LiveActivityInfo>;

  /**
   * Every running activity with its current push token. Events emitted before
   * JS subscribed are lost, so call this on startup to reconcile.
   */
  getActiveActivities(): Promise<LiveActivityInfo[]>;
  /** Whether the user has Live Activities enabled for this app. */
  areActivitiesEnabled(): boolean;
  /**
   * Start a new Live Activity. Resolves with the ActivityKit activity id,
   * which is needed for later `updateActivity` / `endActivity` calls.
   *
   * The attributes must carry the `tripId` of a saved trip — it is what ties
   * the push token emitted by `onPushTokenUpdate` to a trip on the backend.
   */
  startActivity(
    attributesJson: string,
    contentStateJson: string,
  ): Promise<string>;
  /** Update the dynamic content-state of a running activity. */
  updateActivity(activityId: string, contentStateJson: string): Promise<void>;
  /** End a single activity. `dismissImmediately` removes it from the UI at once. */
  endActivity(activityId: string, dismissImmediately: boolean): Promise<void>;
  /** End every running activity for this app immediately. */
  endAllActivities(): Promise<void>;
}

export const NativeLiveActivities = TurboModuleRegistry.get<Spec>(
  'LiveActivities',
) as Spec | null;
