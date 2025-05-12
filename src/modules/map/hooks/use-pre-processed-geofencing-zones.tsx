import {
  addGeofencingZoneCustomProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  filterOutFeaturesNotApplicableForCurrentVehicle,
} from '@atb/modules/map';

import {useMemo} from 'react';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useGeofencingZonesQuery} from '@atb/mobility/queries/use-geofencing-zones';
import {useThemeContext} from '@atb/theme';

export const usePreProcessedGeofencingZones = (
  vehicle: VehicleExtendedFragment,
) => {
  const systemId = vehicle?.system.id;
  const vehicleTypeId = vehicle?.vehicleType.id;

  const {theme} = useThemeContext();

  const {
    data: geofencingZonesData, // load and error silently
  } = useGeofencingZonesQuery(systemId);

  const applicableGeofencingZones =
    filterOutFeaturesNotApplicableForCurrentVehicle(
      geofencingZonesData,
      vehicleTypeId,
    );
  const geofencingZonesWithCustomProps = addGeofencingZoneCustomProps(
    applicableGeofencingZones,
    theme.color.geofencingZone,
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
