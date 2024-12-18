import {carnetTravelRight} from './fixtures/carnet-travelright';
import {nightTravelRight} from './fixtures/night-travelright';
import {periodTravelRight} from './fixtures/period-travelright';
import {periodBoatTravelRight} from './fixtures/period-boat-travelright';
import {singleTravelRight} from './fixtures/single-travelright';
import {singleBoatTravelRight} from './fixtures/single-boat-travelright';
import {youthTravelRight} from './fixtures/youth-travelright';
import {skoleskyssTravelRight} from './fixtures/skoleskyss-travelright';

import {CarnetTravelRight, TravelRight} from '../types';
import {
  hasValidRightNowTravelRight,
  isCarnetTravelRight,
  isNormalTravelRight,
} from '../utils';

const now = Date.now();

describe('Travelright type', () => {
  it('all should resolve to normal', async () => {
    expect(isNormalTravelRight(nightTravelRight)).toBe(true);
    expect(isNormalTravelRight(periodTravelRight)).toBe(true);
    expect(isNormalTravelRight(periodBoatTravelRight as TravelRight)).toBe(
      true,
    );
    expect(isNormalTravelRight(singleTravelRight)).toBe(true);
    expect(isNormalTravelRight(singleBoatTravelRight as TravelRight)).toBe(
      true,
    );
    expect(isNormalTravelRight(youthTravelRight)).toBe(true);
    expect(isNormalTravelRight(carnetTravelRight)).toBe(true);
  });

  it('non carnets should not resolve to carnet', async () => {
    expect(isCarnetTravelRight(nightTravelRight)).toBe(false);
    expect(isCarnetTravelRight(periodTravelRight)).toBe(false);
    expect(isCarnetTravelRight(periodBoatTravelRight as TravelRight)).toBe(
      false,
    );
    expect(isCarnetTravelRight(singleTravelRight)).toBe(false);
    expect(isCarnetTravelRight(singleBoatTravelRight as TravelRight)).toBe(
      false,
    );
    expect(isCarnetTravelRight(youthTravelRight)).toBe(false);
  });

  it('carnet should resolve to carnet', async () => {
    expect(isCarnetTravelRight(carnetTravelRight)).toBe(true);
  });

  it('skoleskyss should not resolve to normal', async () => {
    expect(isNormalTravelRight(skoleskyssTravelRight)).toBe(false);
  });
});

describe('Carnet travel rights', () => {
  it('is active', async () => {
    expect(hasValidRightNowTravelRight([carnetTravelRight], now)).toBe(true);
  });

  it('is not active due to no active access', async () => {
    const noActiveAccessCarnet: CarnetTravelRight = {
      ...carnetTravelRight,
      usedAccesses: [
        {
          startDateTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          endDateTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
      ],
    };
    expect(hasValidRightNowTravelRight([noActiveAccessCarnet], now)).toBe(
      false,
    );
  });

  it('is not active due to no accesses', async () => {
    const noAccessesCarnet: CarnetTravelRight = {
      ...carnetTravelRight,
      usedAccesses: [],
    };
    expect(hasValidRightNowTravelRight([noAccessesCarnet], now)).toBe(false);
  });

  it('is not active due to expired travel right', async () => {
    const expiredCarnet: CarnetTravelRight = {
      ...carnetTravelRight,
      endDateTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    };
    expect(hasValidRightNowTravelRight([expiredCarnet], now)).toBe(false);
  });
});
