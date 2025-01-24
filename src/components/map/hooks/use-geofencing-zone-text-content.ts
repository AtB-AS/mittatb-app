import {useTranslation} from '@atb/translations';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GeofencingZoneCustomProps} from '../types';
import {useCallback} from 'react';

export const useGeofencingZoneTextContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneTextContent = useCallback(
    (geofencingZoneCustomProps?: GeofencingZoneCustomProps) => {
      const title = t(
        GeofencingZoneExplanations[
          geofencingZoneCustomProps?.code || 'unspecified'
        ].title,
      );

      const isStationParkingPostfix =
        geofencingZoneCustomProps?.isStationParking
          ? '. ' + t(GeofencingZoneExtraExplanations.isStationParking)
          : '';

      const description =
        t(
          GeofencingZoneExplanations[
            geofencingZoneCustomProps?.code || 'unspecified'
          ].description,
        ) + isStationParkingPostfix;

      return {
        title,
        description,
      };
    },
    [t],
  );

  return {
    getGeofencingZoneTextContent,
  };
};
