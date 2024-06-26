import {carnetFareContract} from './fixtures/carnet-farecontact';
import {periodBoatFareContract} from './fixtures/period-boat-farecontract';
import {singleFareContract} from './fixtures/single-farecontract';

import {isValidRightNowOrCanBeUsedFareContract, isCarnet} from '../utils';
import {FareContractState, NormalTravelRight} from '../types';

const now = Date.now();

describe('Fare contract', () => {
  it('carnet is carnet', () => {
    expect(isCarnet(carnetFareContract)).toBe(true);
  });

  it('non-carnets are not carnet', () => {
    expect(isCarnet(singleFareContract)).toBe(false);
    expect(isCarnet(periodBoatFareContract)).toBe(false);
  });
});

describe('isActiveNowOrCanBeUsedFareContract', () => {
  it('is true when valid', () => {
    expect(
      isValidRightNowOrCanBeUsedFareContract(carnetFareContract, now),
    ).toBe(true);
    expect(
      isValidRightNowOrCanBeUsedFareContract(periodBoatFareContract, now),
    ).toBe(true);
    expect(
      isValidRightNowOrCanBeUsedFareContract(singleFareContract, now),
    ).toBe(true);
  });

  it('is true when not activated', () => {
    expect(
      isValidRightNowOrCanBeUsedFareContract(
        {
          ...singleFareContract,
          state: FareContractState.NotActivated,
        },
        now,
      ),
    ).toBe(true);
  });

  it('is true when valid in the future', () => {
    expect(
      isValidRightNowOrCanBeUsedFareContract(
        {
          ...singleFareContract,
          travelRights: [
            {
              ...singleFareContract.travelRights[0],
              startDateTime: new Date(now + 1000 * 60 * 60), // 1 hour in the future
              endDateTime: new Date(now + 1000 * 60 * 60 * 2), // 2 hours in the future
            } as NormalTravelRight,
          ],
        },
        now,
      ),
    ).toBe(true);
  });

  it('is false when refunded', () => {
    expect(
      isValidRightNowOrCanBeUsedFareContract(
        {
          ...singleFareContract,
          state: FareContractState.Refunded,
        },
        now,
      ),
    ).toBe(false);
  });

  it('is false when cancelled', () => {
    expect(
      isValidRightNowOrCanBeUsedFareContract(
        {
          ...singleFareContract,
          state: FareContractState.Cancelled,
        },
        now,
      ),
    ).toBe(false);
  });
});
