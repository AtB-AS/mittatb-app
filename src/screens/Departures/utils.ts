import {PlaceScreenMode} from '@atb/screens/Departures/PlaceScreen';

export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

// In case of mode other than Favourite we do not set any limit per line, hence return undefined
export const getLimitOfDeparturesPerLineByMode = (mode: PlaceScreenMode) =>
  mode === 'Favourite' ? 1 : undefined;
