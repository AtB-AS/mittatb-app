import {useTranslation} from '@atb/translations';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GeofencingZoneCustomProps, GeofencingZoneKeys} from '../types';

export const useGeofencingZoneTextContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneTextContent = (
    geofencingZoneCustomProps?: GeofencingZoneCustomProps<GeofencingZoneKeys>,
  ) => {
    const title = t(
      GeofencingZoneExplanations[
        geofencingZoneCustomProps?.code || 'Unspecified'
      ].title,
    );

    const isStationParkingPostfix = geofencingZoneCustomProps?.isStationParking
      ? '. ' + t(GeofencingZoneExtraExplanations.isStationParking)
      : '';

    const description =
      t(
        GeofencingZoneExplanations[
          geofencingZoneCustomProps?.code || 'Unspecified'
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
