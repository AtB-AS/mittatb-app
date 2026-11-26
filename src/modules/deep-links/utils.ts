import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Coordinates} from '@atb/utils/coordinates';
import type {
  DateOptionAndValue,
  DepartureSearchTime,
} from '@atb/components/date-selection';
import type {InitialTravelSearchFilters} from '@atb/modules/travel-search-filters';
import type {DeepLink} from './parse-deep-link';

/**
 * Parses unknown param data as an integer, or falls back to undefined.
 */
export const parseParamAsInt = (data: any): number | undefined => {
  if (typeof data === 'string') return parseInt(data) || undefined;
  if (typeof data === 'number') return Math.round(data);
  return undefined;
};

/**
 * Parses a pair of deeplink params as latitude and longitude, or falls back to
 * undefined.
 */
export const parseParamsAsCoordinates = (
  lat: string | undefined,
  lon: string | undefined,
): Coordinates | undefined => {
  if (!lat?.trim() || !lon?.trim()) return undefined;
  const [latitude, longitude] = [lat, lon].map(Number);
  if (!isFinite(latitude) || !isFinite(longitude)) return undefined;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return undefined;
  return {latitude, longitude};
};

/**
 * Parses a planner web `searchTime` param (epoch milliseconds) as a departure
 * search time, or falls back to undefined (now) if missing, invalid or in the
 * past.
 */
export const parseParamAsSearchTime = (
  searchTime: string | undefined,
): DepartureSearchTime | undefined => {
  if (!searchTime?.trim()) return undefined;
  const date = new Date(Number(searchTime));
  if (isNaN(date.getTime()) || date.getTime() <= Date.now()) return undefined;
  return {option: 'departure', date: date.toISOString()};
};

/**
 * Parses planner web `searchMode` and `searchTime` (epoch milliseconds) params
 * as a trip search time, or falls back to undefined (now).
 */
export const parseParamsAsTripSearchTime = (
  searchMode: string | undefined,
  searchTime: string | undefined,
): DateOptionAndValue<'departure' | 'arrival'> | undefined => {
  const option =
    searchMode === 'departBy'
      ? 'departure'
      : searchMode === 'arriveBy'
        ? 'arrival'
        : undefined;
  if (!option || !searchTime?.trim()) return undefined;
  const date = new Date(Number(searchTime));
  if (isNaN(date.getTime())) return undefined;
  return {option, date: date.toISOString()};
};

/**
 * Parses planner web `filter`, `walkSpeed` and `transferSlack` params as the
 * filters to start a trip search with. Missing or invalid params are left out,
 * so that the user's own selection is used for them.
 */
export const parseParamsAsTravelSearchFilters = (
  params: DeepLink['params'],
): InitialTravelSearchFilters => ({
  transportModes: params.filter
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean),
  travelSearchPreferences: {
    walkSpeed: parseParamAsNonNegativeNumber(params.walkSpeed),
    transferSlack: parseParamAsNonNegativeNumber(params.transferSlack),
  },
});

const parseParamAsNonNegativeNumber = (
  data: string | undefined,
): number | undefined => {
  if (!data?.trim()) return undefined;
  const value = Number(data);
  return isFinite(value) && value >= 0 ? value : undefined;
};

/**
 * Parses a comma separated deeplink param as form factors, keeping only the
 * values which are valid form factors.
 *
 * NOTE: We avoid parsing against FormFactorSchema here, since it would make
 * the tests import unsupported libraries.
 */
export const parseParamAsFormFactors = (
  data: string | undefined,
): FormFactor[] => {
  const formFactors: string[] = Object.values(FormFactor);
  return (
    data
      ?.split(',')
      .map((value) => value.trim().toUpperCase())
      .filter((value): value is FormFactor => formFactors.includes(value)) ?? []
  );
};
