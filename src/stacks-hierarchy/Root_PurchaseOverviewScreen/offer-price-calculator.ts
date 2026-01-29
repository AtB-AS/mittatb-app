import {
  SearchOfferPrice,
  TicketOffer,
} from '@atb-as/utils/lib/offers/ticket-offer';
import {
  type SupplementProductWithCountAndOffer,
  SupplementTicketOffer,
  UserProfileWithCountAndOffer,
} from './use-offer-state';

export const calculateTotalPrice = (
  userProfileWithCounts: UserProfileWithCountAndOffer[],
  supplementProductsWithCount: SupplementProductWithCountAndOffer[],
) => {
  return calculateTotalPriceWithPriceFunction(
    getPriceAsFloat,
    userProfileWithCounts,
    supplementProductsWithCount,
  );
};

export const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCountAndOffer[],
  supplementProductsWithCount: SupplementProductWithCountAndOffer[],
) => {
  return calculateTotalPriceWithPriceFunction(
    getOriginalPriceAsFloat,
    userProfileWithCounts,
    supplementProductsWithCount,
  );
};

export const getCheapestOffer = <T extends TicketOffer | SupplementTicketOffer>(
  offers: T[],
  priceSelector: (offer: T) => SearchOfferPrice,
) => {
  return offers.sort(
    (a, b) =>
      getPriceAsFloat(priceSelector(a), 'NOK') -
      getPriceAsFloat(priceSelector(b), 'NOK'),
  )[0];
};

const calculateTotalPriceWithPriceFunction = (
  priceFunction: PriceFunction,
  userProfileWithCountsAndOffers: UserProfileWithCountAndOffer[],
  supplementProductsWithCountAndOffers: SupplementProductWithCountAndOffer[],
): number => {
  const userProfilesPrice = userProfileWithCountsAndOffers.reduce(
    (total, traveller) => {
      return (
        total + priceFunction(traveller.offer.price, 'NOK') * traveller.count
      );
    },
    0,
  );

  const baggageProductsPrice = supplementProductsWithCountAndOffers.reduce(
    (total, supplementProductWithOffer) => {
      return (
        total +
        priceFunction(
          supplementProductWithOffer.offer.supplementProducts[0].price,
          'NOK',
        ) *
          supplementProductWithOffer.count
      );
    },
    0,
  );

  return userProfilesPrice + baggageProductsPrice;
};

type PriceFunction = (price: SearchOfferPrice, currency: string) => number;

const getPriceAsFloat: PriceFunction = (
  price: SearchOfferPrice,
  currency = 'NOK',
) => (price.currency === currency ? (price.amountFloat ?? 0) : 0);

const getOriginalPriceAsFloat: PriceFunction = (
  price: SearchOfferPrice,
  currency: string,
) => (price.currency === currency ? (price.originalAmountFloat ?? 0) : 0);
