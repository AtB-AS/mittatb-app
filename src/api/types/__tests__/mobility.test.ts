// `mobility.ts` pulls in `@atb/utils/image`, which transitively imports native
// modules that Jest can't transform. We only exercise schema parsing here, so
// stub the image schema to keep this test free of native dependencies.
jest.mock('@atb/utils/image', () => {
  const {z} = require('zod');
  return {Base64ImageSchema: z.string()};
});

import {ActionButtonType, BonusOfferSchema, VehicleSchema} from '../mobility';

const baseVehicle = {
  id: 'vehicle-1',
  lat: 63.43,
  lon: 10.39,
  currentRangeMeters: 12000,
  isReserved: false,
  isDisabled: false,
  pricingPlan: {currency: 'NOK', price: 10},
  system: {
    id: 'system-1',
    operator: {id: 'operator-1', name: {}},
    name: {},
  },
  vehicleType: {
    id: 'vehicle-type-1',
    formFactor: 'SCOOTER',
    propulsionType: 'ELECTRIC',
    name: {},
  },
};

describe('VehicleSchema (shmo vehicle contract v2)', () => {
  it('parses a vehicle that omits the new v2 fields (backward compatible)', () => {
    const result = VehicleSchema.safeParse(baseVehicle);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.benefit).toBeUndefined();
      expect(result.data.bonusOffer).toBeUndefined();
      expect(result.data.actionButton).toBeUndefined();
    }
  });

  it('parses a benefit with the new v2 fields and defaults title/description', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      benefit: {
        kind: 'MOBILITY_PRICE_ADJUSTMENT',
        source: 'mobility-benefit',
        title: [{language: 'en', value: 'Free unlock'}],
        illustration: 'TicketValid',
        vehicleTypeIds: ['vehicle-type-1'],
        systemIds: ['system-1'],
        priceAdjustments: [
          {amount: 0, adjustmentType: 'FREE_UNLOCK', description: ''},
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.benefit?.source).toBe('mobility-benefit');
      expect(result.data.benefit?.title).toEqual([
        {language: 'en', value: 'Free unlock'},
      ]);
      // description is optional on the wire and defaults to an empty array
      expect(result.data.benefit?.description).toEqual([]);
      expect(result.data.benefit?.illustration).toBe('TicketValid');
    }
  });

  it('parses a bonusOffer on the vehicle', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      bonusOffer: {
        bonusProductId: 'bonus-product-1',
        bonusProductPrice: {amount: 50, currencyCode: 'NOK'},
        priceAdjustments: [
          {
            amount: 0,
            adjustmentType: 'FREE_UNLOCK',
            description: '',
            systemIds: ['system-1'],
          },
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bonusOffer?.bonusProductId).toBe('bonus-product-1');
      expect(result.data.bonusOffer?.bonusProductPrice.currencyCode).toBe(
        'NOK',
      );
    }
  });

  it('parses a START_TRIP action button', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {type: 'START_TRIP'},
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.actionButton?.type).toBe(ActionButtonType.START_TRIP);
    }
  });

  it('parses an APP_SWITCH action button with url and label', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {
        type: 'APP_SWITCH',
        url: 'operator://deeplink',
        label: [{language: 'en', value: 'Open in operator app'}],
      },
    });
    expect(result.success).toBe(true);
    if (result.success && result.data.actionButton?.type === 'APP_SWITCH') {
      expect(result.data.actionButton.url).toBe('operator://deeplink');
      expect(result.data.actionButton.label).toEqual([
        {language: 'en', value: 'Open in operator app'},
      ]);
    }
  });

  it('rejects an APP_SWITCH action button missing its url', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {type: 'APP_SWITCH'},
    });
    expect(result.success).toBe(false);
  });
});

describe('BonusOfferSchema', () => {
  it('parses a standalone bonus offer', () => {
    const result = BonusOfferSchema.safeParse({
      bonusProductId: 'bonus-product-1',
      bonusProductPrice: {amount: 50, currencyCode: 'NOK'},
      priceAdjustments: [],
    });
    expect(result.success).toBe(true);
  });
});
