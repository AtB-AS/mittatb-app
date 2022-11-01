import {StopPlacesMode} from '@atb/screens/Departures/types';

export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

// In case of mode other than Favourite we do not set any limit per line, hence return undefined
export const getLimitOfDeparturesPerLineByMode = (mode: StopPlacesMode) =>
  mode === 'Favourite' ? 1 : undefined;
