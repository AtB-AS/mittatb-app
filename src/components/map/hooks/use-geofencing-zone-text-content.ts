import {useTranslation} from '@atb/translations';
import {
  GeofencingZoneExplanations,
  GeofencingZoneExtraExplanations,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GeofencingZoneCategoryProps, GeofencingZoneCategoryKey} from '../types';

export const useGeofencingZoneTextContent = () => {
  const {t} = useTranslation();

  const getGeofencingZoneTextContent = (
    geofencingZoneCategoryProps: GeofencingZoneCategoryProps<GeofencingZoneCategoryKey>,
  ) => {
    const title = geofencingZoneCategoryProps
      ? t(GeofencingZoneExplanations[geofencingZoneCategoryProps.code].title)
      : '';

    const isStationParkingPostfix =
      geofencingZoneCategoryProps?.isStationParking
        ? '. ' + t(GeofencingZoneExtraExplanations.isStationParking)
        : '';

    const description = geofencingZoneCategoryProps
      ? t(
          GeofencingZoneExplanations[geofencingZoneCategoryProps.code]
            .description,
        ) + isStationParkingPostfix
      : '';
    return {
      title,
      description,
    };
  };

  return {
    getGeofencingZoneTextContent,
  };
};
