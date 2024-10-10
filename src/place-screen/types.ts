import {Quay, StopPlace} from '@atb/api/types/departures.ts';

export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = (typeof DateOptions)[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

export type StopPlaceAndQuay = {stopPlace: StopPlace; quay: Quay};
