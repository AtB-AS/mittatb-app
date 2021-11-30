import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {Alert, Platform, Rationale} from 'react-native';
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

type GeolocationState = {
  status: PermissionStatus | null;
  locationEnabled: boolean;
  location: GeoPosition | null;
  locationError: GeoError | null;
};

type GeolocationReducerAction =
  | {
      status: PermissionStatus | null;
      locationEnabled: boolean;
      type: 'PERMISSION_CHANGED';
    }
  | {
      location: GeoPosition | null;
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
        location: action.location,
        locationError: null,
      };
    case 'LOCATION_ERROR':
      return {
        ...prevState,
        locationError: action.locationError,
      };
  }
};

export type PermissionOpts = {useSettingsFallback: boolean};
export type RequestPermissionFn = () => Promise<PermissionStatus | undefined>;

type GeolocationContextState = GeolocationState & {
  requestPermission: RequestPermissionFn;
};

const GeolocationContext = createContext<GeolocationContextState | undefined>(
  undefined,
);

const defaultState: GeolocationState = {
  status: null,
  locationEnabled: false,
  location: null,
  locationError: null,
};

const GeolocationContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<GeolocationReducer>(
    geolocationReducer,
    defaultState,
  );

  async function requestPermission() {
    if (!(await isLocationEnabled())) {
      Alert.alert(
        'Du har blokkert posisjonsdeling',
        'For å kunne bruke posisjonen din må du aktivere lokasjonstjenester på telefonen din.',
      );
      dispatch({
        type: 'PERMISSION_CHANGED',
        status: state.status,
        locationEnabled: false,
      });
    } else {
      const status = await requestGeolocationPermission();
      dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled: true});
      return status;
    }
  }

  async function handleLocationError(locationError: GeoError) {
    const status = await checkGeolocationPermission();
    const locationEnabled = await isLocationEnabled();
    if (status !== 'granted' || !locationEnabled) {
      dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
    } else {
      dispatch({type: 'LOCATION_ERROR', locationError});
    }
  }

  const hasPermission = state.status === 'granted' && state.locationEnabled;
  useEffect(() => {
    let watchId: number;

    async function startLocationWatcher() {
      if (!hasPermission) {
        dispatch({type: 'LOCATION_CHANGED', location: null});
      } else {
        const config: GeoOptions = {
          enableHighAccuracy: true,
          distanceFilter: 50,
        };

        watchId = Geolocation.watchPosition(
          (location) => {
            dispatch({type: 'LOCATION_CHANGED', location});
          },
          handleLocationError,
          config,
        );
      }
    }
    startLocationWatcher();
    return () => Geolocation.clearWatch(watchId);
  }, [hasPermission]);

  const currentLocationError = state.locationError;
  const appStatus = useAppStateStatus();
  useEffect(() => {
    if (!!currentLocationError && appStatus === 'active') {
      Geolocation.getCurrentPosition((location) => {
        dispatch({type: 'LOCATION_CHANGED', location});
      }, handleLocationError);
    }
  }, [currentLocationError, appStatus]);

  useEffect(() => {
    async function checkPermission() {
      if (appStatus === 'active') {
        const status = await checkGeolocationPermission();
        const locationEnabled = await isLocationEnabled();

        if (state.status != status) {
          dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
          await updateChatUserMetadata({'AtB-App-Location-Status': status});
        }
      }
    }
    checkPermission();
  }, [appStatus]);

  return (
    <GeolocationContext.Provider value={{...state, requestPermission}}>
      {children}
    </GeolocationContext.Provider>
  );
};

export default GeolocationContextProvider;

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
    let statuses = await checkMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ]);
    if (
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== 'denied' ||
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== 'unavailable'
    ) {
      return statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
    }
    if (
      statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'denied' ||
      statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'unavailable'
    ) {
      return statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION];
    } else {
      return statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION];
    }
  }
}

async function requestGeolocationPermission(): Promise<PermissionStatus> {
  const rationale: Rationale = {
    title: 'Vil du tillate at AtB bruker posisjonen din?',
    message:
      'Ved å tillate deling av posisjon kan du finne nærmeste holdeplass og planlegge reisen fra din lokasjon',
    buttonNeutral: 'Spør meg senere',
    buttonNegative: 'Ikke tillat',
    buttonPositive: 'Tillat',
  };

  if (Platform.OS === 'ios') {
    return await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, rationale);
  } else {
    await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ]);
    return await checkGeolocationPermission();
  }
}
