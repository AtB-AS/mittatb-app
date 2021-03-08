import {getFeatureFromVenue} from '@atb/api/geocoder';
import {LocationWithMetadata} from '@atb/favorites/types';
import {mapFeatureToLocation} from './utils';

type StopPlaceInput = {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export async function searchByStopPlace(
  stopPlace: StopPlaceInput,
): Promise<LocationWithMetadata | undefined> {
  const locationResponse = await getFeatureFromVenue(stopPlace);
  const location = locationResponse?.data?.[0];
  if (!location) {
    return;
  }

  return {
    ...mapFeatureToLocation(location),
    resultType: 'search',
  };
}
