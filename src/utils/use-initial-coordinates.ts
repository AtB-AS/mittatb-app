import {useState, useEffect} from 'react';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {FOCUS_ORIGIN} from '@atb/api/bff/geocoder';
import {Coordinates} from '@atb/sdk';

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
  const {getCurrentCoordinates} = useGeolocationContext();
  const [initialCoordinates, setInitialCoordinates] =
    useState<Coordinates | null>(null);

  useEffect(() => {
    const getInitialCoordinates = async () => {
      const initCoords = await getCurrentCoordinates(askForPermissionIfBlocked);
      setInitialCoordinates(initCoords ?? FOCUS_ORIGIN);
    };
    getInitialCoordinates();
  }, [getCurrentCoordinates, askForPermissionIfBlocked]);

  return initialCoordinates;
}
