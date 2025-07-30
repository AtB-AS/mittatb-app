import {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {MapView} from '@rnmapbox/maps';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  getFeaturesAtPoint,
  getFeatureToSelect,
  isFeatureGeofencingZone,
} from '../utils';
import {useGeofencingZoneTextContent} from './use-geofencing-zone-text-content';
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
  const [geofencingZoneMessage, setGeofencingZoneMessage] = useState<
    string | null
  >(null);
  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
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

      const geofencingZoneFeatures = featuresAtLocation?.filter(
        (feature) =>
          isFeatureGeofencingZone(feature) &&
          feature?.properties?.geofencingZoneCustomProps?.code,
      );

      if (!geofencingZoneFeatures || geofencingZoneFeatures.length === 0) {
        setGeofencingZoneMessage(null);
        return;
      }

      const featureToSelect = getFeatureToSelect(geofencingZoneFeatures, [
        coordinates.longitude,
        coordinates.latitude,
      ]);

      if (
        featureToSelect?.properties?.geofencingZoneCustomProps?.code !==
        'allowed'
      ) {
        const textContent = getGeofencingZoneTextContent(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );
        setGeofencingZoneMessage(textContent.description);
      } else {
        setGeofencingZoneMessage(null);
      }
    }, 1000),
  ).current;

  useEffect(() => {
    if (location?.coordinates) {
      throttledCallback(location.coordinates);
    }
  }, [location?.coordinates, throttledCallback, vehicleId, mapViewRef]);

  return {geofencingZoneMessage, warningMessage};
};
