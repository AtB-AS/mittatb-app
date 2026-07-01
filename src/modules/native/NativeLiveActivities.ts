import {TurboModule, TurboModuleRegistry} from 'react-native';

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
  /** Whether the user has Live Activities enabled for this app. */
  areActivitiesEnabled(): boolean;
  /**
   * Start a new Live Activity. Resolves with the ActivityKit activity id,
   * which is needed for later `updateActivity` / `endActivity` calls.
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
