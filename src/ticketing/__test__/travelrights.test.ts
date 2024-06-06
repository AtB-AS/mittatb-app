import {carnet} from './fixtures/carnet-travelright';
import {night} from './fixtures/night-travelright';
import {period} from './fixtures/period-travelright';
import {periodBoat} from './fixtures/period-boat-travelright';
import {single} from './fixtures/single-travelright';
import {singleBoat} from './fixtures/single-boat-travelright';
import {youth} from './fixtures/youth-travelright';

import {CarnetTravelRight, TravelRight} from '../types';
import {
  hasActiveTravelRight,
  isCarnetTravelRight,
  isNormalTravelRight,
} from '../utils';

const now = Date.now();

describe('Travelright type', () => {
  it('all should resolve to normal', async () => {
    expect(isNormalTravelRight(night)).toBe(true);
    expect(isNormalTravelRight(period)).toBe(true);
    expect(isNormalTravelRight(periodBoat as TravelRight)).toBe(true);
    expect(isNormalTravelRight(single)).toBe(true);
    expect(isNormalTravelRight(singleBoat as TravelRight)).toBe(true);
    expect(isNormalTravelRight(youth)).toBe(true);
    expect(isNormalTravelRight(carnet)).toBe(true);
  });

  it('non carnets should not resolve to carnet', async () => {
    expect(isCarnetTravelRight(night)).toBe(false);
    expect(isCarnetTravelRight(period)).toBe(false);
    expect(isCarnetTravelRight(periodBoat as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(single)).toBe(false);
    expect(isCarnetTravelRight(singleBoat as TravelRight)).toBe(false);
    expect(isCarnetTravelRight(youth)).toBe(false);
  });

  it('carnet should resolve to carnet', async () => {
    expect(isCarnetTravelRight(carnet)).toBe(true);
  });
});

describe('Carnet travel rights', () => {
  it('is active', async () => {
    expect(hasActiveTravelRight([carnet], now)).toBe(true);
  });

  it('is not active due to no active access', async () => {
    const noActiveAccessCarnet: CarnetTravelRight = {
      ...carnet,
      usedAccesses: [
        {
          startDateTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          endDateTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
      ],
    };
    expect(hasActiveTravelRight([noActiveAccessCarnet], now)).toBe(false);
  });

  it('is not active due to no accesses', async () => {
    const noAccessesCarnet: CarnetTravelRight = {
      ...carnet,
      usedAccesses: [],
    };
    expect(hasActiveTravelRight([noAccessesCarnet], now)).toBe(false);
  });

  it('is not active due to expired travel right', async () => {
    const expiredCarnet: CarnetTravelRight = {
      ...carnet,
      endDateTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    };
    expect(hasActiveTravelRight([expiredCarnet], now)).toBe(false);
  });
});
