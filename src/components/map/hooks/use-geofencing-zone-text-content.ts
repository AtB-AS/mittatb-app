import {useTranslation} from '@atb/translations';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GeofencingZoneCustomProps} from '../types';

export const useGeofencingZoneTextContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneTextContent = (
    geofencingZoneCustomProps?: GeofencingZoneCustomProps,
  ) => {
    const title = t(
      GeofencingZoneExplanations[
        geofencingZoneCustomProps?.code || 'unspecified'
      ].title,
    );

    const isStationParkingPostfix = geofencingZoneCustomProps?.isStationParking
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
  };

  return {
    getGeofencingZoneTextContent,
  };
};
