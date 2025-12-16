import {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {MapView} from '@rnmapbox/maps';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  getFeaturesAtPoint,
  getFeatureToSelect,
  isFeatureGeofencingZone,
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

export const useShmoWarnings = (
  vehicleId: string,
  mapViewRef?: RefObject<MapView | null>,
) => {
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
        isFeatureGeofencingZone(feature),
      );

      if (!geofencingZoneFeatures || geofencingZoneFeatures.length === 0) {
        setGeofencingZoneWarning(null);
        return;
      }

      const featureToSelect = getFeatureToSelect(geofencingZoneFeatures);

      if (
        featureToSelect?.properties?.geofencingZoneCustomProps?.code !==
        'allowed'
      ) {
        const geofencingZoneContent = getGeofencingZoneContent(
          featureToSelect?.properties?.geofencingZoneCustomProps,
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
