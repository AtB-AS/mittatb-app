import {Feature} from '../sdk';
import {Location} from '../favorites/types';

// IMPORTANT: Feature coordinate-array is [long, lat] :sadface:. Mapping to lat/long object for less bugs downstream.
export const mapFeatureToLocation = (
  {
    geometry: {
      coordinates: [longitude, latitude],
    },
    properties,
  }: Feature,
  resultType: 'geolocation' | 'search',
): Location => ({
  ...properties,
  coordinates: {latitude, longitude},
  resultType,
});
