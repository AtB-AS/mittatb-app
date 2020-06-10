import React, {useEffect, useReducer, createContext, useContext} from 'react';
import {Platform, Rationale, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  GeolocationResponse,
  GeolocationOptions,
} from '@react-native-community/geolocation';
import {
  request,
  check,
  PERMISSIONS,
  PermissionStatus,
  openSettings,
} from 'react-native-permissions';
import bugsnag from './diagnostics/bugsnag';

type GeolocationState = {
  status: PermissionStatus | null;
  location: GeolocationResponse | null;
};

type GeolocationReducerAction =
  | {
      status: PermissionStatus | null;
      type: 'PERMISSION_CHANGED';
    }
  | {
      location: GeolocationResponse | null;
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
      };
    case 'LOCATION_CHANGED':
      return {
        ...prevState,
        location: action.location,
      };
  }
};

export type PermissionOpts = {useSettingsFallback: boolean};
export type RequestPermissionFn = (
  opts?: PermissionOpts,
) => Promise<PermissionStatus | undefined>;

type GeolocationContextState = GeolocationState & {
  requestPermission: RequestPermissionFn;
};

const GeolocationContext = createContext<GeolocationContextState | undefined>(
  undefined,
);

const defaultState: GeolocationState = {
  status: null,
  location: null,
};

const translateErrorCode = (code: number) => {
  switch (code) {
    case 1:
      return 'PERMISSION_DENIED';
    case 2:
      return 'POSITION_UNAVAILABLE';
    case 3:
      return 'TIMEOUT';
    default:
      return 'UNKNOWN';
  }
};

const GeolocationContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<GeolocationReducer>(
    geolocationReducer,
    defaultState,
  );

  async function requestPermission(opts?: PermissionOpts) {
    if (state.status === 'blocked' && opts?.useSettingsFallback) {
      Alert.alert(
        'Du har blokkert posisjonsdeling',
        'For å kunne skru på posisjonsdeling, må du gå til innstillinger for å tillate dette for AtB-appen. Du må starte appen på nytt etter du har tillatt posisjonsdeling. Vil du gjøre dette?',
        [{text: 'Ja', onPress: () => openSettings()}, {text: 'Nei'}],
      );
    } else {
      const status = await requestGeolocationPermission();
      dispatch({type: 'PERMISSION_CHANGED', status});
      return status;
    }
  }

  const hasPermission = state.status === 'granted';

  useEffect(() => {
    if (!hasPermission) {
      dispatch({type: 'LOCATION_CHANGED', location: null});
    } else {
      const config: GeolocationOptions = {enableHighAccuracy: true};

      const watchId = Geolocation.watchPosition(
        (location) => dispatch({type: 'LOCATION_CHANGED', location}),
        async (err) => {
          bugsnag.notify(
            new Error('Geolocation error: ' + err.message),
            (report) => {
              report.metadata = {
                ...report.metadata,
                geolocation: {
                  code: translateErrorCode(err.code),
                  message: err.message,
                },
              };
            },
          );
          const status = await checkGeolocationPermission();
          if (status !== 'granted') {
            dispatch({type: 'PERMISSION_CHANGED', status});
          }
          dispatch({type: 'LOCATION_CHANGED', location: null});
        },
        config,
      );

      return () => Geolocation.clearWatch(watchId);
    }
  }, [hasPermission]);

  useEffect(() => {
    async function checkPermission() {
      const status = await checkGeolocationPermission();
      dispatch({type: 'PERMISSION_CHANGED', status});
    }
    checkPermission();
  }, []);

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

async function checkGeolocationPermission(): Promise<PermissionStatus> {
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
