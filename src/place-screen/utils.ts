import {StopPlacesMode} from '../nearby-stop-places';
import {addDays, differenceInSeconds, parseISO} from 'date-fns';

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
    : getSecondsUntilMidnightOrMinimum(startTime, MIN_TIME_RANGE);

/**
 * Get seconds until midnight, but a minimum of `minimumSeconds`
 */
function getSecondsUntilMidnightOrMinimum(
  isoTime?: string,
  minimumSeconds: number = 0,
): number {
  if (!isoTime) return minimumSeconds;
  const timeUntilMidnight = differenceInSeconds(
    addDays(parseISO(isoTime), 1).setHours(0, 0, 0),
    parseISO(isoTime),
  );
  return Math.round(Math.max(timeUntilMidnight, minimumSeconds));
}
