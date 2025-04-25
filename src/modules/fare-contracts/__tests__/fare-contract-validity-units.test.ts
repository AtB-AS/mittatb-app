import {fareContractValidityUnits} from '../fare-contract-validity-units';
import {LoadingParams} from '@atb/loading-screen/types';
import React from 'react';

const DEFAULT_MOCK_STATE: LoadingParams = {
  isLoadingAppState: false,
  authStatus: 'authenticated',
  firestoreConfigStatus: 'success',
  remoteConfigIsLoaded: true,
};

jest.mock('@atb/auth/AuthContext', () => {});
jest.mock('@atb/mobile-token', () => {});
jest.mock('@atb/ticketing/TicketingContext', () => {});
jest.mock('@atb/configuration/FirestoreConfigurationContext', () => {});
jest.mock('@atb/api', () => {});
jest.mock('@atb/time', () => {});
jest.mock('@react-native-firebase/remote-config', () => {});
jest.mock('@entur-private/abt-mobile-client-sdk', () => {});
jest.mock('@bugsnag/react-native', () => {});
jest.mock('@react-native-firebase/auth', () => {});
jest.mock('@entur-private/abt-token-server-javascript-interface', () => {});
jest.mock('react-native-device-info', () => {});
jest.mock('react-native-inappbrowser-reborn', () => {});
jest.mock('@atb/auth', () => ({
  useAuthContext: () => ({
    authStatus: DEFAULT_MOCK_STATE,
    abtCustomerId: '1',
    retryAuth: () => {},
  }),
}));
jest.spyOn(React, 'useCallback').mockImplementation((f) => f);
jest.spyOn(React, 'useMemo').mockImplementation((f) => f());

describe('fareContractValidityUnits', () => {
  // Constants for readability and maintainability
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
  const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
  const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7;

  describe('seconds range (0 to 59 seconds)', () => {
    it('should return seconds units for 0 seconds', () => {
      expect(fareContractValidityUnits(0)).toEqual(['s']);
    });

    it('should return seconds units for 30 seconds', () => {
      expect(fareContractValidityUnits(30)).toEqual(['s']);
    });

    it('should return seconds units for 59 seconds', () => {
      expect(fareContractValidityUnits(SECONDS_IN_MINUTE - 1)).toEqual(['s']);
    });
  });

  describe('minutes range (60 seconds to 9 minutes, 59 seconds)', () => {
    it('should return minutes and seconds units for 60 seconds', () => {
      expect(fareContractValidityUnits(SECONDS_IN_MINUTE)).toEqual(['m', 's']);
    });

    it('should return minutes and seconds units for 9 minutes 59 seconds', () => {
      expect(fareContractValidityUnits(10 * SECONDS_IN_MINUTE - 1)).toEqual([
        'm',
        's',
      ]);
    });
  });

  describe('minutes and second range (10 minutes to 59 minutes, 59 seconds)', () => {
    it('should return minutes units for 10 minutes', () => {
      expect(fareContractValidityUnits(10 * SECONDS_IN_MINUTE)).toEqual(['m']);
    });

    it('should return minutes units for 30 minutes', () => {
      expect(fareContractValidityUnits(30 * SECONDS_IN_MINUTE)).toEqual(['m']);
    });

    it('should return minutes units for 59 minutes, 59 seconds', () => {
      expect(fareContractValidityUnits(SECONDS_IN_HOUR - 1)).toEqual(['m']);
    });
  });

  describe('hours range (1 hour to 23 hours, 59 minutes)', () => {
    it('should return hours and minutes units for 1 hour', () => {
      expect(fareContractValidityUnits(SECONDS_IN_HOUR)).toEqual(['h', 'm']);
    });

    it('should return hours and minutes units for 12 hours', () => {
      expect(fareContractValidityUnits(12 * SECONDS_IN_HOUR)).toEqual([
        'h',
        'm',
      ]);
    });

    it('should return hours and minutes units for 23 hours, 59 minutes', () => {
      expect(fareContractValidityUnits(SECONDS_IN_DAY - 1)).toEqual(['h', 'm']);
    });
  });

  describe('days range (1 day to 6 days, 23 hours)', () => {
    it('should return days and hours units for 1 day', () => {
      expect(fareContractValidityUnits(SECONDS_IN_DAY)).toEqual(['d', 'h']);
    });

    it('should return days and hours units for 3 days', () => {
      expect(fareContractValidityUnits(3 * SECONDS_IN_DAY)).toEqual(['d', 'h']);
    });

    it('should return days and hours units for 6 days, 23 hours', () => {
      expect(fareContractValidityUnits(SECONDS_IN_WEEK - 1)).toEqual([
        'd',
        'h',
      ]);
    });
  });

  describe('week+ range (7 days or more)', () => {
    it('should return days units for 7 days', () => {
      expect(fareContractValidityUnits(SECONDS_IN_WEEK)).toEqual(['d']);
    });

    it('should return days units for 14 days', () => {
      expect(fareContractValidityUnits(2 * SECONDS_IN_WEEK)).toEqual(['d']);
    });

    it('should return days units for 30 days', () => {
      expect(fareContractValidityUnits(30 * SECONDS_IN_DAY)).toEqual(['d']);
    });
  });

  describe('edge cases', () => {
    it('should return default units for negative values', () => {
      expect(fareContractValidityUnits(-1)).toEqual(['s']);
    });

    it('should return days units for very large values', () => {
      expect(fareContractValidityUnits(Number.MAX_SAFE_INTEGER)).toEqual(['d']);
    });

    it('should handle boundary transitions correctly', () => {
      // Test exact boundaries
      expect(fareContractValidityUnits(SECONDS_IN_MINUTE - 1)).toEqual(['s']);
      expect(fareContractValidityUnits(SECONDS_IN_MINUTE)).toEqual(['m', 's']);
      expect(fareContractValidityUnits(SECONDS_IN_HOUR)).toEqual(['h', 'm']);
      expect(fareContractValidityUnits(SECONDS_IN_DAY)).toEqual(['d', 'h']);
      expect(fareContractValidityUnits(SECONDS_IN_WEEK)).toEqual(['d']);
    });
  });
});
