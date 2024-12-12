import {
  type CarnetTravelRightUsedAccess,
  type FareContract,
  FareContractState,
  type TravelRight,
} from '../types';
import {addMinutes} from 'date-fns';
import {isValidFareContract} from '../is-valid-fare-contract';

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

describe('isValidFareContract', () => {
  it('should return true if one of the travel rights is currently valid', () => {
    const isValid = isValidFareContract(
      createFareContract(),
      new Date().getTime(),
    );
    expect(isValid).toEqual(true);
  });

  it('should return false if travel right will be valid in future', () => {
    const isValid = isValidFareContract(
      createFareContract({
        travelRights: [
          createTravelRight({startTime: addMinutes(new Date(), 30)}),
        ],
      }),
      new Date().getTime(),
    );
    expect(isValid).toEqual(false);
  });

  it('should return false if state other than activated and not activated', () => {
    let isValid = isValidFareContract(
      createFareContract({
        state: FareContractState.Cancelled,
      }),
      new Date().getTime(),
    );
    expect(isValid).toEqual(false);

    isValid = isValidFareContract(
      createFareContract({
        state: FareContractState.Refunded,
      }),
      new Date().getTime(),
    );
    expect(isValid).toEqual(false);

    isValid = isValidFareContract(
      createFareContract({
        state: FareContractState.Unspecified,
      }),
      new Date().getTime(),
    );
    expect(isValid).toEqual(false);
  });

  it('should return false if travel right is expired', () => {
    const isValid = isValidFareContract(
      createFareContract({
        travelRights: [
          createTravelRight({endTime: addMinutes(new Date(), -15)}),
        ],
      }),
      new Date().getTime(),
    );
    expect(isValid).toEqual(false);
  });

  it('should return false if travel right will be valid in the future', () => {
    const isValid = isValidFareContract(
      createFareContract({
        travelRights: [
          createTravelRight({
            startTime: addMinutes(new Date(), 30),
            endTime: addMinutes(new Date(), 120),
          }),
        ],
      }),
      new Date().getTime(),
    );
    expect(isValid).toEqual(false);
  });

  it('should return false if multiple travel rights but they are only expired or valid in future', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(false);
  });

  it('should return true if has used all accesses and one is currently valid', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(true);
  });

  it('should return false if no accesses used', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(false);
  });

  it('should return false if some expired accesses and some unused accesses', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(false);
  });

  it('should return false if has used all accesses are used and expired', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(false);
  });

  it('should return false if travel right is expired even if unused accesses', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(false);
  });

  it('should return true if there is a currently valid access even if travel right is expired', () => {
    const isValid = isValidFareContract(
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
    expect(isValid).toEqual(true);
  });
});
