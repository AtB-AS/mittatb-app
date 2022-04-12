import {getFeatureFromVenue} from '@atb/api/geocoder';
import {Location} from '@atb/favorites/types';
import {mapFeatureToLocation} from './utils';
import {StopPlace} from '@entur/sdk';
import {StopPlace as StopPlace_v2} from '@atb/api/types/trips';

export async function searchByStopPlace(
  stopPlace?: StopPlace | StopPlace_v2,
): Promise<Location | undefined> {
  if (!stopPlace || !stopPlace?.latitude || !stopPlace?.longitude) {
    return;
  }

  const locationResponse = await getFeatureFromVenue({
    name: stopPlace.name,
    coordinates: {
      latitude: stopPlace.latitude,
      longitude: stopPlace.longitude,
    },
  });

  const location = locationResponse?.data?.[0];
  if (!location) {
    return;
  }

  return mapFeatureToLocation(location, 'search');
}
