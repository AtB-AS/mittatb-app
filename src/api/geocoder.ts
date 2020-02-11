import {GeolocationResponse} from '@react-native-community/geolocation';
import {Feature} from '../sdk';
import client from './client';

const BOUNDARY_FILTER = () => {
  const filter = {
    min_lat: 62.5815885,
    max_lat: 64.082649,
    min_lon: 8.745761,
    max_lon: 11.92081,
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

  return await client.get<Feature[]>(url);
}

export async function reverse(location: GeolocationResponse | null) {
  return await client.get<Feature[]>(
    'v1/geocoder/reverse?lat=' +
      location?.coords.latitude +
      '&lon=' +
      location?.coords.longitude +
      '&limit=10&radius=0.2',
  );
}
