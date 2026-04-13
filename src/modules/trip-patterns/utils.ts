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

const SHORT_TRANSFER_TIME_LIMIT_IN_SECONDS = 180;
/**
 * Whether a wait time is significant but dangerously short — between 31 and
 * 180 seconds (> 30 s and ≤ 3 min). Used to warn the user about tight
 * transfers.
 */
export function isShortWaitTime(seconds: number): boolean {
  return (
    significantWaitTime(seconds) &&
    seconds <= SHORT_TRANSFER_TIME_LIMIT_IN_SECONDS
  );
}
