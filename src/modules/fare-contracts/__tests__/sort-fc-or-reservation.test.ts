import {PaymentStatus, Reservation} from '@atb/modules/ticketing';
import {
  getSortedFareContractsAndReservations,
  sortFcOrReservationByCreation,
} from '../sort-fc-or-reservation';
import {
  FareContractState,
  FareContractType,
  TravelRightType,
} from '@atb-as/utils';
import {ONE_HOUR_MS, ONE_MINUTE_MS} from '@atb/utils/durations';

const now = new Date('2000-01-01T12:00:00Z').valueOf();

function mockupFareContract(
  testRef: string,
  startDate: Date,
): FareContractType & {testRef: string} {
  return {
    testRef,
    state: FareContractState.Activated,
    created: startDate,
    travelRights: [
      {
        startDateTime: startDate,
        endDateTime: new Date(startDate.valueOf() + ONE_HOUR_MS),
      } as unknown as TravelRightType,
    ],
  } as unknown as FareContractType & {testRef: string};
}

function mockupCarnet(
  testRef: string,
  createdDate: Date,
  activeDate: Date,
): FareContractType & {testRef: string} {
  const base = mockupFareContract(testRef, createdDate);
  return {
    ...base,
    travelRights: [
      {
        ...base.travelRights[0],
        maximumNumberOfAccesses: 1,
        numberOfUsedAccesses: 1,
        usedAccesses: [
          {
            startDateTime: activeDate,
            endDateTime: new Date(activeDate.valueOf() + ONE_HOUR_MS),
          },
        ],
      },
    ],
  } as FareContractType & {testRef: string};
}

function mockupReservation(
  testRef: string,
  createdDate: Date,
  paymentStatus: PaymentStatus,
): Reservation {
  return {
    testRef,
    created: createdDate,
    paymentStatus,
  } as unknown as Reservation & {testRef: string};
}

describe('Sort by Validity', () => {
  it('Should sort reservation by created date', () => {
    const fareContracts: FareContractType[] = [];
    const reservations: Reservation[] = [
      mockupReservation('2', new Date(now - ONE_MINUTE_MS * 2), 'INITIATE'),
      mockupReservation('1', new Date(now - ONE_MINUTE_MS * 1), 'INITIATE'),
      mockupReservation('3', new Date(now - ONE_MINUTE_MS * 3), 'INITIATE'),
    ];
    const result = getSortedFareContractsAndReservations(
      fareContracts,
      reservations,
      now,
    ) as (FareContractType | (Reservation & {testRef: string}))[];

    expect(result.map((r) => (r as any).testRef)).toEqual(['1', '2', '3']);
  });

  it('Should show only the most recent failed reservation', () => {
    const fareContracts: FareContractType[] = [];
    const reservations: Reservation[] = [
      mockupReservation('2', new Date(now - ONE_MINUTE_MS * 2), 'REJECT'),
      mockupReservation('1', new Date(now - ONE_MINUTE_MS * 1), 'CANCEL'),
      mockupReservation('3', new Date(now - ONE_MINUTE_MS * 3), 'CANCEL'),
    ];
    const result = getSortedFareContractsAndReservations(
      fareContracts,
      reservations,
      now,
    ) as (FareContractType | (Reservation & {testRef: string}))[];

    expect(result.map((r) => (r as any).testRef)).toEqual(['1']);
  });

  it('Should sort fc and reservation by validity', async () => {
    const fareContracts: FareContractType[] = [
      mockupFareContract('3', new Date(now - ONE_MINUTE_MS * 3)),
      mockupFareContract('1', new Date(now - ONE_MINUTE_MS * 1)),
      mockupFareContract('4', new Date(now + ONE_MINUTE_MS * 1)),
    ];

    const reservations: Reservation[] = [
      mockupReservation('2', new Date(now - ONE_MINUTE_MS * 2), 'INITIATE'),
    ];

    const result = getSortedFareContractsAndReservations(
      fareContracts,
      reservations,
      now,
    ) as (FareContractType | (Reservation & {testRef: string}))[];
    expect(result.map((i) => (i as any).testRef)).toEqual(['1', '2', '3', '4']);
  });

  it('Should place inactive carnet behind active fare contracts', () => {
    const fareContracts: FareContractType[] = [
      mockupCarnet(
        '1',
        new Date(now + ONE_MINUTE_MS),
        new Date(now + ONE_MINUTE_MS),
      ),
      mockupFareContract('2', new Date(now - ONE_MINUTE_MS)),
    ];
    const reservations: Reservation[] = [];
    const result = getSortedFareContractsAndReservations(
      fareContracts,
      reservations,
      now,
    ) as (FareContractType | (Reservation & {testRef: string}))[];

    expect(result.map((i) => (i as any).testRef)).toEqual(['2', '1']);
  });

  it('Should sort inactive fare contracts by created date', () => {
    const fareContracts: FareContractType[] = [
      mockupFareContract('2', new Date(now - ONE_MINUTE_MS * 2)),
      mockupFareContract('1', new Date(now - ONE_MINUTE_MS * 1)),
    ];
    const reservations: Reservation[] = [];
    const result = getSortedFareContractsAndReservations(
      fareContracts,
      reservations,
      now,
    ) as (FareContractType | (Reservation & {testRef: string}))[];

    expect(result.map((i) => (i as any).testRef)).toEqual(['1', '2']);
  });

  it('Should remove failed reservations after valid fc', () => {
    const fcs = [mockupFareContract('1', new Date(now - ONE_MINUTE_MS * 1))];
    const reservations = [
      mockupReservation('_', new Date(now - ONE_MINUTE_MS * 2), 'REJECT'),
    ];
    const sorted = getSortedFareContractsAndReservations(
      fcs,
      reservations,
      now,
    );

    expect(sorted.map((item) => (item as any).testRef)).toEqual(['1']);
  });

  it('Should remove failed reservations after upcoming carnet', () => {
    const nonActiveCarnet = mockupCarnet(
      '1',
      new Date(now - ONE_MINUTE_MS),
      new Date(now + ONE_MINUTE_MS),
    );
    const fcs = [nonActiveCarnet];
    const reservations = [
      mockupReservation('_', new Date(now - ONE_MINUTE_MS * 2), 'REJECT'),
    ];
    const sorted = getSortedFareContractsAndReservations(
      fcs,
      reservations,
      now,
    );

    expect(sorted.map((item) => (item as any).testRef)).toEqual(['1']);
  });

  it('Should show single failed reservation', () => {
    const reservations = [
      mockupReservation('1', new Date(now - ONE_MINUTE_MS * 2), 'REJECT'),
    ];
    const sorted = getSortedFareContractsAndReservations([], reservations, now);
    expect(sorted.map((item) => (item as any).testRef)).toEqual(['1']);
  });
});

describe('Sort by creation', () => {
  it('sortFcOrReservationByCreation sorts by created', () => {
    const fcAndReservations = [
      mockupReservation('1', new Date(-10), 'INITIATE'),
      mockupFareContract('3', new Date(-30)),
      mockupFareContract('2', new Date(-20)),
      mockupReservation('5', new Date(-50), 'INITIATE'),
      mockupFareContract('4', new Date(-40)),
    ];
    const sorted = sortFcOrReservationByCreation(fcAndReservations);

    expect(sorted.map((item) => (item as any).testRef)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });
});
