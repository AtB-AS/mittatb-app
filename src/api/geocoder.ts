import {GeolocationResponse} from '@react-native-community/geolocation';
import {Feature} from '../sdk';
import client from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {AxiosRequestConfig} from 'axios';

export async function autocomplete(
  text: string | null,
  location: GeolocationResponse | null,
  config?: AxiosRequestConfig,
) {
  const url = 'v1/geocoder/features';
  const query = qs.stringify({
    query: text,
    lat: location?.coords.latitude ?? 63.43457,
    lon: location?.coords.longitude ?? 10.39844,
    limit: 10,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}

export async function reverse(
  location: GeolocationResponse | null,
  config?: AxiosRequestConfig,
) {
  const url = 'v1/geocoder/reverse';
  const query = qs.stringify({
    lat: location?.coords.latitude,
    lon: location?.coords.longitude,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}
