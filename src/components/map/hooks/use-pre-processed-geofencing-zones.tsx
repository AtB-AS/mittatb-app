import {
  addGeofencingZoneCategoryProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  useGeofencingZoneCategoriesProps,
  filterOutFeaturesNotApplicableForCurrentVehicle,
} from '@atb/components/map';

import {useMemo} from 'react';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useGeofencingZonesQuery} from '@atb/mobility/queries/use-geofencing-zones';

export const usePreProcessedGeofencingZones = (
  vehicle?: VehicleExtendedFragment,
) => {
  const systemId = vehicle?.system.id;
  const vehicleTypeId = vehicle?.vehicleType.id;

  const geofencingZoneCategoriesProps = useGeofencingZoneCategoriesProps();

  const {
    data: geofencingZonesData, // load and error silently
  } = useGeofencingZonesQuery(systemId ? [systemId] : []);

  const applicableGeofencingZones =
    filterOutFeaturesNotApplicableForCurrentVehicle(
      geofencingZonesData,
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
