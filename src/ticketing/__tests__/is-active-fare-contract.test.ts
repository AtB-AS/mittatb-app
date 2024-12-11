import {
  type CarnetTravelRightUsedAccess,
  type FareContract,
  FareContractState,
  type TravelRight,
} from '../types';
import {isActiveFareContract} from '../is-active-fare-contract';
import {addMinutes} from 'date-fns';

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
 * - Not carned (no used accesses)
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

describe('isActiveFareContract', () => {
  it('should return true if activated and the travel right is currently valid', () => {
    const isActive = isActiveFareContract(
      createFareContract(),
      new Date().getTime(),
    );
    expect(isActive).toEqual(true);
  });

  it('should return true if activated and the travel will be valid in future', () => {
    const isActive = isActiveFareContract(
      createFareContract({
        travelRights: [
          createTravelRight({startTime: addMinutes(new Date(), 30)}),
        ],
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(true);
  });

  it('should return false if state other than activated and not activated', () => {
    let isActive = isActiveFareContract(
      createFareContract({
        state: FareContractState.Cancelled,
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(false);

    isActive = isActiveFareContract(
      createFareContract({
        state: FareContractState.Refunded,
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(false);

    isActive = isActiveFareContract(
      createFareContract({
        state: FareContractState.Unspecified,
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(false);
  });

  it('should return true if multiple travel rights and one of them are valid in the future', () => {
    const isActive = isActiveFareContract(
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
          createTravelRight({startTime: addMinutes(new Date(), 30)}),
        ],
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(true);
  });

  it('should return false if travel right was valid in the past', () => {
    const isActive = isActiveFareContract(
      createFareContract({
        travelRights: [
          createTravelRight({endTime: addMinutes(new Date(), -15)}),
        ],
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(false);
  });

  it('should return false if travel right was valid in the past', () => {
    const isActive = isActiveFareContract(
      createFareContract({
        travelRights: [
          createTravelRight({endTime: addMinutes(new Date(), -15)}),
        ],
      }),
      new Date().getTime(),
    );
    expect(isActive).toEqual(false);
  });

  it('should return true if has used all accesses and one is currently valid', () => {
    const isActive = isActiveFareContract(
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
    expect(isActive).toEqual(true);
  });

  it('should return true if no accesses used', () => {
    const isActive = isActiveFareContract(
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
    expect(isActive).toEqual(true);
  });

  it('should return true if any remaining unused accesses', () => {
    const isActive = isActiveFareContract(
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
    expect(isActive).toEqual(true);
  });

  it('should return false if all accesses are either used or expired', () => {
    const isActive = isActiveFareContract(
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
    expect(isActive).toEqual(false);
  });

  it('should return false if travel right is expired even if unused accesses', () => {
    const isActive = isActiveFareContract(
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
    expect(isActive).toEqual(false);
  });

  it('should return true if travel right is expired but there is an currently valid access', () => {
    const isActive = isActiveFareContract(
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
    expect(isActive).toEqual(true);
  });
});
