import {GeolocationResponse} from '@react-native-community/geolocation';
import {Feature} from '../sdk';
import {getClient} from './client';
import qs from 'query-string';
import {stringifyUrl} from './utils';

export async function autocomplete(
  text: string | null,
  location: GeolocationResponse | null,
) {
  const client = await getClient();
  const defaultFilter = location
    ? undefined
    : {
        'boundary.rect.min_lat': 62.5815885,
        'boundary.rect.max_lat': 64.082649,
        'boundary.rect.min_lon': 8.745761,
        'boundary.rect.max_lon': 11.92081,
      };
  const url = 'v1/geocoder/features';
  const query = qs.stringify({
    query: text,
    lat: location?.coords.latitude,
    lon: location?.coords.longitude,
    limit: 10,
    ...defaultFilter,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query));
}

export async function reverse(location: GeolocationResponse | null) {
  const client = await getClient();
  const url = 'v1/geocoder/reverse';
  const query = qs.stringify({
    lat: location?.coords.latitude,
    lon: location?.coords.longitude,
  });

  return await client.get<Feature[]>(stringifyUrl(url, query));
}
