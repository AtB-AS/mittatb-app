import {TripPattern} from '../sdk';
import client from './client';
import {Location} from '../favorites/types';
import {AxiosRequestConfig} from 'axios';

export default async function search(
  from: Location,
  to: Location,
  opts?: AxiosRequestConfig,
) {
  const url = 'v1/journey/trip';
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
    },
    opts,
  );
}
