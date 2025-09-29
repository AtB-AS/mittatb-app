import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {isLocationEnabled} from 'react-native-device-info';
import Geolocation, {
  GeolocationOptions,
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  PermissionStatus,
  request,
  requestMultiple,
} from 'react-native-permissions';
import {useIntercomMetadata} from '@atb/modules/chat';
import {useAppStateStatus} from '../../utils/use-app-state-status';
import {GeoLocation} from '@atb/modules/favorites';
import {dictionary, GeoLocationTexts, useTranslation} from '@atb/translations';
import {Coordinates} from '@atb/utils/coordinates';
import {tGlobal} from '@atb/modules/locale';
import {coordinatesDistanceInMetres} from '@atb/utils/location';

const config: GeolocationOptions = {
  enableHighAccuracy: true,
  distanceFilter: 20,
};

let currentCoordinatesGlobal: Coordinates | undefined = undefined;
export const getCurrentCoordinatesGlobal = () =>
  currentCoordinatesGlobal && {
    ...currentCoordinatesGlobal,
  };

type GeolocationState = {
  status: PermissionStatus | null;
  locationEnabled: boolean;
  locationIsAvailable: boolean;
  preciseLocationIsAvailable: boolean;
  location: GeoLocation | null;
  locationError: GeolocationError | null;
  getCurrentCoordinates: (
    askForPermissionIfBlocked?: boolean,
  ) => Promise<Coordinates | undefined>;
};

type GeolocationReducerAction =
  | {
      status: PermissionStatus | null;
      locationEnabled: boolean;
      type: 'PERMISSION_CHANGED';
    }
  | {
      position: GeolocationResponse | null;
      locationName: string;
      type: 'LOCATION_CHANGED';
    }
  | {
      locationError: GeolocationError | null;
      type: 'LOCATION_ERROR';
    }
  | {type: 'PRECISE_LOCATION_PERMISSION_CHANGED'; status: boolean};

type GeolocationReducer = (
  prevState: GeolocationState,
  action: GeolocationReducerAction,
) => GeolocationState;

const geolocationReducer: GeolocationReducer = (prevState, action) => {
  switch (action.type) {
    case 'PERMISSION_CHANGED':
      return {
        ...prevState,
        status: action.status,
        locationEnabled: action.locationEnabled,
        locationError: null,
      };
    case 'LOCATION_CHANGED':
      const location = mapPositionToLocation(
        action.position,
        action.locationName,
      );
      currentCoordinatesGlobal = location?.coordinates;
      return {
        ...prevState,
        location,
        locationError: null,
      };
    case 'LOCATION_ERROR':
      return {
        ...prevState,
        locationError: action.locationError,
      };
    case 'PRECISE_LOCATION_PERMISSION_CHANGED':
      return {
        ...prevState,
        preciseLocationIsAvailable: action.status,
      };
  }
};

const mapPositionToLocation = (
  position: GeolocationResponse | null,
  name: string,
): GeoLocation | null =>
  position
    ? {
        id: `geo-${position.coords.latitude}-${position.coords.longitude}`,
        name,
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        resultType: 'geolocation',
      }
    : null;

type RequestLocationPermissionFn = (
  requestPrecise: boolean,
) => Promise<PermissionStatus | undefined>;

type GeolocationContextState = GeolocationState & {
  requestLocationPermission: RequestLocationPermissionFn;
};

const GeolocationContext = createContext<GeolocationContextState | undefined>(
  undefined,
);

const defaultState: GeolocationState = {
  status: null,
  locationEnabled: false,
  locationIsAvailable: false,
  preciseLocationIsAvailable: false,
  location: null,
  locationError: null,
  getCurrentCoordinates: () => Promise.resolve(undefined),
};

Geolocation.setRNConfiguration({
  locationProvider: 'playServices',
  skipPermissionRequests: true,
});

type Props = {
  children: React.ReactNode;
};

export const GeolocationContextProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(geolocationReducer, defaultState);
  const appStatus = useAppStateStatus();
  const {t} = useTranslation();
  const geoLocationName = t(dictionary.myPosition); // TODO: Other place for this fallback
  const {updateMetadata} = useIntercomMetadata();

  const requestLocationPermission = useCallback(
    async (requestPrecise = false) => {
      if (!(await isLocationEnabled())) {
        openBlockedLocationAlert(requestPrecise);
      } else {
        const status = await requestGeolocationPermission(requestPrecise);
        dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled: true});
        dispatch({
          type: 'PRECISE_LOCATION_PERMISSION_CHANGED',
          status: status === 'granted' && requestPrecise,
        });
        return status;
      }
    },
    [],
  );

  async function handleLocationError(locationError: GeolocationError) {
    const status = await checkGeolocationPermission(false);
    const locationEnabled = await isLocationEnabled();
    if (status !== 'granted' || !locationEnabled) {
      dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
    } else {
      dispatch({type: 'LOCATION_ERROR', locationError});
    }
  }

  const locationIsAvailable =
    state.status === 'granted' && state.locationEnabled;

  const preciseLocationIsAvailable =
    state.preciseLocationIsAvailable && state.locationEnabled;

  const updateLocation = (
    position: GeolocationResponse | null,
    locationName: string,
  ) =>
    dispatch({
      type: 'LOCATION_CHANGED',
      position,
      locationName,
    });

  useEffect(() => {
    if (appStatus === 'active') {
      if (!locationIsAvailable) {
        updateLocation(null, geoLocationName);
      } else {
        const watchId = Geolocation.watchPosition(
          (position) => updateLocation(position, geoLocationName),
          handleLocationError,
          config,
        );
        return () => Geolocation.clearWatch(watchId);
      }
    }
  }, [geoLocationName, locationIsAvailable, appStatus]);

  const currentLocationError = state.locationError;

  useEffect(() => {
    if (!!currentLocationError && appStatus === 'active') {
      Geolocation.getCurrentPosition(
        (position) => updateLocation(position, geoLocationName),
        handleLocationError,
      );
    }
  }, [currentLocationError, appStatus, geoLocationName]);

  useEffect(() => {
    async function checkPermission() {
      if (appStatus === 'active') {
        const preciseStatus = await checkGeolocationPermission(true);
        dispatch({
          type: 'PRECISE_LOCATION_PERMISSION_CHANGED',
          status: preciseStatus === 'granted' && state.locationEnabled,
        });

        const status = await checkGeolocationPermission(false);
        const locationEnabled = await isLocationEnabled();

        if (state.status != status) {
          dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
        }
      }
    }

    checkPermission();
  }, [appStatus, state.locationEnabled, state.status]);

  useEffect(() => {
    if (state.status !== null) {
      updateMetadata({'AtB-App-Location-Status': state.status});
    }
  }, [state.status, updateMetadata]);

  const getCurrentCoordinates = useCallback(
    (
      askForPermissionIfBlocked: boolean | undefined = false,
    ): Promise<Coordinates | undefined> => {
      return new Promise(async (resolve) => {
        if (currentCoordinatesGlobal) {
          resolve(currentCoordinatesGlobal);
        } else {
          if (state.status === 'blocked' && !askForPermissionIfBlocked) {
            resolve(undefined);
          } else if (state.status !== 'granted') {
            const status = await requestLocationPermission();
            status !== 'granted' && resolve(undefined);
          }
          Geolocation.getCurrentPosition(
            (position) => {
              updateLocation(position, geoLocationName);
              const currentLocation = mapPositionToLocation(
                position,
                geoLocationName,
              );
              resolve(currentLocation?.coordinates);
            },
            (error) => {
              handleLocationError(error);
              resolve(undefined);
            },
            config,
          );
        }
      });
    },
    [geoLocationName, state.status, requestLocationPermission],
  );

  return (
    <GeolocationContext.Provider
      value={{
        ...state,
        locationIsAvailable,
        preciseLocationIsAvailable,
        requestLocationPermission,
        getCurrentCoordinates,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

const requestGeolocationPermission = async (
  requestPrecise: boolean,
): Promise<PermissionStatus> => {
  const permissionStatus = await checkGeolocationPermission(requestPrecise);
  if (Platform.OS === 'ios') {
    if (permissionStatus === 'blocked') {
      openSettingsAlert(requestPrecise);
      return permissionStatus;
    } else {
      return await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
  } else {
    // Android

    if (permissionStatus === 'denied') {
      const permissions = [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ...(requestPrecise ? [] : [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]),
      ];
      const requestedStatus = await requestMultiple(permissions);
      const permissionBlocked = permissions.every(
        (permission) => requestedStatus[permission] === 'blocked',
      );
      if (permissionBlocked) {
        openSettingsAlert(requestPrecise);
        return permissionStatus;
      }
    }
    return await checkGeolocationPermission(requestPrecise);
  }
};

const openBlockedLocationAlert = (isPrecise: boolean) =>
  Alert.alert(
    tGlobal(GeoLocationTexts.blockedLocation.title),
    tGlobal(GeoLocationTexts.blockedLocation.message(isPrecise)),
  );

const openSettingsAlert = (isPrecise: boolean) =>
  Alert.alert(
    tGlobal(GeoLocationTexts.locationPermission.title(isPrecise)),
    tGlobal(GeoLocationTexts.locationPermission.message(isPrecise)),
    [
      {
        text: tGlobal(GeoLocationTexts.locationPermission.goToSettings),
        onPress: () => Linking.openSettings(),
      },
      {
        text: tGlobal(GeoLocationTexts.locationPermission.cancel),
        onPress: () => {},
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );

export function useGeolocationContext() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error(
      'useGeolocationState must be used within a GeolocationContextProvider',
    );
  }
  return context;
}

/**
 * Custom hook to return a stable location.
 * - The location is considered stable if the distance between the current location and the last used location is less than the threshold.
 * - If threshold is exceeded, the location is updated.
 * NOTE: If the location is currently not available (undefined), the last used location is returned.
 *
 * @param {number} thresholdMeters - The threshold in meters to consider the location stable.
 * @returns {GeoLocation | undefined} - The stable location.
 */
export function useStableLocation(
  thresholdMeters: number = 150,
): GeoLocation | undefined {
  const {location} = useGeolocationContext();
  const [stableLocation, setStableLocation] = useState<GeoLocation | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!location) return;

    if (!stableLocation) {
      setStableLocation(location);
      return;
    }

    const distance = coordinatesDistanceInMetres(
      stableLocation.coordinates,
      location.coordinates,
    );

    if (distance > thresholdMeters) {
      setStableLocation(location);
    }
  }, [location, stableLocation, thresholdMeters]);

  return stableLocation || location || undefined;
}

export async function checkGeolocationPermission(
  checkPrecise: boolean,
): Promise<PermissionStatus> {
  if (Platform.OS === 'ios') {
    return await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    if (checkPrecise) {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return status;
    } else {
      const statuses = await checkMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      const androidFineLocationStatus =
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
      if (
        androidFineLocationStatus !== 'denied' &&
        androidFineLocationStatus !== 'unavailable'
      ) {
        return statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
      }
      return statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION];
    }
  }
}
