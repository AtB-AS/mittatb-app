import client from './client';
import {AxiosRequestConfig} from 'axios';
import {TripPattern, TripsQuery} from '@atb/api/types/trips';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import Bugsnag from '@bugsnag/react-native';

export async function tripsSearch(
  query: TripsQueryVariables,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery> {
  const url = 'bff/v2/trips';
  const cleanQuery: TripsQueryVariables = {
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
    transferPenalty: query.transferPenalty,
    waitReluctance: query.waitReluctance,
    walkReluctance: query.walkReluctance,
    walkSpeed: query.walkSpeed,
    modes: query.modes,
  };

  const results = await post<TripsQuery>(url, cleanQuery, opts);

  Bugsnag.leaveBreadcrumb('results', {
    patterns: results.trip?.tripPatterns ?? 'none',
  });

  return results;
}

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
