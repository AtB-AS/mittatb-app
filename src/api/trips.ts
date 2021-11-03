import {TripPattern} from '@atb/sdk';
import client from './client';
import {Location} from '@atb/favorites/types';
import {AxiosRequestConfig} from 'axios';

export default async function search(
  from: Location,
  to: Location,
  searchDate?: string,
  arriveBy: boolean = false,
  opts?: AxiosRequestConfig,
) {
  const url = 'bff/v1/journey/trip';
  return await client.post<TripPattern[]>(
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
  const url = `bff/v1/journey/single-trip?id=${tripPatternId}`;
  const result = await client.get<TripPattern>(url, {
    ...opts,
    skipErrorLogging: (error) => error.response?.status === 410,
  });
  return result.data;
}
