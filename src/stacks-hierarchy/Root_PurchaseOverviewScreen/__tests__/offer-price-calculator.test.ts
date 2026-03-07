import {TicketOffer, OfferValidity} from '@atb-as/utils';
import {
  BaggageProductWithCountAndOffer,
  SupplementTicketOffer,
  UserProfileWithCountAndOffer,
} from '../use-offer-state';
import {BaggageProduct, UserProfile} from '@atb-as/config-specs';
import {
  calculateOriginalPrice,
  calculateTotalPrice,
  getCheapestOffer,
} from '../offer-price-calculator';

describe('offer-price-calculator', () => {
  it('calculateTotalPrice with adult + bicycle should be 67', () => {
    const totalPrice = calculateTotalPrice(
      [TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [TEST_BICYCLE_WITH_COUNT_AND_OFFER],
    );

    expect(totalPrice).toBe(67);
  });

  it('calculateTotalPrice with no user profiles and one bicycle should be 22', () => {
    const totalPrice = calculateTotalPrice(
      [],
      [TEST_BICYCLE_WITH_COUNT_AND_OFFER],
    );

    expect(totalPrice).toBe(22);
  });

  it('calculateTotalPrice with one adult user profile and no baggage products should be 45', () => {
    const totalPrice = calculateTotalPrice(
      [TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [],
    );

    expect(totalPrice).toBe(45);
  });

  it('calculateTotalPrice with no user profiles and no baggage products should be 0', () => {
    const totalPrice = calculateTotalPrice([], []);

    expect(totalPrice).toBe(0);
  });

  it('calculateTotalPrice with 2x adults and 2x bicycles should be 134', () => {
    const totalPrice = calculateTotalPrice(
      [
        TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER,
        TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER,
      ],
      [TEST_BICYCLE_WITH_COUNT_AND_OFFER, TEST_BICYCLE_WITH_COUNT_AND_OFFER],
    );

    expect(totalPrice).toBe(134);
  });

  it('calculateOriginalPrice with adult + bicycle should be 67', () => {
    const originalPrice = calculateOriginalPrice(
      [TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [TEST_BICYCLE_WITH_COUNT_AND_OFFER],
    );

    expect(originalPrice).toBe(67);
  });

  it('calculateOriginalPrice with no user profiles and one bicycle should be 22', () => {
    const originalPrice = calculateOriginalPrice(
      [],
      [TEST_BICYCLE_WITH_COUNT_AND_OFFER],
    );

    expect(originalPrice).toBe(22);
  });

  it('calculateOriginalPrice with one adult user profile and no baggage products should be 45', () => {
    const originalPrice = calculateOriginalPrice(
      [TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [],
    );

    expect(originalPrice).toBe(45);
  });

  it('calculateOriginalPrice with no user profiles and no baggage products should be 0', () => {
    const originalPrice = calculateOriginalPrice([], []);

    expect(originalPrice).toBe(0);
  });

  it('calculateOriginalPrice with 2x adults and 2x bicycles should be 134', () => {
    const originalPrice = calculateOriginalPrice(
      [
        TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER,
        TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER,
      ],
      [TEST_BICYCLE_WITH_COUNT_AND_OFFER, TEST_BICYCLE_WITH_COUNT_AND_OFFER],
    );

    expect(originalPrice).toBe(134);
  });

  it('calculateTotalPrice and calculateOriginalPrice should differ when there is a discount', () => {
    const testUserProfileWithCountAndOffer = {
      ...TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER,
      offer: {
        ...TEST_ADULT_SINGLE_TICKET_OFFER,
        price: {
          amount: '80',
          amountFloat: 80,
          currency: 'NOK',
          originalAmount: '100',
          originalAmountFloat: 100,
          vatGroup: 'A',
        },
      },
    };

    const totalPrice = calculateTotalPrice(
      [testUserProfileWithCountAndOffer],
      [],
    );

    const originalPrice = calculateOriginalPrice(
      [testUserProfileWithCountAndOffer],
      [],
    );

    expect(totalPrice).toBe(80);
    expect(originalPrice).toBe(100);
  });

  it('getCheapestOffer with ticket offers should return the cheapest offer', () => {
    const cheapestOffer = getCheapestOffer(
      [
        TEST_ADULT_SINGLE_TICKET_OFFER,
        {
          ...TEST_ADULT_SINGLE_TICKET_OFFER,
          price: {
            amount: '200',
            amountFloat: 200,
            currency: 'NOK',
            originalAmount: '200',
            originalAmountFloat: 200,
            vatGroup: 'A',
          },
        },
      ],
      (o) => o.price,
    );

    expect(cheapestOffer).toBe(TEST_ADULT_SINGLE_TICKET_OFFER);
  });

  it('getCheapestOffer with baggage offers should return the cheapest offer', () => {
    const cheapestOffer = getCheapestOffer(
      [
        TEST_BICYCLE_TICKET_OFFER,
        {
          ...TEST_BICYCLE_TICKET_OFFER,
          supplementProducts: [
            {
              ...TEST_BICYCLE_TICKET_OFFER.supplementProducts[0],
              price: {
                amount: '200',
                amountFloat: 200,
                currency: 'NOK',
                originalAmount: '200',
                originalAmountFloat: 200,
                vatGroup: 'A',
              },
            },
          ],
        },
      ],
      (o) => o.supplementProducts[0].price,
    );

    expect(cheapestOffer).toBe(TEST_BICYCLE_TICKET_OFFER);
  });
});

const TEST_ADULT_USER_PROFILE: UserProfile = {
  id: 'A',
  name: {lang: 'no', value: 'Test User'},
  version: 'v1',
  userType: 0,
  userTypeString: 'ADULT',
};

const TEST_BICYCLE_PRODUCT: BaggageProduct = {
  id: 'B',
  name: {lang: 'no', value: 'Test Baggage'},
  version: 'v1',
  kind: 'baggage',
  baggageType: 'BICYCLE',
  distributionChannel: ['app'],
  alternativeNames: [],
  description: [],
};

const TEST_ADULT_SINGLE_TICKET_OFFER: TicketOffer = {
  offerId: 'A',
  available: 1,
  shouldStartNow: false,
  route: {
    type: OfferValidity.Zonal,
    from: 'A',
    to: 'B',
  },
  flexDiscountLadder: {
    current: 1,
    steps: [
      {
        expires: '2021-01-01',
        discount: 10,
      },
    ],
  },
  price: {
    amount: '45',
    amountFloat: 45,
    currency: 'NOK',
    originalAmount: '45',
    originalAmountFloat: 45,
    vatGroup: 'A',
  },
  validFrom: '2021-01-01',
  validTo: '2021-01-01',
  travellerId: 'A',
  fareProduct: 'A',
  supplementProducts: [],
};

const TEST_BICYCLE_TICKET_OFFER: SupplementTicketOffer = {
  offerId: 'A',
  available: 1,
  shouldStartNow: false,
  route: {
    type: OfferValidity.Zonal,
    from: 'A',
    to: 'B',
  },
  flexDiscountLadder: {
    current: 0,
    steps: [],
  },
  price: {
    amount: '0',
    amountFloat: 0,
    currency: 'NOK',
    originalAmount: '0',
    originalAmountFloat: 0,
    vatGroup: 'A',
  },
  validFrom: '2021-01-01',
  validTo: '2021-01-01',
  travellerId: 'A',
  fareProduct: undefined,
  supplementProducts: [
    {
      id: 'A',
      selectableId: 'A',
      price: {
        amount: '22',
        amountFloat: 22,
        currency: 'NOK',
        originalAmount: '22',
        originalAmountFloat: 22,
        vatGroup: 'A',
      },
    },
  ],
};

const TEST_ADULT_USER_PROFILE_WITH_COUNT_AND_OFFER: UserProfileWithCountAndOffer =
  {
    ...TEST_ADULT_USER_PROFILE,
    count: 1,
    offer: TEST_ADULT_SINGLE_TICKET_OFFER,
  };

const TEST_BICYCLE_WITH_COUNT_AND_OFFER: BaggageProductWithCountAndOffer = {
  ...TEST_BICYCLE_PRODUCT,
  count: 1,
  offer: TEST_BICYCLE_TICKET_OFFER,
};
