import {RefObject, useEffect, useRef, useState} from 'react';
import {MapView} from '@rnmapbox/maps';
import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/modules/geolocation';
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

export const useShmoWarnings = (
  vehicleId: string,
  mapViewRef?: RefObject<MapView | null>,
) => {
  const {t} = useTranslation();
  const [geofencingZoneMessage, setGeofencingZoneMessage] = useState<
    string | null
  >(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const coordinates = getCurrentCoordinatesGlobal();

  const {locationIsAvailable} = useGeolocationContext();
  const {vehicle} = useVehicle(vehicleId);

  useEffect(() => {
    if (vehicle?.isDisabled) {
      setWarningMessage(t(ShmoWarnings.scooterDisabled));
    } else if (warningMessage !== null) {
      setWarningMessage(null);
    }
  }, [locationIsAvailable, t, vehicle?.isDisabled, warningMessage]);

  const throttledCallback = useRef(
    throttle(async (loc: {latitude: number; longitude: number}) => {
      if (!mapViewRef?.current) return null;

      const featuresAtLocation = await getFeaturesAtPoint(
        [loc.longitude, loc.latitude],
        mapViewRef,
      );

      if (!featuresAtLocation || featuresAtLocation.length === 0) return;

      const featureToSelect = getFeatureToSelect(featuresAtLocation, [
        loc.longitude,
        loc.latitude,
      ]);

      if (isFeatureGeofencingZone(featureToSelect)) {
        const textContent = getGeofencingZoneTextContent(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );

        if (featureToSelect?.properties?.geofencingZoneCustomProps?.code) {
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
    if (coordinates) {
      throttledCallback(coordinates);
    }
  }, [coordinates, throttledCallback]);

  return {geofencingZoneMessage, warningMessage};
};
