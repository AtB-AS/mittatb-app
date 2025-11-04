import {useTranslation} from '@atb/translations';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GeofencingZoneCustomProps} from '../types';
import {GeofencingZoneIconBox} from '@atb/components/icon-box';
import {useCallback} from 'react';

export const useGeofencingZoneContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneContent = useCallback(
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

      const iconNode = geofencingZoneCustomProps?.code ? (
        <GeofencingZoneIconBox
          geofencingZoneCode={geofencingZoneCustomProps?.code}
        />
      ) : null;

      return {
        title,
        description,
        iconNode,
      };
    },
    [t],
  );

  return {
    getGeofencingZoneContent,
  };
};
