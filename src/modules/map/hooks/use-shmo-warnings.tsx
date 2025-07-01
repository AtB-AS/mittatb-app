import {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {MapView} from '@rnmapbox/maps';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  getFeaturesAtPoint,
  getFeatureToSelect,
  getOpeningHoursInterval,
  isFeatureGeofencingZone,
  isScooterOpen,
} from '../utils';
import {useGeofencingZoneTextContent} from './use-geofencing-zone-text-content';
import {ShmoWarnings} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';
import {useVehicle} from '@atb/modules/mobility';
import {throttle} from '@atb/utils/throttle';
import {Coordinates} from '@atb/utils/coordinates';
import opening_hours from 'opening_hours';
import {useNow} from '@atb/utils/use-now';

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
  const now = useNow(30000);
  const {vehicle} = useVehicle(vehicleId);

  const warningMessage = useMemo(() => {
    if (!vehicle || !vehicle?.system?.openingHours) return null;
    const dateNow = new Date(now);

    const oh = new opening_hours(vehicle?.system?.openingHours ?? '');
    const timeFormatOptions = {
      hour: '2-digit' as const,
      minute: '2-digit' as const,
    };

    if (vehicle?.isDisabled) {
      return t(ShmoWarnings.scooterDisabled);
    }

    if (!isScooterOpen(oh, dateNow)) {
      const {open, closing} = getOpeningHoursInterval(oh, dateNow);
      return t(
        ShmoWarnings.scooterClosed(
          open?.toLocaleTimeString([], timeFormatOptions),
          closing?.toLocaleTimeString([], timeFormatOptions),
        ),
      );
    }

    return null;
  }, [vehicle, now, t]);

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
