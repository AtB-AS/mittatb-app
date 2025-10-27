import {FOCUS_LATITUDE, FOCUS_LONGITUDE, TARIFF_ZONE_AUTHORITY} from '@env';
import {Coordinates} from '@atb/utils/coordinates';
import {client} from '../client';
import qs from 'query-string';
import {stringifyUrl} from '../utils';
import {AxiosRequestConfig} from 'axios';
import {Feature} from './types';
import {SearchLocation} from '@atb/modules/favorites';

export const FOCUS_ORIGIN: Coordinates = {
  latitude: parseFloat(FOCUS_LATITUDE),
  longitude: parseFloat(FOCUS_LONGITUDE),
};

export async function autocomplete(
  text: string,
  coordinates: Coordinates | null,
  onlyLocalFareZoneAuthority: boolean = false,
  onlyStopPlaces: boolean = false,
  config?: AxiosRequestConfig,
): Promise<SearchLocation[]> {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify(
    {
      query: text,
      lat: coordinates?.latitude ?? FOCUS_ORIGIN.latitude,
      lon: coordinates?.longitude ?? FOCUS_ORIGIN.longitude,
      limit: 10,
      tariff_zone_authorities: onlyLocalFareZoneAuthority
        ? TARIFF_ZONE_AUTHORITY
        : null,
      layers: onlyStopPlaces ? ['venue'] : undefined,
      multiModal: 'parent',
    },
    {skipNull: true},
  );

  const response = await client.get<Feature[]>(
    stringifyUrl(url, query),
    config,
  );
  const data = response.data.map(mapFeatureToSearchLocation);
  return data;
}

export async function reverse(
  coordinates: Coordinates | null,
  config?: AxiosRequestConfig,
): Promise<SearchLocation[]> {
  const url = 'bff/v1/geocoder/reverse';
  const query = qs.stringify({
    lat: coordinates?.latitude,
    lon: coordinates?.longitude,
  });

  const response = await client.get<Feature[]>(
    stringifyUrl(url, query),
    config,
  );
  return response.data.map(mapFeatureToSearchLocation);
}

/**
 * Feature coordinate-array from geocoder is [long, lat]. This maps to lat/long
 * object for less bugs downstream.
 */
const mapFeatureToSearchLocation = ({
  geometry: {
    coordinates: [longitude, latitude],
  },
  properties,
}: Feature): SearchLocation => ({
  ...properties,
  coordinates: {latitude, longitude},
  resultType: 'search',
});
