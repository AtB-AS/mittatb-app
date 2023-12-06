import {client} from './client';
import {AxiosRequestConfig} from 'axios';
import {TripPattern, TripsQuery} from '@atb/api/types/trips';
import {
  NonTransitTripsQueryVariables,
  TripsQueryVariables,
} from '@atb/api/types/generated/TripsQuery';
import Bugsnag from '@bugsnag/react-native';
import {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';

function cleanQuery(query: TripsQueryVariables) {
  const cleanQuery: TripsQueryVariables | NonTransitTripsQueryVariables = {
    to: {
      name: query.to.name,
      coordinates: query.to.coordinates,
      place: query.to.place,
    },
    from: {
      name: query.from.name,
      coordinates: query.from.coordinates,
      place: query.from.place,
    },
    when: query.when,
    arriveBy: query.arriveBy,
    cursor: query.cursor,
    transferSlack: query.transferSlack,
    transferPenalty: query.transferPenalty,
    waitReluctance: query.waitReluctance,
    walkReluctance: query.walkReluctance,
    walkSpeed: query.walkSpeed,
    modes: query.modes,
  };
  return cleanQuery;
}

function cleanNonTransitQuery(query: NonTransitTripsQueryVariables) {
  const cleanQuery: NonTransitTripsQueryVariables = {
    to: {
      name: query.to.name,
      coordinates: query.to.coordinates,
      place: query.to.place,
    },
    from: {
      name: query.from.name,
      coordinates: query.from.coordinates,
      place: query.from.place,
    },
    when: query.when,
    arriveBy: query.arriveBy,
    walkSpeed: query.walkSpeed,
    directModes: query.directModes,
  };
  return cleanQuery;
}

export async function tripsSearch(
  query: TripsQueryVariables,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery> {
  const url = 'bff/v2/trips';

  const results = await post<TripsQuery>(url, cleanQuery(query), opts);

  Bugsnag.leaveBreadcrumb('results', {
    patterns: results.trip?.tripPatterns ?? 'none',
  });

  return results;
}

export const nonTransitTripSearch = (
  query: NonTransitTripsQueryVariables,
  opts?: AxiosRequestConfig,
) =>
  post<TripPatternFragment[]>(
    'bff/v2/trips/non-transit',
    cleanNonTransitQuery(query),
    opts,
  );

export async function singleTripSearch(
  queryString?: string,
  opts?: AxiosRequestConfig,
): Promise<TripPattern | undefined> {
  if (!queryString) {
    return undefined;
  }
  const url = '/bff/v2/singleTrip';
  const query = {
    compressedQuery: queryString,
  };
  return await post<TripPattern>(url, query, opts);
}

async function post<T>(
  url: string,
  query: any,
  opts?: AxiosRequestConfig<any>,
) {
  const response = await client.post<T>(url, query, {
    ...opts,
    skipErrorLogging: (error) => error.response?.status === 410,
  });

  return response.data;
}
