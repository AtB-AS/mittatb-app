import {Feature, Coordinates} from '../sdk';
import client from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {AxiosRequestConfig} from 'axios';

export const TRONDHEIM_CENTRAL_STATION: Coordinates = {
  latitude: 63.43457,
  longitude: 10.39844,
};

export async function autocomplete(
  text: string | null,
  coordinates: Coordinates | null,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify({
    query: text,
    lat: coordinates?.latitude ?? TRONDHEIM_CENTRAL_STATION.latitude,
    lon: coordinates?.longitude ?? TRONDHEIM_CENTRAL_STATION.longitude,
    limit: 10,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}

export async function reverse(
  coordinates: Coordinates | null,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/reverse';
  const query = qs.stringify({
    lat: coordinates?.latitude,
    lon: coordinates?.longitude,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}
