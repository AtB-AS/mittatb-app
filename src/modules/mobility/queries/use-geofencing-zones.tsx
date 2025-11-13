import {useQuery} from '@tanstack/react-query';
import {getGeofencingZones} from '@atb/api/bff/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {
  filterOutFeaturesNotApplicableForCurrentVehicle,
  addGeofencingZoneCustomProps,
  decodePolylineEncodedMultiPolygons,
  sortFeaturesByLayerIndexWeight,
  getIconFeatures,
} from '@atb/modules/map';
import {useThemeContext} from '@atb/theme';
import {useCallback} from 'react';
import {GeofencingZones} from '@atb/api/types/generated/mobility-types_v2';

export const useGeofencingZonesQuery = (
  systemId: string,
  vehicleTypeId: string,
) => {
  const {theme} = useThemeContext();

  const select = useCallback(
    (geofencingZones: GeofencingZones[] | null) => {
      const applicableGeofencingZones =
        filterOutFeaturesNotApplicableForCurrentVehicle(
          geofencingZones,
          vehicleTypeId,
        );
      const geofencingZonesWithCustomProps = addGeofencingZoneCustomProps(
        applicableGeofencingZones,
        theme.color.geofencingZone,
        vehicleTypeId,
      );
      const geofencingZonesWithDecodedCoordinates =
        decodePolylineEncodedMultiPolygons(geofencingZonesWithCustomProps);

      const sortedFeatures = sortFeaturesByLayerIndexWeight(
        geofencingZonesWithDecodedCoordinates,
      );

      const iconFeatures = getIconFeatures(sortedFeatures);

      return {
        iconFeatures,
        geofencingZoneFeatures: sortedFeatures,
      };
    },
    [theme.color.geofencingZone, vehicleTypeId],
  );

  return useQuery({
    queryKey: ['getGeofencingZones', systemId],
    queryFn: ({signal}) => getGeofencingZones([systemId], {signal}),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    select,
  });
};
