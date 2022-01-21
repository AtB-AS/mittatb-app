import {FOCUS_LATITUDE, FOCUS_LONGITUDE} from '@env';
import {Feature, Coordinates} from '../sdk';
import {bffClient} from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import {AxiosRequestConfig} from 'axios';

export const FOCUS_ORIGIN: Coordinates = {
  latitude: FOCUS_LATITUDE,
  longitude: FOCUS_LONGITUDE,
};

export async function autocomplete(
  text: string,
  coordinates: Coordinates | null,
  onlyAtbVenues: boolean = false,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify(
    {
      query: text,
      lat: coordinates?.latitude ?? FOCUS_ORIGIN.latitude,
      lon: coordinates?.longitude ?? FOCUS_ORIGIN.longitude,
      limit: 10,
      tariff_zone_authorities: onlyAtbVenues ? 'ATB' : null,
    },
    {skipNull: true},
  );

  return await bffClient.get<Feature[]>(stringifyUrl(url, query), config);
}

export async function getFeatureFromVenue(
  venue: {
    name: string;
    coordinates: Coordinates;
  },
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify(
    {
      query: venue.name,
      lat: venue.coordinates.latitude,
      lon: venue.coordinates.longitude,
      limit: 1,
      layers: ['venue'],
      tariff_zone_authorities: 'ATB',
    },
    {skipNull: true},
  );

  return await bffClient.get<Feature[]>(stringifyUrl(url, query), config);
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

  return await bffClient.get<Feature[]>(stringifyUrl(url, query), config);
}
