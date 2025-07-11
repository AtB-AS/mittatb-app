import {LoadingParams} from '@atb/screen-components/loading-screen';

jest.mock('@bugsnag/react-native', () => {});
jest.mock('@entur-private/abt-mobile-client-sdk', () => {});
jest.mock('@entur-private/abt-token-server-javascript-interface', () => {});
jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('@react-native-firebase/auth', () => {});
jest.mock('@react-native-firebase/remote-config', () => {});
jest.mock('react-native-device-info', () => {});
jest.mock('react-native-inappbrowser-reborn', () => {});

jest.mock('@atb/api', () => {});
jest.mock('@atb/modules/configuration', () => {});
jest.mock('@atb/modules/mobile-token', () => {});
jest.mock('@atb/modules/ticketing', () => {});
jest.mock('@atb/modules/time', () => {});

const DEFAULT_AUTH_STATUS: LoadingParams = {
  isLoadingAppState: false,
  authStatus: 'authenticated',
  firestoreConfigStatus: 'success',
  remoteConfigIsLoaded: true,
};
jest.mock('@atb/modules/auth', () => ({
  useAuthContext: () => ({
    authStatus: DEFAULT_AUTH_STATUS,
    abtCustomerId: '1',
    retryAuth: () => {},
  }),
}));
