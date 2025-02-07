import type {ValidityStatus} from '../utils';
import {FareContract, Reservation, TravelRight} from '@atb/ticketing/types';

import {addMinutes} from 'date-fns';
import {sortFcOrReservationByValidityAndCreation} from '../sort-fc-or-reservation-by-validity-and-creation';

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
    travelRights: [{} as any as TravelRight],
    qrCode: '',
    validityStatus: validityStatus,
    paymentType: ['VISA'],
    totalTaxAmount: '0',
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

    const result = sortFcOrReservationByValidityAndCreation(
      '',
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
      mockupReservation('3', 'reserving', 0),
      mockupFareContract('2', 'valid', 0),
    ];

    const result = sortFcOrReservationByValidityAndCreation(
      '',
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

  it('Multiple reservations and valid fare contracts', async () => {
    const fcOrReservations: (FareContract | Reservation)[] = [
      mockupReservation('1', 'reserving', 0),
      mockupReservation('2', 'reserving', 0.1),
      mockupFareContract('3', 'valid', 0.1),
      mockupFareContract('4', 'valid', 0.11),
    ];

    const result = sortFcOrReservationByValidityAndCreation(
      '',
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

    expect(ids).toEqual(['2', '1', '4', '3']);
  });
});
