import {RefObject, useEffect, useRef, useState} from 'react';
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
  const warningMessage = vehicle?.isDisabled
    ? t(ShmoWarnings.scooterDisabled)
    : null;

  const throttledCallback = useRef(
    throttle(async (coordinates: Coordinates) => {
      if (!mapViewRef?.current) return null;

      const featuresAtLocation = await getFeaturesAtPoint(
        [coordinates.longitude, coordinates.latitude],
        mapViewRef,
      );

      if (!featuresAtLocation || featuresAtLocation.length === 0) return;

      const featureToSelect = getFeatureToSelect(featuresAtLocation, [
        coordinates.longitude,
        coordinates.latitude,
      ]);

      if (isFeatureGeofencingZone(featureToSelect)) {
        const textContent = getGeofencingZoneTextContent(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );

        if (
          featureToSelect?.properties?.geofencingZoneCustomProps?.code &&
          featureToSelect?.properties?.geofencingZoneCustomProps?.code !==
            'allowed'
        ) {
          setGeofencingZoneMessage(textContent.description);
        } else {
          setGeofencingZoneMessage(null);
        }
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
