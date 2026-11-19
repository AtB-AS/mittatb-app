import {RefObject, useEffect, useRef, useState} from 'react';
import {MapView} from '@rnmapbox/maps';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  getFeaturesAtPoint,
  getFeatureToSelect,
  isFeatureGeofencingZone,
  isFeatureGeofencingZoneAsTiles,
} from '../utils';
import {
  GeofencingZoneContent,
  useGeofencingZoneContent,
} from './use-geofencing-zone-content';
import {isVirtualStationArea} from '@atb/modules/mobility';
import {throttle} from '@atb/utils/throttle';
import {Coordinates} from '@atb/utils/coordinates';
import {GeofencingZoneCode} from '@atb-as/theme';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

export const useGeofencingZoneWarning = (
  vehicleId?: string,
  mapViewRef?: RefObject<MapView | null>,
  lastMapIdleAt?: number,
) => {
  const {isGeofencingZonesAsTilesEnabled} = useFeatureTogglesContext();
  const [geofencingZoneWarning, setGeofencingZoneWarning] =
    useState<GeofencingZoneContent | null>(null);
  const {getGeofencingZoneContent} = useGeofencingZoneContent();
  const {location} = useGeolocationContext();
  const appStateStatus = useAppStateStatus();

  const throttledCallback = useRef(
    throttle(async (coordinates: Coordinates) => {
      if (!mapViewRef?.current) return null;

      const featuresAtLocation = await getFeaturesAtPoint(
        [coordinates.longitude, coordinates.latitude],
        mapViewRef,
      );

      const geofencingZoneFeatures = featuresAtLocation?.filter((feature) =>
        isGeofencingZonesAsTilesEnabled
          ? isFeatureGeofencingZoneAsTiles(feature) ||
            isVirtualStationArea(feature)
          : isFeatureGeofencingZone(feature) &&
            feature?.properties?.geofencingZoneCustomProps?.code,
      );

      if (!geofencingZoneFeatures || geofencingZoneFeatures.length === 0) {
        setGeofencingZoneWarning(null);
        return;
      }

      const featureToSelect = getFeatureToSelect(geofencingZoneFeatures, [
        coordinates.longitude,
        coordinates.latitude,
      ]);

      const featProps = featureToSelect?.properties;
      const code: GeofencingZoneCode =
        (isGeofencingZonesAsTilesEnabled
          ? isVirtualStationArea(featureToSelect)
            ? 'parking'
            : featProps?.code
          : featProps?.geofencingZoneCustomProps?.code) ?? 'allowed';

      if (code !== 'allowed') {
        const isStationParking: boolean =
          (isGeofencingZonesAsTilesEnabled
            ? featProps?.station_parking
            : featProps?.geofencingZoneCustomProps?.isStationParking) ?? false;

        const geofencingZoneContent = getGeofencingZoneContent(
          code,
          isStationParking,
        );
        setGeofencingZoneWarning(geofencingZoneContent);
      } else {
        setGeofencingZoneWarning(null);
      }
    }, 1000),
  ).current;

  // Re-check the warning on location change, map idle and app foreground,
  // since the rendered zones may have been outdated at the last location update.
  useEffect(() => {
    if (appStateStatus !== 'active') return;
    if (location?.coordinates) {
      throttledCallback(location.coordinates);
    }
  }, [
    location?.coordinates,
    throttledCallback,
    vehicleId,
    mapViewRef,
    lastMapIdleAt,
    appStateStatus,
  ]);

  return {geofencingZoneWarning};
};
