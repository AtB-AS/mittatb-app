import z from 'zod';
import {CancelToken as CancelTokenStatic} from '@atb/api';
import {toAxiosErrorKind, AxiosErrorKind} from '@atb/api/utils';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {FlexDiscountLadder, searchOffers} from '@atb/modules/ticketing';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {
  BaggageProductWithCount,
  type SupplementProductWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';
import {secondsBetween} from '@atb/utils/date';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {fetchOfferFromLegs} from '@atb/api/sales';
import {
  ErrorResponse,
  TicketOffer,
  SupplementProductOffer,
} from '@atb-as/utils';
import {mapToSalesTripPatternLegs} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/utils';
import {useTranslation} from '@atb/translations';
import {
  calculateOriginalPrice,
  calculateTotalPrice,
  getCheapestOffer,
} from './offer-price-calculator';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: TicketOffer;
};

// Presuppose for now that there is only one supplement product offer per baggage product offer, and that the fare product is undefined (or null).
export const SupplementTicketOffer = TicketOffer.extend({
  fareProduct: z.undefined().nullish(),
  supplementProducts: z.array(SupplementProductOffer).length(1),
});
export type SupplementTicketOffer = z.infer<typeof SupplementTicketOffer>;

export type BaggageProductWithCountAndOffer = BaggageProductWithCount & {
  offer: SupplementTicketOffer;
};

export type SupplementProductWithCountAndOffer = SupplementProductWithCount & {
  offer: SupplementTicketOffer;
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
  supplementProductsWithCountAndOffer: SupplementProductWithCountAndOffer[];
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
  return getCheapestOffer(offersForTraveller, (o) => o.price);
};

const getOfferForBaggageProduct = (
  offers: TicketOffer[],
  supplementProductId: string,
): SupplementTicketOffer => {
  const offersForSupplementProduct: SupplementTicketOffer[] = offers
    .map((o) => SupplementTicketOffer.safeParse(o))
    .filter((o) => o.success)
    .map((o) => o.data)
    .filter((o) => o.supplementProducts[0].id === supplementProductId);

  // If there are multiple offers for the same supplement product, use the cheapest one.
  // This shouldn't happen in practice, but it's a sensible fallback.
  return getCheapestOffer(
    offersForSupplementProduct,
    (o) => o.supplementProducts[0].price,
  );
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

const mapToSupplementProductsWithCountAndOffer = (
  supplementProductsWithCount: SupplementProductWithCount[],
  offers: TicketOffer[],
): SupplementProductWithCountAndOffer[] =>
  supplementProductsWithCount
    .map((s) => ({
      ...s,
      offer: getOfferForBaggageProduct(offers, s.id),
    }))
    .filter((s): s is BaggageProductWithCountAndOffer => s.offer != null);

const getOfferReducer =
  (
    userProfilesWithCounts: UserProfileWithCount[],
    supplementProductsWithCount: SupplementProductWithCount[],
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
          supplementProductsWithCountAndOffer: [],
        };
      case 'SET_OFFER':
        const userProfilesWithCountAndOffer =
          mapToUserProfilesWithCountAndOffer(
            userProfilesWithCounts,
            action.offers,
          );
        const supplementProductsWithCountAndOffer =
          mapToSupplementProductsWithCountAndOffer(
            supplementProductsWithCount,
            action.offers,
          );
        return {
          ...prevState,
          offerSearchTime: Date.now(),
          isSearchingOffer: false,
          validDurationSeconds: getValidDurationSeconds(action.offers?.[0]),
          originalPrice: calculateOriginalPrice(
            userProfilesWithCountAndOffer,
            supplementProductsWithCountAndOffer,
          ),
          totalPrice: calculateTotalPrice(
            userProfilesWithCountAndOffer,
            supplementProductsWithCountAndOffer,
          ),
          userProfilesWithCountAndOffer,
          supplementProductsWithCountAndOffer:
            supplementProductsWithCountAndOffer,
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
  supplementProductsWithCountAndOffer: [],
};

export function useOfferState(
  preassignedFareProductAlternatives: PreassignedFareProduct[],
  selection?: PurchaseSelectionType,
) {
  const offerReducer = getOfferReducer(
    selection?.userProfilesWithCount ?? [],
    selection?.supplementProductsWithCount ?? [],
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
            productIds: selection?.existingProduct
              ? [selection.existingProduct.id]
              : [],
          })) ?? [];

      const baggageProductTravellers =
        selection?.supplementProductsWithCount
          .filter(isBaggageProductWithCount)
          ?.filter((sp) => sp.count)
          .map((bp) => ({
            id: bp.baggageType,
            // Must be a valid user profile ref, and we are unsure if Entur supports 'ANYONE' yet for baggage products.
            // Doesn't actually have an affect on the purchased product.
            userType: 'ADULT',
            baggageTypes: [bp.baggageType],
            count: bp.count,
          })) ?? [];

      const allTravellers = [...offerTravellers, ...baggageProductTravellers];
      const nonBaggageProductSupplementProducts =
        selection?.supplementProductsWithCount.filter(
          (sp) => !isBaggageProductWithCount(sp),
        ) ?? [];

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
              selection.existingProduct
                ? nonBaggageProductSupplementProducts.map((sp) => sp.id)
                : preassignedFareProductAlternatives.map((p) => p.id),
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
              supplementProducts: selection?.supplementProductsWithCount.map(
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

function isBaggageProductWithCount(
  supplementProductWithCount: SupplementProductWithCount,
): supplementProductWithCount is BaggageProductWithCount {
  return supplementProductWithCount.kind === 'baggage';
}
