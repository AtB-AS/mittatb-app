import {Quay, StopPlace} from '@atb/api/types/departures';
import type {DateOptionAndValue} from '@atb/date-picker';

export const DepartureDateOptions = ['now', 'departure'] as const;
export type DepartureDateOptionType = (typeof DepartureDateOptions)[number];
export type DepartureSearchTime = DateOptionAndValue<DepartureDateOptionType>;

export type StopPlaceAndQuay = {stopPlace: StopPlace; quay: Quay};
