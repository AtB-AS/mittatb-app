import {
  SearchOfferPrice,
  TicketOffer,
} from '@atb-as/utils/lib/offers/ticket-offer';
import {
  BaggageProductWithCountAndOffer,
  BaggageTicketOffer,
  UserProfileWithCountAndOffer,
} from './use-offer-state';

export const calculateTotalPrice = (
  userProfileWithCounts: UserProfileWithCountAndOffer[],
  baggageProductsWithCount: BaggageProductWithCountAndOffer[],
) => {
  return calculateTotalPriceWithPriceFunction(
    getPriceAsFloat,
    userProfileWithCounts,
    baggageProductsWithCount,
  );
};

export const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCountAndOffer[],
  baggageProductsWithCount: BaggageProductWithCountAndOffer[],
) => {
  return calculateTotalPriceWithPriceFunction(
    getOriginalPriceAsFloat,
    userProfileWithCounts,
    baggageProductsWithCount,
  );
};

export const getCheapestOffer = <T extends TicketOffer | BaggageTicketOffer>(
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
  baggageProductsWithCountAndOffers: BaggageProductWithCountAndOffer[],
): number => {
  const userProfilesPrice = userProfileWithCountsAndOffers.reduce(
    (total, traveller) => {
      return (
        total + priceFunction(traveller.offer.price, 'NOK') * traveller.count
      );
    },
    0,
  );

  const baggageProductsPrice = baggageProductsWithCountAndOffers.reduce(
    (total, baggageProductWithOffer) => {
      return (
        total +
        priceFunction(
          baggageProductWithOffer.offer.supplementProducts[0].price,
          'NOK',
        ) *
          baggageProductWithOffer.count
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
