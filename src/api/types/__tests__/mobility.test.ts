// `mobility.ts` pulls in `@atb/utils/image`, which transitively imports native
// modules that Jest can't transform. We only exercise schema parsing here, so
// stub the image schema to keep this test free of native dependencies.
jest.mock('@atb/utils/image', () => {
  const {z} = require('zod');
  return {Base64ImageSchema: z.string()};
});

import {
  ActionButtonType,
  BonusOfferSchema,
  MAX_UPLOAD_IMAGE_COUNT,
  SendDamageReportBodySchema,
  SendSupportRequestBodySchema,
  SupportType,
  VehicleComponent,
  VehicleSchema,
} from '../mobility';

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

  it('parses a benefit, handles undefined description, and ignores server-only fields', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      benefit: {
        // kind / eligibility / vehicleTypeIds / systemIds are resolved server-side
        // and stripped by the slim app schema.
        kind: 'PRICE_ADJUSTMENT',
        eligibility: 'bundling',
        title: [{language: 'en', value: 'Free unlock'}],
        illustrationName: 'TicketValid',
        vehicleTypeIds: ['vehicle-type-1'],
        systemIds: ['system-1'],
        priceAdjustments: [
          {amount: 0, adjustmentType: 'FREE_UNLOCK', description: ''},
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.benefit?.title).toEqual([
        {language: 'en', value: 'Free unlock'},
      ]);
      // an undefined description on the wire is normalized to undefined
      expect(result.data.benefit?.description).toBeUndefined();
      expect(result.data.benefit?.illustrationName).toBe('TicketValid');
      expect(result.data.benefit?.priceAdjustments[0]).toEqual({
        amount: 0,
        adjustmentType: 'FREE_UNLOCK',
      });
      expect(result.data.benefit).not.toHaveProperty('eligibility');
    }
  });

  it('parses a bonusOffer on the vehicle', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      bonusOffer: {
        bonusProductId: 'bonus-product-1',
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
      expect(
        result.data.actionButton?.type === ActionButtonType.START_TRIP &&
          result.data.actionButton.preReqs,
      ).toEqual([]);
    }
  });

  it('parses a START_TRIP action button with preReqs, including AGE_VERIFICATION minAge', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {
        type: 'START_TRIP',
        preReqs: [
          {type: 'OPENING_HOURS'},
          {type: 'IS_LOGGED_IN'},
          {type: 'TERMS_AND_CONDITIONS'},
          {type: 'AGE_VERIFICATION', minAge: 18},
          {type: 'PAYMENT_METHOD'},
          {type: 'PRECISE_LOCATION'},
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        result.data.actionButton?.type === ActionButtonType.START_TRIP &&
          result.data.actionButton.preReqs,
      ).toEqual([
        {type: 'OPENING_HOURS'},
        {type: 'IS_LOGGED_IN'},
        {type: 'TERMS_AND_CONDITIONS'},
        {type: 'AGE_VERIFICATION', minAge: 18},
        {type: 'PAYMENT_METHOD'},
        {type: 'PRECISE_LOCATION'},
      ]);
    }
  });

  it('parses an OPENING_HOURS preReq with openingTime', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {
        type: 'START_TRIP',
        preReqs: [
          {
            type: 'OPENING_HOURS',
            openingTime: '2024-01-08T05:00:00Z',
          },
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        result.data.actionButton?.type === ActionButtonType.START_TRIP &&
          result.data.actionButton.preReqs,
      ).toEqual([
        {
          type: 'OPENING_HOURS',
          openingTime: '2024-01-08T05:00:00Z',
        },
      ]);
    }
  });

  it('coerces an unrecognized preReq type into UNSUPPORTED instead of failing to parse', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {
        type: 'START_TRIP',
        preReqs: [
          {type: 'IS_LOGGED_IN'},
          {type: 'TEST'},
          {type: 'PAYMENT_METHOD'},
        ],
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        result.data.actionButton?.type === ActionButtonType.START_TRIP &&
          result.data.actionButton.preReqs,
      ).toEqual([
        {type: 'IS_LOGGED_IN'},
        {type: 'UNSUPPORTED'},
        {type: 'PAYMENT_METHOD'},
      ]);
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

  it('parses an APP_SWITCH action button missing its url', () => {
    const result = VehicleSchema.safeParse({
      ...baseVehicle,
      actionButton: {type: 'APP_SWITCH'},
    });
    expect(result.success).toBe(true);
    if (result.success && result.data.actionButton?.type === 'APP_SWITCH') {
      expect(result.data.actionButton.url).toBeUndefined();
    }
  });
});

describe('BonusOfferSchema', () => {
  it('parses a standalone bonus offer', () => {
    const result = BonusOfferSchema.safeParse({
      bonusProductId: 'bonus-product-1',
      priceAdjustments: [],
    });
    expect(result.success).toBe(true);
  });
});

describe('SendSupportRequestBodySchema files', () => {
  const baseSupportRequest = {
    assetId: 'asset-1',
    supportType: SupportType.ACCIDENT_OR_BROKEN,
    contactInformationEndUser: {email: 'someone@example.com'},
  };
  const image = {
    fileName: 'supportPhoto1.jpg',
    fileType: 'image/jpeg',
    fileData: 'dGVzdA==',
  };

  it('parses a request without any images', () => {
    const result = SendSupportRequestBodySchema.safeParse(baseSupportRequest);
    expect(result.success).toBe(true);
    expect(result.data?.files).toBeUndefined();
  });

  it('parses a request with the maximum number of images', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseSupportRequest,
      files: new Array(MAX_UPLOAD_IMAGE_COUNT).fill(image),
    });
    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(MAX_UPLOAD_IMAGE_COUNT);
  });

  it('rejects more images than the endpoint is allowed to carry', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseSupportRequest,
      files: new Array(MAX_UPLOAD_IMAGE_COUNT + 1).fill(image),
    });
    expect(result.success).toBe(false);
  });
});

describe('SendSupportRequestBodySchema damage', () => {
  const baseSupportRequest = {
    assetId: 'asset-1',
    supportType: SupportType.ACCIDENT_OR_BROKEN,
    contactInformationEndUser: {email: 'someone@example.com'},
  };

  it('parses a request without damage (backward compatible)', () => {
    const result = SendSupportRequestBodySchema.safeParse(baseSupportRequest);
    expect(result.success).toBe(true);
    expect(result.data?.damage).toBeUndefined();
  });

  it('parses damage with only the fields the endpoint requires', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseSupportRequest,
      damage: {
        vehicleComponent: VehicleComponent.TIRE,
        description: 'Punctured rear tire',
      },
    });
    expect(result.success).toBe(true);
    expect(result.data?.damage).toEqual({
      vehicleComponent: 'TIRE',
      description: 'Punctured rear tire',
    });
  });

  it('parses damage with the optional component name', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseSupportRequest,
      damage: {
        vehicleComponent: VehicleComponent.ANCILLARY,
        description: 'Missing helmet',
        vehicleComponentName: 'Helmet box',
      },
    });
    expect(result.success).toBe(true);
    expect(result.data?.damage?.vehicleComponentName).toBe('Helmet box');
  });

  it('rejects damage missing the required description', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseSupportRequest,
      damage: {vehicleComponent: VehicleComponent.FRONT},
    });
    expect(result.success).toBe(false);
  });

  it('rejects a vehicle component the endpoint does not define', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseSupportRequest,
      damage: {vehicleComponent: 'HANDLEBAR', description: 'Bent'},
    });
    expect(result.success).toBe(false);
  });
});

describe('SendDamageReportBodySchema contact information', () => {
  const baseDamageReport = {
    assetId: 'asset-1',
    supportType: SupportType.ACCIDENT_OR_BROKEN,
  };

  const parseWith = (contactInformationEndUser: object) =>
    SendDamageReportBodySchema.safeParse({
      ...baseDamageReport,
      contactInformationEndUser,
    });

  it('accepts an e-mail on its own', () => {
    expect(parseWith({email: 'someone@example.com'}).success).toBe(true);
  });

  /* The difference from the support form, which requires an e-mail outright. */
  it('accepts a phone number on its own', () => {
    expect(
      parseWith({phonePrefix: '47', phoneNumber: '91234567'}).success,
    ).toBe(true);
  });

  it('rejects an empty contact form, since the operator could not reply', () => {
    expect(parseWith({}).success).toBe(false);
  });

  it('still rejects an e-mail that is not well formed', () => {
    expect(parseWith({email: 'not-an-email'}).success).toBe(false);
  });

  it('still rejects a phone number that is not well formed', () => {
    expect(parseWith({phonePrefix: '47', phoneNumber: '1'}).success).toBe(
      false,
    );
  });

  /* The support form keeps its own rule. */
  it('is stricter on the support form, where an e-mail is mandatory', () => {
    const result = SendSupportRequestBodySchema.safeParse({
      ...baseDamageReport,
      contactInformationEndUser: {phonePrefix: '47', phoneNumber: '91234567'},
    });
    expect(result.success).toBe(false);
  });
});
