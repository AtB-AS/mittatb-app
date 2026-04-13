import {RefObject, useEffect, useMemo, useRef, useState} from 'react';
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
import {ShmoWarnings} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {useVehicle} from '@atb/modules/mobility';
import {throttle} from '@atb/utils/throttle';
import {Coordinates} from '@atb/utils/coordinates';
import {useOpeningHours} from './use-opening-hours';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {GeofencingZoneCode} from '@atb-as/theme';

export const useShmoWarnings = (
  vehicleId: string,
  mapViewRef?: RefObject<MapView | null>,
) => {
  const {enable_geofencing_zones_as_tiles} = useRemoteConfigContext();
  const {t} = useTranslation();
  const [geofencingZoneWarning, setGeofencingZoneWarning] =
    useState<GeofencingZoneContent | null>(null);
  const {getGeofencingZoneContent} = useGeofencingZoneContent();
  const {location} = useGeolocationContext();

  const {vehicle} = useVehicle(vehicleId);
  const {isOpen, openingTime, closingTime} = useOpeningHours(
    vehicle?.system?.openingHours,
  );

  const warningMessage = useMemo(() => {
    const timeFormatOptions = {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
    };

    if (vehicle?.isDisabled) {
      return t(ShmoWarnings.scooterDisabled);
    }

    if (!isOpen && openingTime && closingTime) {
      return t(
        ShmoWarnings.scooterClosed(
          openingTime?.toLocaleTimeString([], timeFormatOptions),
          closingTime?.toLocaleTimeString([], timeFormatOptions),
        ),
      );
    }

    return null;
  }, [vehicle, isOpen, t, openingTime, closingTime]);

  const throttledCallback = useRef(
    throttle(async (coordinates: Coordinates) => {
      if (!mapViewRef?.current) return null;

      const featuresAtLocation = await getFeaturesAtPoint(
        [coordinates.longitude, coordinates.latitude],
        mapViewRef,
      );

      const geofencingZoneFeatures = featuresAtLocation?.filter((feature) =>
        enable_geofencing_zones_as_tiles
          ? isFeatureGeofencingZoneAsTiles(feature)
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
        (enable_geofencing_zones_as_tiles
          ? featProps?.code
          : featProps?.geofencingZoneCustomProps?.code) ?? 'allowed';

      if (code !== 'allowed') {
        const isStationParking: boolean =
          (enable_geofencing_zones_as_tiles
            ? featProps?.stationParking
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

  useEffect(() => {
    if (location?.coordinates) {
      throttledCallback(location.coordinates);
    }
  }, [location?.coordinates, throttledCallback, vehicleId, mapViewRef]);

  return {geofencingZoneWarning, warningMessage};
};
