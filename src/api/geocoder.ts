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
  text: string,
  coordinates: Coordinates | null,
  onlyAtbVenues: boolean = false,
  config?: AxiosRequestConfig,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify(
    {
      query: text,
      lat: coordinates?.latitude ?? TRONDHEIM_CENTRAL_STATION.latitude,
      lon: coordinates?.longitude ?? TRONDHEIM_CENTRAL_STATION.longitude,
      limit: 10,
      tariff_zone_authorities: onlyAtbVenues ? 'ATB' : null,
    },
    {skipNull: true},
  );

  return await client.get<Feature[]>(stringifyUrl(url, query), config);
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
