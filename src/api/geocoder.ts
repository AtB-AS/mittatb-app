import {GeolocationResponse} from '@react-native-community/geolocation';
import {Feature} from '../sdk';
import client from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {AxiosRequestConfig} from 'axios';
import {StopPlace, StopPlaceDetails, Coordinates} from '@entur/sdk';

const TRONDHEIM_CENTRAL_STATION = {
  latitude: 63.43457,
  longitide: 10.39844,
};

export async function autocomplete(
  text: string | null,
  location: GeolocationResponse | null,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify({
    query: text,
    lat: location?.coords.latitude ?? TRONDHEIM_CENTRAL_STATION.latitude,
    lon: location?.coords.longitude ?? TRONDHEIM_CENTRAL_STATION.longitide,
    limit: 10,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}

export async function reverse(
  location: GeolocationResponse | null,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/reverse';
  const query = qs.stringify({
    lat: location?.coords.latitude,
    lon: location?.coords.longitude,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
}

export async function venueToFeature(
  loc: Coordinates,
  config?: AxiosRequestConfig,
): Promise<Feature | undefined> {
  const url = 'bff/v1/geocoder/reverse';
  const query = qs.stringify({
    lat: loc.latitude,
    lon: loc.longitude,
    limit: 1,
    radius: 1,
    layers: ['venue'],
  });

  const result = await client.get<Feature[]>(stringifyUrl(url, query), config);
  if (!result?.data?.length) return;
  return result?.data[0];
}
