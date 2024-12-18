import {
  type CarnetTravelRightUsedAccess,
  type FareContract,
  FareContractState,
  type TravelRight,
} from '../types';
import {addMinutes} from 'date-fns';
import {getAvailabilityStatus} from '@atb/ticketing/get-availability-status';

/**
 * Create a mock fare contract. The defaults are:
 * - State activated
 * - One travel right currently valid
 * - Not carnet (no used accesses)
 */
const createFareContract = (args?: {
  state?: FareContractState;
  travelRights?: TravelRight[];
}): FareContract => {
  return {
    state: args?.state === undefined ? FareContractState.Activated : args.state,
    travelRights: args?.travelRights ?? [createTravelRight()],
  } as FareContract;
};

/**
 * Create a mock travel right. The default are:
 * - Currently valid.
 * - Not carnet (no used accesses)
 * - If any accesses provided, then the maximumNumberOfAccesses is 3
 */
const createTravelRight = (
  args?: {
    startTime?: Date;
    endTime?: Date;
  } & (
    | {}
    | {
        usedAccesses: CarnetTravelRightUsedAccess[];
        maximumNumberOfAccesses: number;
      }
  ),
): TravelRight => {
  const travelRight: any = {
    startDateTime: args?.startTime ?? addMinutes(new Date(), -60),
    endDateTime: args?.endTime ?? addMinutes(new Date(), 60),
  };
  if (args && 'usedAccesses' in args) {
    travelRight.maximumNumberOfAccesses = args.maximumNumberOfAccesses;
    travelRight.numberOfUsedAccesses = args.usedAccesses.length;
    travelRight.usedAccesses = args.usedAccesses;
  }
  return travelRight as TravelRight;
};

/**
 * Create a mock used access which is currently valid.
 */
const createUsedAccess = (args?: {
  startTime?: Date;
  endTime?: Date;
}): CarnetTravelRightUsedAccess => {
  return {
    startDateTime: args?.startTime ?? addMinutes(new Date(), -60),
    endDateTime: args?.endTime ?? addMinutes(new Date(), 60),
  };
};

describe('getAvailabilityStatus', () => {
  it(`should return 'historic/refunded' if fare contract state is refunded`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({state: FareContractState.Refunded}),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('historic');
    expect(availabilityStatus.status).toEqual('refunded');
  });

  it(`should return 'historic/cancelled' if fare contract state is cancelled`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({state: FareContractState.Cancelled}),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('historic');
    expect(availabilityStatus.status).toEqual('cancelled');
  });

  it(`should return 'invalid/unspecified' if fare contract state is unspecified`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({state: FareContractState.Unspecified}),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('invalid');
    expect(availabilityStatus.status).toEqual('unspecified');
  });

  it(`should return 'invalid/invalid' if travel right is not according to spec`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({travelRights: [{} as TravelRight]}),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('invalid');
    expect(availabilityStatus.status).toEqual('invalid');
  });

  it(`should return 'historic/expired' if all travel rights are expired`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            startTime: addMinutes(new Date(), -120),
            endTime: addMinutes(new Date(), -30),
          }),
          createTravelRight({
            startTime: addMinutes(new Date(), -240),
            endTime: addMinutes(new Date(), -150),
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('historic');
    expect(availabilityStatus.status).toEqual('expired');
  });

  it(`should return 'available/upcoming' if a travel right will be valid in the future`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            startTime: addMinutes(new Date(), -120),
            endTime: addMinutes(new Date(), -30),
          }),
          createTravelRight({
            startTime: addMinutes(new Date(), 30),
            endTime: addMinutes(new Date(), 120),
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('available');
    expect(availabilityStatus.status).toEqual('upcoming');
  });

  it(`should return 'available/valid' if a travel right is currently valid`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            startTime: addMinutes(new Date(), -180),
            endTime: addMinutes(new Date(), -90),
          }),
          createTravelRight({
            startTime: addMinutes(new Date(), 30),
            endTime: addMinutes(new Date(), 120),
          }),
          createTravelRight({
            startTime: addMinutes(new Date(), -30),
            endTime: addMinutes(new Date(), 60),
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('available');
    expect(availabilityStatus.status).toEqual('valid');
  });

  it(`should return 'available/valid' if has used all accesses and one is currently valid`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            maximumNumberOfAccesses: 3,
            usedAccesses: [
              createUsedAccess({
                startTime: addMinutes(new Date(), -240),
                endTime: addMinutes(new Date(), -120),
              }),
              createUsedAccess({endTime: addMinutes(new Date(), -15)}),
              createUsedAccess(),
            ],
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('available');
    expect(availabilityStatus.status).toEqual('valid');
  });

  it(`should return 'available/upcoming' when no accesses used`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            maximumNumberOfAccesses: 3,
            usedAccesses: [],
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('available');
    expect(availabilityStatus.status).toEqual('upcoming');
  });

  it(`should return 'available/upcoming' if any remaining unused accesses`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            maximumNumberOfAccesses: 3,
            usedAccesses: [
              createUsedAccess({endTime: addMinutes(new Date(), -15)}),
              createUsedAccess({
                startTime: addMinutes(new Date(), -240),
                endTime: addMinutes(new Date(), -120),
              }),
            ],
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('available');
    expect(availabilityStatus.status).toEqual('upcoming');
  });

  it(`should return 'historic/empty' if all accesses are expired`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            maximumNumberOfAccesses: 3,
            usedAccesses: [
              createUsedAccess({endTime: addMinutes(new Date(), -15)}),
              createUsedAccess({
                startTime: addMinutes(new Date(), -240),
                endTime: addMinutes(new Date(), -120),
              }),
              createUsedAccess({
                startTime: addMinutes(new Date(), -480),
                endTime: addMinutes(new Date(), -360),
              }),
            ],
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('historic');
    expect(availabilityStatus.status).toEqual('empty');
  });

  it(`should return 'historic/expired' if travel right is expired even if unused accesses`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            endTime: addMinutes(new Date(), -15),
            maximumNumberOfAccesses: 3,
            usedAccesses: [],
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('historic');
    expect(availabilityStatus.status).toEqual('expired');
  });

  it(`should return 'available/valid' if there is a valid access even if travel right is expired`, () => {
    const availabilityStatus = getAvailabilityStatus(
      createFareContract({
        travelRights: [
          createTravelRight({
            endTime: addMinutes(new Date(), -15),
            maximumNumberOfAccesses: 3,
            usedAccesses: [
              createUsedAccess({
                startTime: addMinutes(new Date(), -30),
                endTime: addMinutes(new Date(), 30),
              }),
            ],
          }),
        ],
      }),
      new Date().getTime(),
    );

    expect(availabilityStatus.availability).toEqual('available');
    expect(availabilityStatus.status).toEqual('valid');
  });
});
