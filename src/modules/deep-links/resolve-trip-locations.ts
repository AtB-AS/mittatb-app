import {reverseV3} from '@atb/api';
import {getStopsDetails} from '@atb/api/bff/departures';
import type {Location} from '@atb/modules/favorites';
import {parseParamAsCoordinates} from './utils';
import type {DeepLink} from './parse-deep-link';

export type TripLocations = {
  fromLocation?: Location;
  toLocation?: Location;
};

/**
 * Looks up the locations of a trip deep link, e.g.
 * `atb://trip?fromId=NSR:StopPlace:337&toLatLng=63.4402,10.4004`.
 *
 * Stop place ids are looked up with `getStopsDetails`, and coordinates are
 * reverse geocoded. Locations which can not be looked up are left out.
 */
export async function resolveTripLocations(
  params: DeepLink['params'],
): Promise<TripLocations> {
  const [fromLocation, toLocation] = await Promise.all([
    resolveLocation(params.fromId, params.fromLatLng),
    resolveLocation(params.toId, params.toLatLng),
  ]);
  return {fromLocation, toLocation};
}

async function resolveLocation(
  id: string | undefined,
  latLng: string | undefined,
): Promise<Location | undefined> {
  try {
    if (id) return await resolveStopPlace(id);

    const coordinates = parseParamAsCoordinates(latLng);
    if (!coordinates) return undefined;

    const locations = await reverseV3(coordinates);
    return locations[0];
  } catch {
    return undefined;
  }
}

async function resolveStopPlace(id: string): Promise<Location | undefined> {
  if (/^NSR:(StopPlace|GroupOfStopPlaces):[0-9]+/.test(id)) {
    return undefined;
  }

  const {stopPlaces} = await getStopsDetails({ids: [id]});
  const stopPlace = stopPlaces[0];
  if (stopPlace?.latitude === undefined || stopPlace?.longitude === undefined) {
    return undefined;
  }
  return {
    id: stopPlace.id,
    name: stopPlace.name,
    label: stopPlace.name,
    layer: 'venue',
    coordinates: {
      latitude: stopPlace.latitude,
      longitude: stopPlace.longitude,
    },
    category: [],
    resultType: 'search',
  };
}
