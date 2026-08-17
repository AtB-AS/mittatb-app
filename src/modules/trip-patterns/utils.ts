import {TripPattern} from '@atb/api/types/trips';

export function getTripPatternKey(tripPattern: TripPattern): string {
  return tripPattern.legs
    .filter((l) => l.id)
    .map((l) => l.id)
    .join('|');
}

const MIN_SIGNIFICANT_WAIT_IN_SECONDS = 30;

/**
 * Whether a wait time is long enough to be worth displaying to the user.
 * Wait times of 30 seconds or less are considered insignificant noise.
 */
export function significantWaitTime(seconds: number): boolean {
  return seconds > MIN_SIGNIFICANT_WAIT_IN_SECONDS;
}

const SHORT_TRANSFER_TIME_LIMIT_IN_SECONDS = 120;
/**
 * Whether a wait time is short enough to warn the user about a tight
 * transfer — between 1 and 119 seconds (> 0 s and < 2 min). Two minutes and
 * above is stated as an exact duration instead.
 *
 * Deliberately not gated on significantWaitTime: a wait too short to be worth
 * displaying as a duration is still worth warning about, and gating on it
 * left waits of 30 seconds or less without any indicator at all.
 *
 * This is the single definition of a short transfer — the trip details wait
 * row, the trip details banner and the travel card all key off it, so they
 * cannot disagree about where the boundary falls.
 */
export function isShortWaitTime(seconds: number): boolean {
  return seconds > 0 && seconds < SHORT_TRANSFER_TIME_LIMIT_IN_SECONDS;
}

export type InterchangeRisk = 'uncertain' | 'impossible';

const IMPOSSIBLE_INTERCHANGE_LIMIT_IN_SECONDS = -120;

/**
 * How risky an interchange is when the next leg departs at or before the
 * current leg arrives, which real time updates can cause on an already
 * started trip.
 *
 * 0 to -120 seconds is 'uncertain', -121 seconds and below is 'impossible'.
 * Returns undefined when there is time to spare.
 */
export function getInterchangeRisk(
  seconds: number,
): InterchangeRisk | undefined {
  if (seconds > 0) return undefined;
  return seconds < IMPOSSIBLE_INTERCHANGE_LIMIT_IN_SECONDS
    ? 'impossible'
    : 'uncertain';
}
