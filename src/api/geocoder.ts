import {Feature} from '../sdk';
import client from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {AxiosRequestConfig} from 'axios';
import {GeoPosition} from 'react-native-geolocation-service';

export const TRONDHEIM_CENTRAL_STATION = {
  latitude: 63.43457,
  longitude: 10.39844,
};

export async function autocomplete(
  text: string | null,
  location: GeoPosition | null,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify({
    query: text,
    lat: location?.coords.latitude ?? TRONDHEIM_CENTRAL_STATION.latitude,
    lon: location?.coords.longitude ?? TRONDHEIM_CENTRAL_STATION.longitude,
    limit: 10,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}

export async function reverse(
  location: GeoPosition | null,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/reverse';
  const query = qs.stringify({
    lat: location?.coords.latitude,
    lon: location?.coords.longitude,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}
