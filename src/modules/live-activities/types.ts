import type {LiveActivityInfo} from '@atb/modules/native';

/** Mirrors the `TransportMode` enum in `ios/Shared/TransportMode.swift`. */
export type TransitLiveActivityMode =
  | 'bus'
  | 'tram'
  | 'rail'
  | 'water'
  | 'walk'
  | 'unknown';

/**
 * Mirrors `TransitActivityAttributes.ContentState` in
 * `ios/Shared/TransitActivityAttributes.swift`. Every field must be present —
 * ActivityKit drops a state it cannot decode, silently.
 */
export type TransitLiveActivityContentState = {
  /** Badge icon + accent color. */
  mode: TransitLiveActivityMode;
  /** Badge number, e.g. "3". */
  lineNumber: string;
  /** Headsign / destination, e.g. "Lohove". */
  lineName: string;
  /** The instruction line, e.g. "6 stopp igjen". Localized here, not natively. */
  title: string;
  /**
   * Arrival/departure time shown on the clock, as unix **seconds**. Absolute,
   * not a countdown — the widget ticks it down itself.
   */
  eventTime: number;
};

/** A running Live Activity that ActivityKit has issued a push token for. */
export type LiveActivityWithPushToken = LiveActivityInfo & {pushToken: string};
