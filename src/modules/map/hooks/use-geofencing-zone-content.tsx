import {useTranslation} from '@atb/translations';
import {GeofencingZoneExplanations} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GeofencingZoneIconBox} from '@atb/components/icon-box';
import {useCallback} from 'react';
import {GeofencingZoneCode} from '@atb-as/theme';

export const useGeofencingZoneContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneContent = useCallback(
    (gfzCode?: GeofencingZoneCode) => {
      const title = t(
        GeofencingZoneExplanations[gfzCode || 'unspecified'].title,
      );

      const isStationParkingPostfix = ''; // todo: fix
      // geofencingZoneCustomProps?.isStationParking
      //   ? '. ' + t(GeofencingZoneExtraExplanations.isStationParking)
      //   : '';

      const description =
        t(GeofencingZoneExplanations[gfzCode || 'unspecified'].description) +
        isStationParkingPostfix;

      const iconNode = gfzCode ? (
        <GeofencingZoneIconBox geofencingZoneCode={gfzCode} />
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
