import {Feature} from '../sdk';
import {SearchLocation} from '@atb/favorites';

// IMPORTANT: Feature coordinate-array is [long, lat] :sadface:. Mapping to lat/long object for less bugs downstream.
export const mapFeatureToLocation = ({
  geometry: {
    coordinates: [longitude, latitude],
  },
  properties,
}: Feature): SearchLocation => ({
  ...properties,
  coordinates: {latitude, longitude},
  resultType: 'search',
});
