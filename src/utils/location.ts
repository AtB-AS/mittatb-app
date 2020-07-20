import haversine from 'haversine-distance';
import {Location} from '../favorites/types';
import {Feature} from '../sdk';

type SortedLocation = {
  location: Location;
  distance: number;
};

export function sortNearestLocations(
  current: Location,
  ...rest: Location[]
): SortedLocation[] {
  return rest
    .map((location) => ({
      location,
      distance: haversine(current.coordinates, location.coordinates),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// IMPORTANT: Feature coordinate-array is [long, lat] :sadface:. Mapping to lat/long object for less bugs downstream.
export const mapFeatureToLocation = ({
  geometry: {
    coordinates: [longitude, latitude],
  },
  properties,
}: Feature): Location => ({
  ...properties,
  coordinates: {latitude, longitude},
});
