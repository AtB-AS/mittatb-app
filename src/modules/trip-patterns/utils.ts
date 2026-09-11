import {isTransitLeg, type TransferLeg} from '@atb-as/utils';
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
 * Whether a wait time is short enough to warn the user about a tight
 * transfer — between 0 and 180 seconds (<= 3 min). Only counts transfer between
 * transit, so walk legs must not be counted.
 */
export function isShortWaitTime(seconds: number): boolean {
  return seconds >= 0 && seconds <= SHORT_TRANSFER_TIME_LIMIT_IN_SECONDS;
}

/**
 * Whether the gap before `boardingIndex` is a transfer between services, rather
 * than walking to the first stop or away from the last one.
 *
 * Only a real transfer can legitimately be flush. Entur reports a zero-second
 * gap between a walk and the leg beside it as a matter of adjacency, not
 * urgency, so counting those would warn on nearly every trip.
 *
 * `boardingIndex` is the leg you board, which is where a transfer warning
 * belongs — the same leg the BFF stamps `transferRisk` on.
 */
export function isTransferInto(
  legs: TransferLeg[],
  boardingIndex: number,
): boolean {
  const boarding = legs[boardingIndex];
  return (
    !!boarding &&
    isTransitLeg(boarding) &&
    legs.slice(0, boardingIndex).some(isTransitLeg)
  );
}
