import {UserFavoriteDepartures} from '@atb/modules/favorites';
import {StopPlacesMode} from '../nearby-stop-places';
import {addDays, differenceInSeconds, parseISO} from 'date-fns';
import {StopPlaceAndQuay} from './types';
import {StopPlace} from '@atb/api/types/departures';

const MIN_TIME_RANGE = 3 * 60 * 60; // Three hours
const ONE_WEEK_TIME_RANGE = 7 * 24 * 60 * 60;

export const NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 5;
export const NUMBER_OF_DEPARTURES_IN_BUFFER = 5;

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

export function hasFavorites(
  favorites: UserFavoriteDepartures,
  quayIds?: string[],
) {
  return favorites.some((favorite) =>
    quayIds?.find((quayId) => favorite.quayId === quayId),
  );
}

export function publicCodeCompare(a?: string, b?: string): number {
  // Show quays with no public code last
  if (!a) return 1;
  if (!b) return -1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(a) && parseInt(b)) {
    return parseInt(a) - parseInt(b);
  }
  // Otherwise compare as strings (e.g. K1 < K2)
  return a.localeCompare(b);
}

export function getStopPlaceAndQuays(
  stopPlaces: StopPlace[],
): StopPlaceAndQuay[] {
  return stopPlaces
    .flatMap(
      (sp) => sp.quays?.map((quay) => ({stopPlace: sp, quay: quay})) || [],
    )
    .sort((a, b) => publicCodeCompare(a.quay.publicCode, b.quay.publicCode));
}
