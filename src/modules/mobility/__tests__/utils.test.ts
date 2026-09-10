// `utils.ts` transitively pulls in native-module-dependent code (RN image
// libs via `@atb/api/types/mobility`, and theme/native-bridges via
// `@atb/theme/ThemedAssets` and `@atb/modules/map`) that Jest can't run.
// The functions tested here don't touch any of that, so stub it out.
jest.mock('@atb/utils/image', () => {
  const {z} = require('zod');
  return {Base64ImageSchema: z.string()};
});
jest.mock('@atb/modules/map', () => ({
  getVisibleRange: jest.fn(),
  toFeaturePoint: jest.fn(),
}));
jest.mock('@atb/theme/ThemedAssets', () => ({
  ThemedElectricCityBike: {},
  ThemedScooter: {},
}));

import {Language, TranslateFunction} from '@atb/translations';
import type {PriceAdjustmentType} from '@atb/api/types/benefit';
import type {
  ShmoPricingPlan,
  ShmoPricingSegment,
} from '@atb/api/types/mobility';
import {
  computeFreeMinuteCount,
  formatMinuteBoundaryWithUnit,
  formatMinuteRange,
  formatRatePerUnit,
  hasMultiplePricingPlans,
} from '../utils';

const t: TranslateFunction = (arg) => arg[Language.Norwegian];

const segment = (
  overrides: Partial<ShmoPricingSegment>,
): ShmoPricingSegment => ({
  start: 0,
  end: null,
  interval: 1,
  rate: 0,
  ...overrides,
});

const freeMinutesAdjustment = (amount: number): PriceAdjustmentType => ({
  amount,
  type: 'FREE_MINUTES',
  description: '',
});

describe('formatRatePerUnit', () => {
  it('formats a per-minute rate from the first perMinPricing segment', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 8,
      perMinPricing: [
        segment({interval: 1, rate: 1}),
        segment({start: 20, interval: 1, rate: 2}),
      ],
    };
    expect(formatRatePerUnit(plan, Language.Norwegian)).toEqual({
      rate: 1,
      formattedRate: '1 kr',
      perUnit: 'min',
      interval: 1,
    });
  });

  it('falls back to perKmPricing when there is no perMinPricing', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 0,
      perKmPricing: [segment({interval: 1, rate: 3})],
    };
    expect(formatRatePerUnit(plan, Language.Norwegian)).toEqual({
      rate: 3,
      formattedRate: '3 kr',
      perUnit: 'km',
      interval: 1,
    });
  });

  it('prefers perMinPricing over perKmPricing when both are present', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 0,
      perMinPricing: [segment({interval: 1, rate: 1})],
      perKmPricing: [segment({interval: 1, rate: 3})],
    };
    expect(formatRatePerUnit(plan, Language.Norwegian)?.perUnit).toBe('min');
  });

  it('returns undefined when neither pricing array is present', () => {
    const plan: ShmoPricingPlan = {currency: 'NOK', price: 8};
    expect(formatRatePerUnit(plan, Language.Norwegian)).toBeUndefined();
  });

  it('formats a decimal rate with the currency symbol and language locale', () => {
    const plan: ShmoPricingPlan = {
      currency: 'GBP',
      price: 0,
      perKmPricing: [segment({interval: 1, rate: 2.5})],
    };
    expect(formatRatePerUnit(plan, Language.Norwegian)?.formattedRate).toBe(
      '2,50 £',
    );
    expect(formatRatePerUnit(plan, Language.English)?.formattedRate).toBe(
      '2.50 £',
    );
  });
});

describe('hasMultiplePricingPlans', () => {
  it('is falsy for a single perMinPricing segment and no perKmPricing', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 0,
      perMinPricing: [segment({})],
    };
    expect(hasMultiplePricingPlans(plan)).toBeFalsy();
  });

  it('is truthy when both perMinPricing and perKmPricing are present', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 0,
      perMinPricing: [segment({})],
      perKmPricing: [segment({})],
    };
    expect(hasMultiplePricingPlans(plan)).toBeTruthy();
  });

  it('is truthy when perMinPricing has more than one segment', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 0,
      perMinPricing: [segment({end: 10}), segment({start: 10})],
    };
    expect(hasMultiplePricingPlans(plan)).toBeTruthy();
  });

  it('is truthy when perKmPricing has more than one segment', () => {
    const plan: ShmoPricingPlan = {
      currency: 'NOK',
      price: 0,
      perKmPricing: [segment({end: 5}), segment({start: 5})],
    };
    expect(hasMultiplePricingPlans(plan)).toBeTruthy();
  });
});

describe('formatMinuteBoundaryWithUnit', () => {
  it('adds the unit for minutes under an hour', () => {
    expect(formatMinuteBoundaryWithUnit(12, t)).toBe('12 min');
  });

  it('formats exactly one hour without a minutes remainder', () => {
    expect(formatMinuteBoundaryWithUnit(60, t)).toBe('1 time');
  });

  it('formats an hour-and-minutes boundary', () => {
    expect(formatMinuteBoundaryWithUnit(90, t)).toBe('1 time 30 min');
  });

  it('formats multiple hours with a minutes remainder', () => {
    expect(formatMinuteBoundaryWithUnit(125, t)).toBe('2 timer 5 min');
  });
});

describe('formatMinuteRange', () => {
  it('shows the unit once when both boundaries are under an hour', () => {
    expect(formatMinuteRange(0, 45, t)).toBe('0-45 min');
  });

  it('shows the unit once when both boundaries are whole hours', () => {
    expect(formatMinuteRange(60, 300, t)).toBe('1-5 timer');
  });

  it('spells out both boundaries when they cross the hour threshold', () => {
    expect(formatMinuteRange(30, 60, t)).toBe('30 min-1 time');
  });

  it('spells out both boundaries when the end has a minutes remainder', () => {
    expect(formatMinuteRange(45, 95, t)).toBe('45 min-1 time 35 min');
  });

  it('spells out both boundaries when neither is a whole hour', () => {
    expect(formatMinuteRange(90, 150, t)).toBe('1 time 30 min-2 timer 30 min');
  });
});

describe('computeFreeMinuteCount', () => {
  it('converts a budget into minutes for a plain per-minute segment', () => {
    const perMinPricing = [segment({interval: 1, rate: 1})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-50), perMinPricing),
    ).toBe(50);
  });

  it('rounds down to whole intervals for a non-1-minute interval', () => {
    // budget 12, rate 5 per 30-min interval -> only 2 intervals (10 kr) fit
    const perMinPricing = [segment({interval: 30, rate: 5})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-12), perMinPricing),
    ).toBe(60);
  });

  it('treats interval 0 as a one-time fee covering the whole segment', () => {
    const perMinPricing = [segment({end: 10, interval: 0, rate: 8})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-10), perMinPricing),
    ).toBe(10);
  });

  it('skips a one-time-fee segment entirely when the budget is too small', () => {
    const perMinPricing = [segment({end: 10, interval: 0, rate: 8})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-5), perMinPricing),
    ).toBe(0);
  });

  it('treats a zero-or-negative rate segment as fully free', () => {
    const perMinPricing = [segment({end: 20, interval: 1, rate: 0})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-1), perMinPricing),
    ).toBe(20);
  });

  it('spends the remaining budget on a later segment once the first is exhausted', () => {
    const perMinPricing = [
      segment({end: 10, interval: 1, rate: 2}),
      segment({start: 10, interval: 1, rate: 5}),
    ];
    // First 10 min cost 20, leaving 5 -> 1 more minute at 5/min = 11 total.
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-25), perMinPricing),
    ).toBe(11);
  });

  it('caps the result at 180 minutes', () => {
    const perMinPricing = [segment({interval: 1, rate: 1})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-300), perMinPricing),
    ).toBe(180);
  });
});
