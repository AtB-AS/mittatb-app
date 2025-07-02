import type {ValidityStatus} from '../utils';
import {PaymentStatus, Reservation} from '@atb/modules/ticketing';

import {addMinutes} from 'date-fns';
import {
  sortFcOrReservationByCreation,
  getSortedFareContractsAndReservations,
} from '../sort-fc-or-reservation';
import {FareContractType, TravelRightType} from '@atb-as/utils';

type MockedFareContract = FareContractType & {
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
    travelRights: [{} as any as TravelRightType],
    qrCode: '',
    validityStatus: validityStatus,
    paymentType: ['VISA'],
    totalTaxAmount: '0',
  };
}

function mockupReservation(
  id: string,
  paymentStatus: PaymentStatus,
  minutes: number,
): Reservation {
  return {
    orderId: id,
    created: addMinutes(new Date(), minutes),
    paymentId: 1,
    transactionId: 1,
    paymentType: 2,
    url: 'http://example.com',
    paymentStatus: paymentStatus,
  };
}

describe('Sort by Validity', () => {
  it('Should sort fc or reservation by validity first', async () => {
    const fcOrReservations: (FareContractType | Reservation)[] = [
      mockupFareContract('1', 'valid', -1),
      mockupFareContract('2', 'valid', -2),
      mockupReservation('3', 'INITIATE', 0),
    ];

    const result = getSortedFareContractsAndReservations(fcOrReservations);
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
    const fcOrReservations: (FareContractType | Reservation)[] = [
      mockupFareContract('1', 'valid', -1),
      mockupReservation('3', 'INITIATE', 0),
      mockupFareContract('2', 'valid', 0),
    ];

    const result = getSortedFareContractsAndReservations(fcOrReservations);
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
    const fcOrReservations: (FareContractType | Reservation)[] = [
      mockupReservation('1', 'INITIATE', 0),
      mockupReservation('2', 'INITIATE', 0.1),
      mockupFareContract('3', 'valid', 0.1),
      mockupFareContract('4', 'valid', 0.11),
    ];

    const result = getSortedFareContractsAndReservations(fcOrReservations);
    const ids: string[] = result.map((fcOrReservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      if (isFareContract) {
        return fcOrReservation.id;
      } else {
        return fcOrReservation.orderId;
      }
    });

    expect(ids).toEqual(['4', '2', '3', '1']);
  });

  it('Multiple cancellations and valid fare contracts', async () => {
    const fcOrReservations: (FareContractType | Reservation)[] = [
      mockupReservation('1', 'CANCEL', 0),
      mockupReservation('2', 'CANCEL', 0.1),
      mockupFareContract('4', 'valid', 0.2),
    ];

    const result = getSortedFareContractsAndReservations(fcOrReservations);
    const ids: string[] = result.map((fcOrReservation) =>
      'travelRights' in fcOrReservation
        ? fcOrReservation.id
        : fcOrReservation.orderId,
    );

    expect(ids).toEqual(['4']);
  });

  it('Multiple cancellations between valid fare contracts', async () => {
    const fcOrReservations: (FareContractType | Reservation)[] = [
      mockupReservation('1', 'CANCEL', 0),
      mockupReservation('2', 'CANCEL', 0),
      mockupReservation('3', 'CANCEL', 0),
      mockupReservation('4', 'CANCEL', 0),
      mockupFareContract('5', 'valid', 0.2),
      mockupReservation('6', 'CANCEL', 0.1),
      mockupFareContract('7', 'valid', 0.3),
    ];

    const result = getSortedFareContractsAndReservations(fcOrReservations);
    const ids: string[] = result.map((fcOrReservation) =>
      'travelRights' in fcOrReservation
        ? fcOrReservation.id
        : fcOrReservation.orderId,
    );

    expect(ids).toEqual(['7', '5']);
  });
});

describe('Sort by creation', () => {
  it('sortFcOrReservationByCreation sorts by created', () => {
    const fareContracts = [
      mockupReservation('1', 'INITIATE', -10),
      mockupFareContract('3', 'valid', -30),
      mockupFareContract('2', 'valid', -20),
      mockupReservation('5', 'INITIATE', -50),
      mockupFareContract('4', 'valid', -40),
    ];
    const sorted = sortFcOrReservationByCreation(fareContracts);

    const ids: string[] = sorted.map((fcOrReservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      if (isFareContract) {
        return fcOrReservation.id;
      } else {
        return fcOrReservation.orderId;
      }
    });

    expect(ids).toEqual(['1', '2', '3', '4', '5']);
  });
});
