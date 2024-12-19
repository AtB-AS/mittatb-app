import {
  ValidityStatus,
  useSortFcOrReservationByValidityAndCreation,
} from '../utils';
import {FareContract, Reservation} from '@atb/ticketing/types';

import {LoadingParams} from '@atb/loading-screen/types';
import React from 'react';
import {addMinutes} from 'date-fns';

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

type MockedFareContract = FareContract & {
  validityStatus: ValidityStatus;
};

type MockedReservation = Reservation & {
  validityStatus: ValidityStatus;
};

function mockupFareContract(
  id: string,
  validityStatus: ValidityStatus,
  minutes: number,
): MockedFareContract {
  return {
    id: id,
    created: addMinutes(new Date(), minutes),
    version: '1',
    customerAccountId: '1',
    purchasedBy: '1',
    orderId: '1',
    state: 0,
    totalAmount: '0',
    minimumSecurityLevel: 1,
    travelRights: [],
    qrCode: '',
    validityStatus: validityStatus,
  };
}

function mockupReservation(
  id: string,
  validityStatus: ValidityStatus,
  minutes: number,
): MockedReservation {
  return {
    orderId: id,
    created: addMinutes(new Date(), minutes),
    paymentId: 1,
    transactionId: 1,
    paymentType: 2,
    url: 'http://example.com',
    validityStatus: validityStatus,
  };
}

describe('Sort by Validity', () => {
  const now = Date.now();

  it('Should sort fc or reservation by validity first', async () => {
    const fcOrReservations: (FareContract | Reservation)[] = [
      mockupFareContract('1', 'valid', -1),
      mockupFareContract('2', 'valid', -2),
      mockupReservation('3', 'valid', 0),
    ];

    const result = useSortFcOrReservationByValidityAndCreation(
      now,
      fcOrReservations,
      (_, fareContract) => (fareContract as MockedFareContract).validityStatus,
    );
    const ids: string[] = result.map((fcOrReservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      if (isFareContract) {
        return fcOrReservation.id;
      } else {
        return fcOrReservation.orderId;
      }
    });

    expect(ids).toEqual(['3', '1', '2']);
  });

  it('Reservation should be first if reservation is being processing', async () => {
    const fcOrReservations: (FareContract | Reservation)[] = [
      mockupFareContract('1', 'valid', -1),
      mockupReservation('3', 'reserving', 1),
      mockupFareContract('2', 'valid', 0),
    ];

    const result = useSortFcOrReservationByValidityAndCreation(
      now,
      fcOrReservations,
      (_, fareContract) => (fareContract as MockedFareContract).validityStatus,
    );
    const ids: string[] = result.map((fcOrReservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      if (isFareContract) {
        return fcOrReservation.id;
      } else {
        return fcOrReservation.orderId;
      }
    });

    expect(ids).toEqual(['3', '2', '1']);
  });
});
