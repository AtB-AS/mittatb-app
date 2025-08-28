import {
  addGeofencingZoneCustomProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  filterOutFeaturesNotApplicableForCurrentVehicle,
} from '@atb/modules/map';

import {useMemo} from 'react';
import {useGeofencingZonesQuery} from '@atb/modules/mobility';
import {useThemeContext} from '@atb/theme';

export const usePreProcessedGeofencingZones = (
  systemId: string,
  vehicleTypeId: string,
) => {
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
