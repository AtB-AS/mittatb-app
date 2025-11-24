import z from 'zod';
import {CancelToken as CancelTokenStatic} from '@atb/api';
import {toAxiosErrorKind, AxiosErrorKind} from '@atb/api/utils';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {FlexDiscountLadder, searchOffers} from '@atb/modules/ticketing';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {
  BaggageProductWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';
import {secondsBetween} from '@atb/utils/date';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {fetchOfferFromLegs} from '@atb/api/sales';
import {
  ErrorResponse,
  SearchOfferPrice,
  TicketOffer,
  SupplementProductOffer,
} from '@atb-as/utils';
import {mapToSalesTripPatternLegs} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/utils';
import {useTranslation} from '@atb/translations';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: TicketOffer;
};

// Presuppose for now that there is only one supplement product offer per baggage product offer, and that the fare product is undefined (or null).
const BaggageTicketOffer = TicketOffer.extend({
  fareProduct: z.undefined().nullish(),
  supplementProducts: z.array(SupplementProductOffer).length(1),
});
type BaggageTicketOffer = z.infer<typeof BaggageTicketOffer>;

export type BaggageProductWithCountAndOffer = BaggageProductWithCount & {
  offer: BaggageTicketOffer;
};

export type OfferError = {
  type: AxiosErrorKind | 'empty-offers' | 'not-available';
};

type OfferState = {
  offerSearchTime?: number;
  isSearchingOffer: boolean;
  validDurationSeconds?: number;
  originalPrice: number;
  totalPrice: number;
  error?: OfferError;
  userProfilesWithCountAndOffer: UserProfileWithCountAndOffer[];
  baggageProductsWithCountAndOffer: BaggageProductWithCountAndOffer[];
  flexDiscountLadder?: FlexDiscountLadder;
};

type OfferReducerAction =
  | {type: 'SEARCHING_OFFER'}
  | {type: 'SET_OFFER'; offers: TicketOffer[]}
  | {type: 'CLEAR_OFFER'}
  | {type: 'SET_ERROR'; error: OfferError};

type OfferReducer = (
  prevState: OfferState,
  action: OfferReducerAction,
) => OfferState;

type PriceFunction = (price: SearchOfferPrice, currency: string) => number;

const getPriceAsFloat: PriceFunction = (
  price: SearchOfferPrice,
  currency = 'NOK',
) => (price.currency === currency ? (price.amountFloat ?? 0) : 0);

const getOriginalPriceAsFloat: PriceFunction = (
  price: SearchOfferPrice,
  currency: string,
) => (price.currency === currency ? (price.originalAmountFloat ?? 0) : 0);

const getValidDurationSeconds = (offer: TicketOffer): number | undefined =>
  offer.validFrom && offer.validTo
    ? secondsBetween(offer.validFrom, offer.validTo)
    : undefined;

const getOfferForTraveller = (
  offers: TicketOffer[],
  userTypeString: string,
): TicketOffer => {
  // Filter if the offer is a fare product offer (it has a fare product ref set), and if it matches the traveller id.
  const offersForTraveller = offers.filter(
    (o) => o.travellerId === userTypeString && o.fareProduct,
  );

  // If there are multiple offers for the same traveller, use the cheapest one.
  // This shouldn't happen in practice, but it's a sensible fallback.
  const offersSortedByPrice = offersForTraveller.sort(
    (a, b) => getPriceAsFloat(a.price, 'NOK') - getPriceAsFloat(b.price, 'NOK'),
  );

  return offersSortedByPrice[0];
};

const getOfferForBaggageProduct = (
  offers: TicketOffer[],
  baggageProductId: string,
): BaggageTicketOffer => {
  const offersForBaggageProduct: BaggageTicketOffer[] = offers
    .map((o) => BaggageTicketOffer.safeParse(o))
    .filter((o) => o.success)
    .map((o) => o.data)
    .filter((o) => o.supplementProducts[0].id === baggageProductId);

  // If there are multiple offers for the same supplement product, use the cheapest one.
  // This shouldn't happen in practice, but it's a sensible fallback.
  const offersSortedByPrice = offersForBaggageProduct.sort(
    (a, b) =>
      getPriceAsFloat(a.supplementProducts[0].price, 'NOK') -
      getPriceAsFloat(b.supplementProducts[0].price, 'NOK'),
  );

  return offersSortedByPrice[0];
};

const calculateTotalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  baggageProductsWithCount: BaggageProductWithCount[],
  offers: TicketOffer[],
) => {
  return calculateTotalPriceWithPriceFunction(
    getPriceAsFloat,
    userProfileWithCounts,
    baggageProductsWithCount,
    offers,
  );
};

const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  baggageProductsWithCount: BaggageProductWithCount[],
  offers: TicketOffer[],
) => {
  return calculateTotalPriceWithPriceFunction(
    getOriginalPriceAsFloat,
    userProfileWithCounts,
    baggageProductsWithCount,
    offers,
  );
};

const calculateTotalPriceWithPriceFunction = (
  priceFunction: PriceFunction,
  userProfileWithCounts: UserProfileWithCount[],
  baggageProductsWithCount: BaggageProductWithCount[],
  offers: TicketOffer[],
): number => {
  const userProfilesPrice = userProfileWithCounts.reduce((total, traveller) => {
    const offer = getOfferForTraveller(offers, traveller.userTypeString);

    const price = offer
      ? priceFunction(offer.price, 'NOK') * traveller.count
      : 0;

    return total + price;
  }, 0);

  const baggageProductsPrice = baggageProductsWithCount.reduce(
    (total, baggageProduct) => {
      const offer = getOfferForBaggageProduct(offers, baggageProduct.id);
      const price = offer
        ? priceFunction(offer.supplementProducts[0].price, 'NOK') *
          baggageProduct.count
        : 0;
      return total + price;
    },
    0,
  );

  return userProfilesPrice + baggageProductsPrice;
};

const mapToUserProfilesWithCountAndOffer = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: TicketOffer[],
): UserProfileWithCountAndOffer[] =>
  userProfileWithCounts
    .map((u) => ({
      ...u,
      offer: getOfferForTraveller(offers, u.userTypeString),
    }))
    .filter((u): u is UserProfileWithCountAndOffer => u.offer != null);

const mapToBaggageProductsWithCountAndOffer = (
  baggageProductsWithCount: BaggageProductWithCount[],
  offers: TicketOffer[],
): BaggageProductWithCountAndOffer[] =>
  baggageProductsWithCount
    .map((s) => ({
      ...s,
      offer: getOfferForBaggageProduct(offers, s.id),
    }))
    .filter((s): s is BaggageProductWithCountAndOffer => s.offer != null);

const getOfferReducer =
  (
    userProfilesWithCounts: UserProfileWithCount[],
    baggageProductsWithCount: BaggageProductWithCount[],
  ): OfferReducer =>
  (prevState, action): OfferState => {
    switch (action.type) {
      case 'SEARCHING_OFFER':
        return {
          ...prevState,
          isSearchingOffer: true,
        };
      case 'CLEAR_OFFER':
        return {
          ...prevState,
          offerSearchTime: undefined,
          isSearchingOffer: false,
          totalPrice: 0,
          originalPrice: 0,
          error: undefined,
          userProfilesWithCountAndOffer: [],
          baggageProductsWithCountAndOffer: [],
        };
      case 'SET_OFFER':
        return {
          ...prevState,
          offerSearchTime: Date.now(),
          isSearchingOffer: false,
          validDurationSeconds: getValidDurationSeconds(action.offers?.[0]),
          originalPrice: calculateOriginalPrice(
            userProfilesWithCounts,
            baggageProductsWithCount,
            action.offers,
          ),
          totalPrice: calculateTotalPrice(
            userProfilesWithCounts,
            baggageProductsWithCount,
            action.offers,
          ),
          userProfilesWithCountAndOffer: mapToUserProfilesWithCountAndOffer(
            userProfilesWithCounts,
            action.offers,
          ),
          baggageProductsWithCountAndOffer:
            mapToBaggageProductsWithCountAndOffer(
              baggageProductsWithCount,
              action.offers,
            ),
          error: undefined,
        };
      case 'SET_ERROR': {
        return {
          ...prevState,
          error: action.error,
          isSearchingOffer: false,
        };
      }
    }
  };

const initialState: OfferState = {
  isSearchingOffer: false,
  offerSearchTime: undefined,
  totalPrice: 0,
  originalPrice: 0,
  error: undefined,
  userProfilesWithCountAndOffer: [],
  baggageProductsWithCountAndOffer: [],
};

export function useOfferState(
  preassignedFareProductAlternatives: PreassignedFareProduct[],
  selection?: PurchaseSelectionType,
) {
  const offerReducer = getOfferReducer(
    selection?.userProfilesWithCount ?? [],
    selection?.baggageProductsWithCount ?? [],
  );
  const [state, dispatch] = useReducer(offerReducer, initialState);
  const {t} = useTranslation();

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
      if (selection?.stopPlaces?.to?.isFree) {
        dispatch({type: 'CLEAR_OFFER'});
        return;
      }

      const offerTravellers =
        selection?.userProfilesWithCount
          .filter((t) => t.count)
          .map((t) => ({
            id: t.userTypeString,
            userType: t.userTypeString,
            count: t.count,
          })) ?? [];

      const baggageProductTravellers =
        selection?.baggageProductsWithCount
          .filter((sp) => sp.count)
          .map((sp) => ({
            id: 'ADULT',
            userType: 'ADULT',
            baggageTypes: [sp.baggageType],
            count: sp.count,
          })) ?? [];

      const allTravellers = [...offerTravellers, ...baggageProductTravellers];

      const isTravellersValid = allTravellers.length > 0;
      const isStopPlacesValid = selection?.stopPlaces
        ? selection.stopPlaces.from && selection.stopPlaces.to
        : true;
      const isSelectionValid = isTravellersValid && isStopPlacesValid;

      if (!isSelectionValid) {
        dispatch({type: 'CLEAR_OFFER'});
      } else {
        try {
          dispatch({type: 'SEARCHING_OFFER'});
          let offers: TicketOffer[];

          if (selection?.legs.length) {
            const response = await fetchOfferFromLegs(
              new Date(selection.legs[0].expectedStartTime),
              mapToSalesTripPatternLegs(t, selection.legs),
              allTravellers,
              preassignedFareProductAlternatives.map((p) => p.id),
            );
            offers = response.offers;
          } else {
            const params = {
              zones: selection?.zones && [
                ...new Set([selection.zones.from.id, selection.zones.to.id]),
              ],
              from: selection?.stopPlaces?.from!.id,
              to: selection?.stopPlaces?.to!.id,
              isOnBehalfOf: selection?.isOnBehalfOf ?? false,
              travellers: allTravellers,
              products: offerTravellers.length
                ? preassignedFareProductAlternatives.map((p) => p.id)
                : [],
              supplementProducts: selection?.baggageProductsWithCount.map(
                (sp) => sp.id,
              ),
              travelDate: selection?.travelDate,
            };

            const offerEndpoint = selection?.stopPlaces
              ? 'stop-places'
              : selection?.zones
                ? 'zones'
                : 'authority';

            offers = await searchOffers(offerEndpoint, params, {
              cancelToken,
              authWithIdToken: true,
              skipErrorLogging: isNotAvailableError,
            });

            cancelToken?.throwIfRequested();
          }

          if (offers.length) {
            dispatch({type: 'SET_OFFER', offers});
          } else {
            dispatch({
              type: 'SET_ERROR',
              error: {
                type: 'empty-offers',
              },
            });
          }
        } catch (err: any) {
          const error = err as ErrorResponse;
          const errorKind = isNotAvailableError(error)
            ? 'not-available'
            : toAxiosErrorKind(error.kind);

          if (errorKind !== 'AXIOS_CANCEL') {
            console.warn(err);
            dispatch({
              type: 'SET_ERROR',
              error: {
                type: errorKind,
              },
            });
          }
        }
      }
    },
    [selection, preassignedFareProductAlternatives, t],
  );

  useEffect(() => {
    const source = CancelTokenStatic.source();
    updateOffer(source.token);
    return () => source.cancel('Cancelling previous offer search');
  }, [dispatch, updateOffer, selection]);

  const refreshOffer = useCallback(
    async function () {
      await updateOffer(undefined);
    },
    [updateOffer],
  );

  return {
    ...state,
    refreshOffer,
  };
}

const isNotAvailableError = (err: any) =>
  err.response?.status === 404 &&
  err.response?.data.kind === 'NO_AVAILABLE_OFFERS_DUE_TO_SCHEDULE';
