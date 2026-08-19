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
 * transfer — between 1 and 119 seconds (> 0 s and < 2 min). 
 */
export function isShortWaitTime(seconds: number): boolean {
  return seconds > 0 && seconds < SHORT_TRANSFER_TIME_LIMIT_IN_SECONDS;
}

export type InterchangeRisk = 'uncertain' | 'impossible';

const IMPOSSIBLE_INTERCHANGE_LIMIT_IN_SECONDS = -120;

/**
 * How risky an interchange is when the next leg departs at or before the
 * current leg arrives
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
