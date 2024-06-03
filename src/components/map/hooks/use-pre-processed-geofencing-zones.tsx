import {
  addGeofencingZoneCustomProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  useGeofencingZonesCustomProps,
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

  const geofencingZonesCustomProps = useGeofencingZonesCustomProps();

  const {
    data: geofencingZonesData, // load and error silently
  } = useGeofencingZonesQuery(systemId ? [systemId] : []);

  const applicableGeofencingZones =
    filterOutFeaturesNotApplicableForCurrentVehicle(
      geofencingZonesData,
      vehicleTypeId,
    );
  const geofencingZonesWithCustomProps = addGeofencingZoneCustomProps(
    applicableGeofencingZones,
    geofencingZonesCustomProps,
    vehicleTypeId,
  );
  const geofencingZonesWithDecodedCoordinates =
    decodePolylineEncodedMultiPolygons(geofencingZonesWithCustomProps);

  const geofencingZonesWithSortedFeatures = sortFeaturesByLayerIndexWeight(
    geofencingZonesWithDecodedCoordinates,
  );

  return useMemo(
    () => geofencingZonesWithSortedFeatures,
    [geofencingZonesWithSortedFeatures],
  );
};
