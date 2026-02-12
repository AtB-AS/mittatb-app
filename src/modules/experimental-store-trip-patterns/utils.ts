import {TripPattern} from '@atb/api/types/trips';

export function getTripPatternKey(tripPattern: TripPattern): string {
  return tripPattern.legs
    .filter((l) => l.id)
    .map((l) => l.id)
    .join('|');
}
