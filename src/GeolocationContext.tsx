import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {Alert, Platform, Rationale} from 'react-native';
import {isLocationEnabled} from 'react-native-device-info';
import Geolocation, {
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
} from 'react-native-permissions';
import {updateMetadata as updateChatUserMetadata} from './chat/metadata';
import {useAppStateStatus} from './utils/use-app-state-status';

type GeolocationState = {
  status: PermissionStatus | null;
  locationEnabled: boolean;
  location: GeoPosition | null;
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
      };
    case 'LOCATION_CHANGED':
      return {
        ...prevState,
        location: action.location,
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

  const hasPermission = state.status === 'granted' && state.locationEnabled;

  useEffect(() => {
    let watchId: number;

    async function startLocationWatcher() {
      if (!hasPermission) {
        dispatch({type: 'LOCATION_CHANGED', location: null});
      } else {
        const config: GeoOptions = {enableHighAccuracy: true};
        watchId = Geolocation.watchPosition(
          (location) => {
            dispatch({type: 'LOCATION_CHANGED', location});
          },
          async () => {
            const status = await checkGeolocationPermission();
            const locationEnabled = await isLocationEnabled();
            if (status !== 'granted' || !locationEnabled) {
              dispatch({type: 'PERMISSION_CHANGED', status, locationEnabled});
            }
            dispatch({type: 'LOCATION_CHANGED', location: null});
          },
          config,
        );
      }
    }

    startLocationWatcher();
    return () => Geolocation.clearWatch(watchId);
  }, [hasPermission]);

  const appStatus = useAppStateStatus();

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
    return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
}

async function requestGeolocationPermission(): Promise<PermissionStatus> {
  const rationale: Rationale = {
    title: 'Vil du gi AtB Reise tilgang til posisjonen din?',
    message: 'Vi trenger din posisjon for å lage reiseruter',
    buttonNeutral: 'Spør meg senere',
    buttonNegative: 'Ikke tillat',
    buttonPositive: 'Tillat',
  };

  if (Platform.OS === 'ios') {
    return await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, rationale);
  } else {
    return await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, rationale);
  }
}
