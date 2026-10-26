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
  formatRange,
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
  adjustmentType: 'FREE_MINUTES',
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

  it('applies no limit of its own beyond the budget when the last segment is open-ended', () => {
    const perMinPricing = [segment({interval: 1, rate: 1})];
    expect(
      computeFreeMinuteCount(freeMinutesAdjustment(-300), perMinPricing),
    ).toBe(300);
  });

  // Operators start the first segment at minute 1 — the first whole minute is
  // the first billable tick — so summing segment lengths lands a minute short
  // of where the table ends.
  describe('with a first segment starting at minute 1', () => {
    // The real Trondheim Bysykkel ebike plan.
    const ebike = [
      segment({start: 1, end: 20, interval: 1, rate: 2}),
      segment({start: 20, end: 180, interval: 1, rate: 1.5}),
    ];

    it('reaches the end of the last segment once the budget covers them all', () => {
      // A full 180-minute ride costs 19 * 2 + 160 * 1.5 = 278.
      expect(computeFreeMinuteCount(freeMinutesAdjustment(-278), ebike)).toBe(
        180,
      );
    });

    it('does not exceed the table when given more than it costs', () => {
      expect(computeFreeMinuteCount(freeMinutesAdjustment(-300), ebike)).toBe(
        180,
      );
    });

    it('still stops mid-table when the budget runs out', () => {
      // 38 buys the first segment, the remaining 17 buys 11 more at 1.5.
      expect(computeFreeMinuteCount(freeMinutesAdjustment(-55), ebike)).toBe(
        30,
      );
    });

    it('leaves an open-ended last segment budget-bound', () => {
      // Ryde/Voi: one segment, no end, so there is no table end to reach.
      const ryde = [segment({start: 1, interval: 1, rate: 2.5})];
      expect(computeFreeMinuteCount(freeMinutesAdjustment(-25), ryde)).toBe(10);
    });
  });

  // The offset start is a property of the plan, not an assumption of the
  // calculation: an operator numbering from 0 charges for every minute it
  // describes, and the window must not gain one it already covers.
  describe('with a first segment starting at minute 0', () => {
    const zeroBased = [
      segment({start: 0, end: 20, interval: 1, rate: 2}),
      segment({start: 20, end: 180, interval: 1, rate: 1.5}),
    ];

    it('reaches the end of the table without over-counting', () => {
      // Every described minute is charged: 20 * 2 + 160 * 1.5 = 280.
      expect(
        computeFreeMinuteCount(freeMinutesAdjustment(-280), zeroBased),
      ).toBe(180);
    });

    it('stays budget-bound one minute short of covering the table', () => {
      expect(
        computeFreeMinuteCount(freeMinutesAdjustment(-279), zeroBased),
      ).toBe(179);
    });

    it('treats minutes no segment charges for as free', () => {
      // A plan that only starts charging at minute 5 leaves 0-5 uncharged, so
      // covering the table buys the whole 45 minutes.
      const offset = [segment({start: 5, end: 45, interval: 1, rate: 2})];
      expect(computeFreeMinuteCount(freeMinutesAdjustment(-80), offset)).toBe(
        45,
      );
    });
  });
});

describe('formatRange', () => {
  it('formats a range in meters as whole km above 5000m', () => {
    expect(formatRange(12000, Language.Norwegian)).toBe('12 km');
  });

  it('formats a range in meters with one decimal below 5000m', () => {
    expect(formatRange(2500, Language.Norwegian)).toBe('2,5 km');
  });

  it('shows a dash when the range is unknown rather than claiming 0 km', () => {
    expect(formatRange(null, Language.Norwegian)).toBe('–');
    expect(formatRange(undefined, Language.Norwegian)).toBe('–');
  });
});
