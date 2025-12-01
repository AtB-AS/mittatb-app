import {TicketOffer, OfferValidity} from '@atb-as/utils';
import {
  BaggageProductWithCountAndOffer,
  BaggageTicketOffer,
  UserProfileWithCountAndOffer,
} from '../use-offer-state';
import {BaggageProduct, UserProfile} from '@atb-as/config-specs';
import {
  calculateOriginalPrice,
  calculateTotalPrice,
  getCheapestOffer,
} from '../offer-price-calculator';

const TEST_USER_PROFILE: UserProfile = {
  id: 'A',
  name: {lang: 'no', value: 'Test User'},
  version: 'v1',
  userType: 0,
  userTypeString: 'ADULT',
};

const TEST_BAGGAGE_PRODUCT: BaggageProduct = {
  id: 'B',
  name: {lang: 'no', value: 'Test Baggage'},
  version: 'v1',
  isBaggageProduct: true,
  baggageType: 'BICYCLE',
  distributionChannel: ['app'],
  alternativeNames: [],
  description: [],
};

const TEST_TICKET_OFFER: TicketOffer = {
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
    amount: '100',
    amountFloat: 100,
    currency: 'NOK',
    originalAmount: '100',
    originalAmountFloat: 100,
    vatGroup: 'A',
  },
  validFrom: '2021-01-01',
  validTo: '2021-01-01',
  travellerId: 'A',
  fareProduct: 'A',
  supplementProducts: [],
};

const TEST_BAGGAGE_TICKET_OFFER: BaggageTicketOffer = {
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
        amount: '100',
        amountFloat: 100,
        currency: 'NOK',
        originalAmount: '100',
        originalAmountFloat: 100,
        vatGroup: 'A',
      },
    },
  ],
};

const TEST_USER_PROFILE_WITH_COUNT_AND_OFFER: UserProfileWithCountAndOffer = {
  ...TEST_USER_PROFILE,
  count: 1,
  offer: TEST_TICKET_OFFER,
};

const TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER: BaggageProductWithCountAndOffer =
  {
    ...TEST_BAGGAGE_PRODUCT,
    count: 1,
    offer: TEST_BAGGAGE_TICKET_OFFER,
  };

describe('offer-price-calculator', () => {
  it('calculateTotalPrice with user profile and baggage product should calculate the total price', () => {
    const totalPrice = calculateTotalPrice(
      [TEST_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER],
    );

    expect(totalPrice).toBe(200);
  });

  it('calculateTotalPrice with no user profiles and one baggage products should calculate the total price', () => {
    const totalPrice = calculateTotalPrice(
      [],
      [TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER],
    );

    expect(totalPrice).toBe(100);
  });

  it('calculateTotalPrice with one user profile and no baggage products should calculate the total price', () => {
    const totalPrice = calculateTotalPrice(
      [TEST_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [],
    );

    expect(totalPrice).toBe(100);
  });

  it('calculateTotalPrice with no user profiles and no baggage products should calculate the total price', () => {
    const totalPrice = calculateTotalPrice([], []);

    expect(totalPrice).toBe(0);
  });

  it('calculateTotalPrice with multiple user profiles and baggage products should calculate the total price', () => {
    const totalPrice = calculateTotalPrice(
      [
        TEST_USER_PROFILE_WITH_COUNT_AND_OFFER,
        TEST_USER_PROFILE_WITH_COUNT_AND_OFFER,
      ],
      [
        TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER,
        TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER,
      ],
    );

    expect(totalPrice).toBe(400);
  });

  it('calculateOriginalPrice with user profile and baggage product should calculate the original price', () => {
    const originalPrice = calculateOriginalPrice(
      [TEST_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER],
    );

    expect(originalPrice).toBe(200);
  });

  it('calculateOriginalPrice with no user profiles and one baggage products should calculate the original price', () => {
    const originalPrice = calculateOriginalPrice(
      [],
      [TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER],
    );

    expect(originalPrice).toBe(100);
  });

  it('calculateOriginalPrice with one user profile and no baggage products should calculate the original price', () => {
    const originalPrice = calculateOriginalPrice(
      [TEST_USER_PROFILE_WITH_COUNT_AND_OFFER],
      [],
    );

    expect(originalPrice).toBe(100);
  });

  it('calculateOriginalPrice with no user profiles and no baggage products should calculate the original price', () => {
    const originalPrice = calculateOriginalPrice([], []);

    expect(originalPrice).toBe(0);
  });

  it('calculateOriginalPrice with multiple user profiles and baggage products should calculate the original price', () => {
    const originalPrice = calculateOriginalPrice(
      [
        TEST_USER_PROFILE_WITH_COUNT_AND_OFFER,
        TEST_USER_PROFILE_WITH_COUNT_AND_OFFER,
      ],
      [
        TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER,
        TEST_BAGGAGE_PRODUCT_WITH_COUNT_AND_OFFER,
      ],
    );

    expect(originalPrice).toBe(400);
  });

  it('getCheapestOffer with ticket offers should return the cheapest offer', () => {
    const cheapestOffer = getCheapestOffer(
      [
        TEST_TICKET_OFFER,
        {
          ...TEST_TICKET_OFFER,
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

    expect(cheapestOffer).toBe(TEST_TICKET_OFFER);
  });

  it('getCheapestOffer with baggage offers should return the cheapest offer', () => {
    const cheapestOffer = getCheapestOffer(
      [
        TEST_BAGGAGE_TICKET_OFFER,
        {
          ...TEST_BAGGAGE_TICKET_OFFER,
          supplementProducts: [
            {
              ...TEST_BAGGAGE_TICKET_OFFER.supplementProducts[0],
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

    expect(cheapestOffer).toBe(TEST_BAGGAGE_TICKET_OFFER);
  });
});
