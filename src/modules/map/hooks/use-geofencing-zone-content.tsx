import {useTranslation} from '@atb/translations';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
  StationParkingExplanation,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  GeofencingZoneIconBox,
  StationParkingIconBox,
} from '@atb/components/icon-box';
import {useCallback} from 'react';
import {GeofencingZoneCode} from '@atb-as/theme';

export type GeofencingZoneContent = {
  title: string;
  description: string;
  iconNode: React.ReactNode | null;
};

export const useGeofencingZoneContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneContent = useCallback(
    (
      geofencingZoneCode?: GeofencingZoneCode,
      isStationParking?: boolean,
    ): GeofencingZoneContent => {
      const key =
        geofencingZoneCode && geofencingZoneCode in GeofencingZoneExplanations
          ? geofencingZoneCode
          : 'unspecified';

      const title = t(GeofencingZoneExplanations[key].title);

      const isStationParkingPostfix = isStationParking
        ? '. ' + t(GeofencingZoneExtraExplanations.isStationParking)
        : '';

      const description =
        t(GeofencingZoneExplanations[key].description) +
        isStationParkingPostfix;

      const iconNode = geofencingZoneCode ? (
        <GeofencingZoneIconBox geofencingZoneCode={geofencingZoneCode} />
      ) : null;

      return {
        title,
        description,
        iconNode,
      };
    },
    [t],
  );

  const getStationParkingContent = useCallback(
    (): GeofencingZoneContent => ({
      title: t(StationParkingExplanation.title),
      description: t(StationParkingExplanation.description),
      iconNode: <StationParkingIconBox />,
    }),
    [t],
  );

  return {
    getGeofencingZoneContent,
    getStationParkingContent,
  };
};
