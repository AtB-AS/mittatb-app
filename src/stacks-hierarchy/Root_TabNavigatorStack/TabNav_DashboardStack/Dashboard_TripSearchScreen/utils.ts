import {useFirestoreConfiguration} from '@atb/configuration';
import {Location} from '@atb/favorites';
import {CityZone} from '@atb/reference-data/types';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {useMemo} from 'react';

export const useFindCityZoneInLocation = (
  location: Location | undefined,
  cityZones?: CityZone[],
) => {
  return useMemo(() => {
    if (location && cityZones) {
      const {longitude, latitude} = location.coordinates;
      return cityZones.find(({geometry}) =>
        turfBooleanPointInPolygon([longitude, latitude], geometry),
      );
    }
  }, [
    cityZones,
    location?.coordinates.longitude,
    location?.coordinates.latitude,
  ]);
};

export const useFindCityZonesInLocations = (
  from: Location | undefined,
  to: Location | undefined,
): CityZone[] | undefined => {
  const {cityZones} = useFirestoreConfiguration();
  const fromCityZone = useFindCityZoneInLocation(from, cityZones);
  const toCityZone = useFindCityZoneInLocation(to, cityZones);

  const filteredCityZones = [fromCityZone, toCityZone].filter(
    (cityZone) => cityZone && cityZone.enabled === true,
  ) as CityZone[];

  return filteredCityZones.filter(onlyUniquesBasedOnField('name'));
};
