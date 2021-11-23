import {TripPattern} from '@atb/sdk';
import client from './client';
import {Location} from '@atb/favorites/types';
import {AxiosRequestConfig} from 'axios';
import {TripsQuery} from '@atb/api/types/trips';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';

export type TripsSearchQuery = {
  from: Location;
  to: Location;
  searchDate?: string;
  arriveBy?: boolean;
};

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
  };

  const response = await client.post<TripsQuery>(url, cleanQuery, {
    ...opts,
    baseURL: 'http://10.0.2.2:8080/',
  });
  return response.data;
}
