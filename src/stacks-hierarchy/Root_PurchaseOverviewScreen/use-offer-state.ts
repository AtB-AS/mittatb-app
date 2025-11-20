import {CancelToken as CancelTokenStatic} from '@atb/api';
import {toAxiosErrorKind, AxiosErrorKind} from '@atb/api/utils';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {FlexDiscountLadder, searchOffers} from '@atb/modules/ticketing';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {secondsBetween} from '@atb/utils/date';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {fetchOfferFromLegs} from '@atb/api/sales';
import type {ErrorResponse, SearchOfferPrice, TicketOffer} from '@atb-as/utils';
import {mapToSalesTripPatternLegs} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/utils';
import {useTranslation} from '@atb/translations';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: TicketOffer;
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

const getCurrencyAsFloat = (price: SearchOfferPrice, currency = 'NOK') =>
  price.currency === currency ? (price.amountFloat ?? 0) : 0;

const getOriginalPriceAsFloat = (price: SearchOfferPrice, currency: string) =>
  price.currency === currency ? (price.originalAmountFloat ?? 0) : 0;

const getValidDurationSeconds = (offer: TicketOffer): number | undefined =>
  offer.validFrom && offer.validTo
    ? secondsBetween(offer.validFrom, offer.validTo)
    : undefined;

const getOfferForTraveller = (
  offers: TicketOffer[],
  userTypeString: string,
) => {
  const offersForTraveller = offers.filter(
    (o) => o.travellerId === userTypeString,
  );

  // If there are multiple offers for the same traveller, use the cheapest one.
  // This shouldn't happen in practice, but it's a sensible fallback.
  const offersSortedByPrice = offersForTraveller.sort(
    (a, b) =>
      getCurrencyAsFloat(a.price, 'NOK') - getCurrencyAsFloat(b.price, 'NOK'),
  );

  return offersSortedByPrice[0];
};

const calculateTotalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: TicketOffer[],
) => {
  return userProfileWithCounts.reduce((total, traveller) => {
    const offer = getOfferForTraveller(offers, traveller.userTypeString);
    const supplementProductPrice =
      offer?.supplementProducts?.reduce(
        (suppTotal, suppProduct) =>
          suppTotal + getCurrencyAsFloat(suppProduct.price, 'NOK'),
        0,
      ) ?? 0;
    const price = offer
      ? getCurrencyAsFloat(offer.price, 'NOK') * traveller.count
      : 0;
    console.log(
      `Adding total (${total}) + price (${price}) + supplementProductPrice (${supplementProductPrice}) for traveller ${traveller.userTypeString}`,
    );
    const newTotal = total + price + supplementProductPrice;
    console.log('Returning new total:', newTotal);
    return newTotal;
  }, 0);
};

const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: TicketOffer[],
) =>
  userProfileWithCounts.reduce((total, traveller) => {
    const offer = getOfferForTraveller(offers, traveller.userTypeString);
    const price = offer
      ? getOriginalPriceAsFloat(offer.price, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

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

const getOfferReducer =
  (userProfilesWithCounts: UserProfileWithCount[]): OfferReducer =>
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
        };
      case 'SET_OFFER':
        return {
          ...prevState,
          offerSearchTime: Date.now(),
          isSearchingOffer: false,
          validDurationSeconds: getValidDurationSeconds(action.offers?.[0]),
          originalPrice: calculateOriginalPrice(
            userProfilesWithCounts,
            action.offers,
          ),
          totalPrice: calculateTotalPrice(
            userProfilesWithCounts,
            action.offers,
          ),
          userProfilesWithCountAndOffer: mapToUserProfilesWithCountAndOffer(
            userProfilesWithCounts,
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
};

export function useOfferState(
  preassignedFareProductAlternatives: PreassignedFareProduct[],
  selection?: PurchaseSelectionType,
) {
  const offerReducer = getOfferReducer(selection?.userProfilesWithCount ?? []);
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

      console.log(
        'Supplement products with count:',
        selection?.supplementProductsWithCount,
      );
      const supplementProductTravellers =
        selection?.supplementProductsWithCount
          .filter((sp) => sp.count)
          .map((sp) => ({
            id: 'ADULT',
            userType: 'ADULT',
            baggageTypes: ['BICYCLE'],
            count: sp.count,
          })) ?? [];
      console.log(
        'Supplement product travellers:',
        supplementProductTravellers,
      );

      const allTravellers = [
        ...offerTravellers,
        ...supplementProductTravellers,
      ];

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

            console.log('Searching offers with params: ', params);
            offers = await searchOffers(offerEndpoint, params, {
              cancelToken,
              authWithIdToken: true,
              skipErrorLogging: isNotAvailableError,
            });

            cancelToken?.throwIfRequested();
          }

          if (offers.length) {
            console.log('Offers found:', offers);
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
