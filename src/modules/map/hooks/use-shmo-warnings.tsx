import {RefObject, useEffect, useState} from 'react';
import {Feature, Point} from 'geojson';
import {MapView} from '@rnmapbox/maps';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  getFeaturesAtClick,
  getFeatureToSelect,
  isFeatureGeofencingZone,
} from '../utils';
import {useGeofencingZoneTextContent} from './use-geofencing-zone-text-content';
import {ShmoWarnings} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useTranslation} from '@atb/translations';

export const useShmoWarnings = (mapViewRef: RefObject<MapView | null>) => {
  const {t} = useTranslation();
  const [geofencingZoneMessage, setGeofencingZoneMessage] = useState<
    string | null
  >(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const {location, locationIsAvailable} = useGeolocationContext();
  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();

  const isScooterAvailable = true;
  const isOpeningHours = true;
  const isNearScooter = true;
  const error = false;
  const hasNetworkConnection = true;

  useEffect(() => {
    if (!isScooterAvailable) {
      //Denne el-sparkesykkelen er ikke tilgjengelig akkurat nå
      setWarningMessage(t(ShmoWarnings.scooterDisabled));
      // -Mulig denne bare håndteres via gbfs og feilmelding i bottomsheet om den ikke finner assetIDen, slik det er i dag
    } else if (!isOpeningHours) {
      //El-sparkesyklene er kun tilgjengelige mellom {time} og {time}
      // -Må få oppdatert med åpningstider i gbfs
    } else if (!isNearScooter) {
      //Du må være i nærheten av el-sparkesykkelen for å starte en tur
      // -Skal vi ha en sjekk på dette i appen?
    } else if (!locationIsAvailable) {
      //Posisjon utilgjengelig. Det kan oppstå problemer med å avslutte turen.
    } else if (error) {
      //Noe gikk galt. Prøv igjen eller kontakt operatøren.
    } else if (!hasNetworkConnection) {
      //Du har ingen internettforbindelse
    }
  }, [
    error,
    hasNetworkConnection,
    isNearScooter,
    isOpeningHours,
    isScooterAvailable,
    locationIsAvailable,
    t,
  ]);

  //

  //

  useEffect(() => {
    const getGeoText = async () => {
      const currentCoordinates = [
        location?.coordinates.longitude ?? 0,
        location?.coordinates.latitude ?? 0,
      ];

      if (!mapViewRef.current) return null;
      const pointFeature: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: currentCoordinates,
        },
        properties: {},
      };

      const featuresAtLocation = await getFeaturesAtClick(
        pointFeature,
        mapViewRef,
      );
      if (!featuresAtLocation || featuresAtLocation.length === 0) return;

      const featureToSelect = getFeatureToSelect(
        featuresAtLocation,
        currentCoordinates,
      );

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
    };
    getGeoText();
  }, [location, getGeofencingZoneTextContent, mapViewRef]);

  return {geofencingZoneMessage, warningMessage};
};
