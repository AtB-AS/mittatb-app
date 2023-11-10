import {useState, useEffect} from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {Coordinates} from '@entur/sdk';

/**
 * Custom hook to obtain initial geographic coordinates.
 *
 * This hook attempts to retrieve the current geolocation from the GeolocationContext.
 * If unable to obtain the current location, it falls back to a predefined `FOCUS_ORIGIN`.
 *
 * @param {boolean} [askForPermissionIfBlocked=false] - Indicates whether to prompt the user
 * for geolocation permission if it was previously blocked.
 * @returns {(Coordinates | null)} The initial coordinates as a `Coordinates` object, or `null` if unable to determine.
 */
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
