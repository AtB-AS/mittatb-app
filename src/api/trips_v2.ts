import {TripPattern} from '@atb/sdk';
import client from './client';
import {Location} from '@atb/favorites/types';
import {AxiosRequestConfig} from 'axios';
import {TripsQuery, Trip} from '@atb/api/types/trips';

export default async function search(
  from: Location,
  to: Location,
  searchDate?: string,
  arriveBy: boolean = false,
  opts?: AxiosRequestConfig,
) {
  const url = 'bff/v2/journey/trip';
  return await client.post<Trip>(
    url,
    {
      from: {
        place: from.id,
        name: from.name,
        coordinates: from.coordinates,
      },
      to: {
        place: to.id,
        name: to.name,
        coordinates: to.coordinates,
      },
      searchDate,
      arriveBy,
    },
    {...opts, baseURL: 'http://10.0.2.2:8080/'},
  );
}

export async function getSingleTripPattern(
  tripPatternId: string,
  opts?: AxiosRequestConfig,
) {
  const url = `bff/v1/single-trip?id=${tripPatternId}`;
  const result = await client.get<TripPattern>(url, {
    ...opts,
    skipErrorLogging: (error) => error.response?.status === 410,
  });
  return result.data;
}

export async function simpleSearch(
  from: Location,
  to: Location,
  searchDate?: string,
  arriveBy: boolean = false,
  opts?: AxiosRequestConfig,
): Promise<TripsQuery> {
  const nsrFrom = from.id;
  const nsrTo = to.id;

  const url = `bff/v2/trips?from=${nsrFrom}&to=${nsrTo}`;
  const result = await client.get<TripsQuery>(url, {
    ...opts,
    baseURL: 'http://10.0.2.2:8080/',
    skipErrorLogging: (error) => error.response?.status === 410,
  });

  const data = result.data;
  console.log(
    '-----------------------------------------------------------------------------\n',
  );
  console.log(data);
  return data;
}
