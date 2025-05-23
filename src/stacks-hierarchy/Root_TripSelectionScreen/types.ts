import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';

export type TripPatternFragmentWithAvailability = TripPatternFragment & {
  available: number | undefined;
};
