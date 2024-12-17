import {carnetFareContract} from './fixtures/carnet-farecontact';
import {periodBoatFareContract} from './fixtures/period-boat-farecontract';
import {singleFareContract} from './fixtures/single-farecontract';

import {isCarnet} from '../utils';

describe('Fare contract', () => {
  it('carnet is carnet', () => {
    expect(isCarnet(carnetFareContract)).toBe(true);
  });

  it('non-carnets are not carnet', () => {
    expect(isCarnet(singleFareContract)).toBe(false);
    expect(isCarnet(periodBoatFareContract)).toBe(false);
  });
});
