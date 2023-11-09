import {useState, useEffect} from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {Coordinates} from '@entur/sdk';

export function useInitialCoordinates(
  askForPermissionIfBlocked: boolean | undefined = false,
): Coordinates | null {
  const {getCurrentLocation} = useGeolocationState();
  const [initialCoordinates, setInitialCoordinates] =
    useState<Coordinates | null>(null);

  useEffect(() => {
    const getInitialCoordinates = async () => {
      let initCoords = FOCUS_ORIGIN;
      try {
        const currentLocation = await getCurrentLocation(
          askForPermissionIfBlocked,
        );
        initCoords = currentLocation?.coordinates;
      } catch (err) {
        console.warn(err);
      }
      setInitialCoordinates(initCoords);
    };
    getInitialCoordinates();
  }, [getCurrentLocation, askForPermissionIfBlocked]);

  return initialCoordinates;
}
