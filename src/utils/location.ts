import haversine from 'haversine-distance';
import {Location} from '@atb/modules/favorites';
import {Coordinates} from '@atb/utils/coordinates';
import {dictionary, useTranslation} from '@atb/translations';

type SortedLocation = {
  location: Location;
  distance: number;
};
export const LOCATIONS_REALLY_CLOSE_THRESHOLD = 200;

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
export function coordinatesAreEqual(c1: Coordinates, c2: Coordinates) {
  return c1.latitude === c2.latitude && c1.longitude === c2.longitude;
}
export function coordinatesDistanceInMetres(c1: Coordinates, c2: Coordinates) {
  return haversine(c1, c2);
}

export function primitiveLocationDistanceInMetres(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  return Math.round(
    haversine(
      {latitude: lat1, longitude: lon1},
      {latitude: lat2, longitude: lon2},
    ),
  );
}

export function isValidTripLocations(from?: Location, to?: Location): boolean {
  if (!from || !to) return false;
  if (coordinatesAreEqual(from.coordinates, to.coordinates)) return false;
  if (
    coordinatesDistanceInMetres(from.coordinates, to.coordinates) <
    LOCATIONS_REALLY_CLOSE_THRESHOLD
  )
    return false;
  return true;
}

export const getLocationLayer = (l: Location) =>
  l.resultType === 'geolocation' ? undefined : l.layer;

export const useHumanizeDistance = (meters?: number) => {
  const {t} = useTranslation();
  if (!meters) return;
  if (meters >= 1000) {
    return `${Math.round(meters / 1000)} ${t(dictionary.distance.km)}`;
  }
  return `${Math.round(meters)} ${t(dictionary.distance.m)}`;
};
