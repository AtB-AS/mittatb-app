import React, {
  MutableRefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {isLocationEnabled} from 'react-native-device-info';
import Geolocation, {
  GeoOptions,
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  PermissionStatus,
  request,
  requestMultiple,
} from 'react-native-permissions';
import {updateMetadata as updateChatUserMetadata} from './chat/metadata';
import {useAppStateStatus} from './utils/use-app-state-status';
import {GeoLocation} from '@atb/favorites';
import {dictionary, GeoLocationTexts, useTranslation} from '@atb/translations';
import {Coordinates} from '@atb/sdk';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const config: GeoOptions = {
  enableHighAccuracy: true,
  distanceFilter: 20,
};

type GeolocationState = {
  status: PermissionStatus | null;
  locationEnabled: boolean;
  locationIsAvailable: boolean;
  location: GeoLocation | null;
  locationError: GeoError | null;
  getCurrentCoordinates: (
    askForPermissionIfBlocked?: boolean,
  ) => Promise<Coordinates | undefined>;
  currentCoordinatesRef?: MutableRefObject<Coordinates | undefined>;
};

type GeolocationReducerAction =
  | {
      status: PermissionStatus | null;
      locationEnabled: boolean;
      type: 'PERMISSION_CHANGED';
    }
  | {
      position: GeoPosition | null;
      locationName: string;
      type: 'LOCATION_CHANGED';
    }
  | {
      locationError: GeoError | null;
      type: 'LOCATION_ERROR';
    };

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
      return {
        ...prevState,
        location: mapPositionToLocation(action.position, action.locationName),
        locationError: null,
      };
    case 'LOCATION_ERROR':
      return {
        ...prevState,
        locationError: action.locationError,
      };
  }
};

const mapPositionToLocation = (
  position: GeoPosition | null,
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

type RequestLocationPermissionFn = () => Promise<PermissionStatus | undefined>;

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
  location: null,
  locationError: null,
  getCurrentCoordinates: () => Promise.resolve(undefined),
  currentCoordinatesRef: undefined,
};

export const GeolocationContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<GeolocationReducer>(
    geolocationReducer,
    defaultState,
  );
  const appStatus = useAppStateStatus();
  const {t} = useTranslation();
  const geoLocationName = t(dictionary.myPosition); // TODO: Other place for this fallback
  const currentCoordinatesRef = useRef<Coordinates | undefined>();
  const {enable_intercom} = useRemoteConfig();

  const openSettingsAlert = useCallback(() => {
    Alert.alert(
      t(GeoLocationTexts.locationPermission.title),
      t(GeoLocationTexts.locationPermission.message),
      [
        {
          text: t(GeoLocationTexts.locationPermission.goToSettings),
          onPress: () => Linking.openSettings(),
        },
        {
          text: t(GeoLocationTexts.locationPermission.cancel),
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }, [t]);

  const requestGeolocationPermission =
    useCallback(async (): Promise<PermissionStatus> => {
      const permissionStatus = await checkGeolocationPermission();
      if (Platform.OS === 'ios') {
        if (permissionStatus === 'blocked') {
          openSettingsAlert();
          return permissionStatus;
        } else {
          return await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        }
      } else {
        // Android

        if (permissionStatus === 'denied') {
          // Android never returns if the permission was blocked with the check, and therefore it must be checked with a request
          const requestedStatus = await requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          ]);

          if (
            requestedStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
              'blocked' &&
            requestedStatus[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] ===
              'blocked'
          ) {
            openSettingsAlert();
            return permissionStatus;
          }
        }

        return await checkGeolocationPermission();
      }
    }, [openSettingsAlert]);

  const requestLocationPermission = useCallback(async () => {
    if (!(await isLocationEnabled())) {
      Alert.alert(
        t(GeoLocationTexts.blockedLocation.title),
        t(GeoLocationTexts.blockedLocation.message),
      );
    } else {
      const status = await requestGeolocationPermission();
      dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled: true});
      return status;
    }
  }, [requestGeolocationPermission, t]);

  async function handleLocationError(locationError: GeoError) {
    const status = await checkGeolocationPermission();
    const locationEnabled = await isLocationEnabled();
    if (status !== 'granted' || !locationEnabled) {
      dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
    } else {
      dispatch({type: 'LOCATION_ERROR', locationError});
    }
  }

  const locationIsAvailable =
    state.status === 'granted' && state.locationEnabled;

  const updateLocation = (position: GeoPosition | null, locationName: string) =>
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
        const status = await checkGeolocationPermission();
        const locationEnabled = await isLocationEnabled();

        if (state.status != status) {
          dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
          if (enable_intercom) {
            await updateChatUserMetadata({'AtB-App-Location-Status': status});
          }
        }
      }
    }
    checkPermission();
  }, [appStatus, state.status, enable_intercom]);

  useEffect(() => {
    currentCoordinatesRef.current = state.location?.coordinates;
  }, [state.location?.coordinates]);

  const getCurrentCoordinates = useCallback(
    (
      askForPermissionIfBlocked: boolean | undefined = false,
    ): Promise<Coordinates | undefined> => {
      return new Promise(async (resolve) => {
        if (currentCoordinatesRef.current) {
          resolve(currentCoordinatesRef.current);
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
        requestLocationPermission,
        getCurrentCoordinates,
        currentCoordinatesRef,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

export function useGeolocationState() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error(
      'useGeolocationState must be used within a GeolocationContextProvider',
    );
  }
  return context;
}

export async function checkGeolocationPermission(): Promise<PermissionStatus> {
  if (Platform.OS === 'ios') {
    return await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
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

export class LocationPermissionRequiredError extends Error {
  constructor() {
    super('Permission required');
  }
}

export class NoLocationError extends Error {
  constructor() {
    super('Location missing');
  }
}
