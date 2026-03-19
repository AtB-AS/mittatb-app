import type {DateOptionAndValue} from '@atb/components/date-selection';

export const TripDateOptions = ['now', 'departure', 'arrival'] as const;
export type TripDateOptionType = (typeof TripDateOptions)[number];

export type TripSearchTime = DateOptionAndValue<TripDateOptionType>;
