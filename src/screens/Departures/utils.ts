import {StopPlacesMode} from '@atb/screens/Departures/types';
import {getSecondsUntilMidnightOrMinimum} from '@atb/screens/Departures/state/quay-state';

const MIN_TIME_RANGE = 3 * 60 * 60; // Three hours
const ONE_WEEK_TIME_RANGE = 7 * 24 * 60 * 60;

export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = (typeof DateOptions)[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

// In case of mode other than Favourite we do not set any limit per line, hence return undefined
export const getLimitOfDeparturesPerLineByMode = (mode: StopPlacesMode) =>
  mode === 'Favourite' ? 1 : undefined;

export const getTimeRangeByMode = (mode: StopPlacesMode, startTime?: string) =>
  mode === 'Favourite'
    ? ONE_WEEK_TIME_RANGE
    : getSecondsUntilMidnightOrMinimum(
        startTime ?? new Date().toISOString(),
        MIN_TIME_RANGE,
      );
