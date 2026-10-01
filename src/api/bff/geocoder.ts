import {FOCUS_LATITUDE, FOCUS_LONGITUDE, FARE_ZONE_AUTHORITY} from '@env';
import {Coordinates} from '@atb/utils/coordinates';
import {client} from '../client';
import qs from 'query-string';
import {stringifyUrl} from '../utils';
import {AxiosRequestConfig} from 'axios';
import {Feature, FeatureCategory} from './types';
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
  const url = 'bff/v2/geocoder/features';
  const query = qs.stringify(
    {
      query: text,
      lat: coordinates?.latitude ?? FOCUS_ORIGIN.latitude,
      lon: coordinates?.longitude ?? FOCUS_ORIGIN.longitude,
      limit: 10,
      fareZoneAuthorities: onlyLocalFareZoneAuthority
        ? FARE_ZONE_AUTHORITY
        : null,
      layers: onlyStopPlaces ? ['stopPlace'] : undefined,
      multimodal: 'parent',
    },
    {skipNull: true},
  );

  const response = await client.get<Feature[]>(
    stringifyUrl(url, query),
    config,
  );
  return response.data.map(mapFeatureToSearchLocation);
}

export async function reverse(
  coordinates: Coordinates | null,
  config?: AxiosRequestConfig,
): Promise<SearchLocation[]> {
  const url = 'bff/v2/geocoder/reverse';
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

export async function place(
  ids: string[],
  config?: AxiosRequestConfig,
): Promise<SearchLocation[]> {
  const url = 'bff/v2/geocoder/place';
  const query = qs.stringify({ids});

  const response = await client.get<Feature[]>(
    stringifyUrl(url, query),
    config,
  );
  return response.data.map(mapFeatureToSearchLocation);
}

const featureCategories = new Set<string>(Object.values(FeatureCategory));

const mapFeatureToSearchLocation = ({
  geometry: {
    coordinates: [longitude, latitude],
  },
  properties,
}: Feature): SearchLocation => ({
  id: properties.id,
  name: properties.names.default,
  label: properties.names.display,
  layer: properties.layer === 'stopPlace' ? 'venue' : 'address',
  coordinates: {latitude, longitude},
  locality: properties.address?.locality,
  postalcode: properties.address?.postalCode,
  housenumber: properties.address?.houseNumber,
  fare_zones: properties.fareZones,
  category: (properties.stopPlaceTypes ?? []).filter(
    (t): t is FeatureCategory => featureCategories.has(t),
  ),
  resultType: 'search',
});
