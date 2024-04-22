import {
  addGeofencingZoneCategoryProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  useGeofencingZoneCategoriesProps,
  filterOutFeaturesNotApplicableForCurrentVehicle,
} from '@atb/components/map';

import voitrondheim from '../voiTrondheimEncoded.json';
import tiertrondheim from '../tierTrondheimEncoded.json';

const geofencingZonesData = {
  voitrondheim,
  tiertrondheim,
};

import {useMemo} from 'react';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {GeofencingZones} from '@atb/api/types/generated/mobility-types_v2';

export const usePreProcessedGeofencingZones = (
  vehicle?: VehicleExtendedFragment,
) => {
  const systemId = vehicle?.system.id;
  const vehicleTypeId = vehicle?.vehicleType.id;

  const geofencingZoneCategoriesProps = useGeofencingZoneCategoriesProps();

  const res = geofencingZonesData[systemId]; // TODO: get geofencingZones from bff

  const geofencingZones = useMemo(() => {
    return (res?.['data']?.['geofencingZones'] || []) as GeofencingZones[];
  }, [res]);

  const applicableGeofencingZones =
    filterOutFeaturesNotApplicableForCurrentVehicle(
      geofencingZones,
      vehicleTypeId,
    );
  const geofencingZonesWithCategoryProps = addGeofencingZoneCategoryProps(
    applicableGeofencingZones,
    geofencingZoneCategoriesProps,
    vehicleTypeId,
  );
  const geofencingZonesWithDecodedCoordinates =
    decodePolylineEncodedMultiPolygons(geofencingZonesWithCategoryProps);

  const geofencingZonesWithSortedFeatures = sortFeaturesByLayerIndexWeight(
    geofencingZonesWithDecodedCoordinates,
  );

  return useMemo(
    () => geofencingZonesWithSortedFeatures,
    [geofencingZonesWithSortedFeatures],
  );
};
