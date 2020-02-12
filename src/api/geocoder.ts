import {GeolocationResponse} from '@react-native-community/geolocation';
import {Feature} from '../sdk';
import {getClient} from './client';

const BOUNDARY_FILTER = () => {
  const filter = {
    'boundary.rect.min_lat': 62.5815885,
    'boundary.rect.max_lat': 64.082649,
    'boundary.rect.min_lon': 8.745761,
    'boundary.rect.max_lon': 11.92081,
  };
  return Object.entries(filter)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
};

export async function autocomplete(
  text: string | null,
  location: GeolocationResponse | null,
) {
  const url =
    'v1/geocoder/features?query=' +
    text +
    (location
      ? '&lat=' + location.coords.latitude + '&lon=' + location.coords.longitude
      : `&${BOUNDARY_FILTER()}`) +
    '&limit=10';

  const client = await getClient();
  return await client.get<Feature[]>(url);
}

export async function reverse(location: GeolocationResponse | null) {
  const client = await getClient();
  return await client.get<Feature[]>(
    'v1/geocoder/reverse?lat=' +
      location?.coords.latitude +
      '&lon=' +
      location?.coords.longitude +
      '&limit=10&radius=0.2',
  );
}
