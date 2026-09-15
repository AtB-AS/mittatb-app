import {placeV3, reverseV3} from '@atb/api';
import type {Location} from '@atb/modules/favorites';
import {parseParamsAsCoordinates} from './utils';
import type {DeepLink} from './parse-deep-link';

export type TripSearchLocations = {
  fromLocation?: Location;
  toLocation?: Location;
};

/**
 * Looks up the locations of a trip search deep link, e.g.
 * `atb://trip-search?fromId=NSR:StopPlace:337&toLat=63.4402&toLon=10.4004`.
 */
export async function resolveTripSearchLocations(
  params: DeepLink['params'],
): Promise<TripSearchLocations> {
  const [fromLocation, toLocation] = await Promise.all([
    resolveLocation(params.fromId, params.fromLat, params.fromLon),
    resolveLocation(params.toId, params.toLat, params.toLon),
  ]);
  return {fromLocation, toLocation};
}

async function resolveLocation(
  id: string | undefined,
  lat: string | undefined,
  lon: string | undefined,
): Promise<Location | undefined> {
  try {
    if (id) {
      const places = await placeV3([id]);
      return places.find((place) => place.id === id);
    }

    const coordinates = parseParamsAsCoordinates(lat, lon);
    if (!coordinates) return undefined;

    const locations = await reverseV3(coordinates);
    return locations[0];
  } catch {
    return undefined;
  }
}
