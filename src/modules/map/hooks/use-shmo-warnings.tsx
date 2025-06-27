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
import opening_hours from 'opening_hours';

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
  const {location} = useGeolocationContext();

  const {vehicle} = useVehicle(vehicleId);

  useEffect(() => {
    const oh = new opening_hours(vehicle?.system?.openingHours ?? '');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const openIntervalsToday = oh?.getOpenIntervals(today, tomorrow);

    if (
      !openIntervalsToday ||
      openIntervalsToday.length === 0 ||
      !openIntervalsToday[0]?.[0] ||
      !openIntervalsToday[0]?.[1]
    ) {
      return;
    }

    const openingHour = openIntervalsToday[0][0];
    const closingHour = openIntervalsToday[0][1];

    const warnings = [
      {
        condition: vehicle?.isDisabled,
        message: t(ShmoWarnings.scooterDisabled),
      },
      {
        condition: oh && !oh.getState(new Date()),
        message: t(
          ShmoWarnings.scooterNotAvailable(
            openingHour.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            closingHour.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          ),
        ),
      },
    ];

    const activeWarning = warnings.find((warning) => warning.condition);
    setWarningMessage(activeWarning ? activeWarning.message : null);
  }, [t, vehicle]);

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
