import {CancelToken as CancelTokenStatic} from '@atb/api';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {PreassignedFareProduct} from '@atb/configuration';
import {
  FlexDiscountLadder,
  Offer,
  OfferPrice,
  searchOffers,
} from '@atb/ticketing';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {secondsBetween} from '@atb/utils/date';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: Offer;
};

export type OfferError = {
  type: ErrorType | 'empty-offers' | 'not-available';
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
  | {type: 'SET_OFFER'; offers: Offer[]}
  | {type: 'CLEAR_OFFER'}
  | {type: 'SET_ERROR'; error: OfferError};

type OfferReducer = (
  prevState: OfferState,
  action: OfferReducerAction,
) => OfferState;

const getCurrencyAsFloat = (price: OfferPrice, currency = 'NOK') =>
  price.currency === currency ? price.amountFloat ?? 0 : 0;

const getOriginalPriceAsFloat = (price: OfferPrice, currency: string) =>
  price.currency === currency ? price.originalAmountFloat ?? 0 : 0;

const getValidDurationSeconds = (offer: Offer): number | undefined =>
  offer.validFrom && offer.validTo
    ? secondsBetween(offer.validFrom, offer.validTo)
    : undefined;

const getOfferForTraveller = (offers: Offer[], userTypeString: string) => {
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
  offers: Offer[],
) =>
  userProfileWithCounts.reduce((total, traveller) => {
    const offer = getOfferForTraveller(offers, traveller.userTypeString);
    const price = offer
      ? getCurrencyAsFloat(offer.price, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: Offer[],
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
  offers: Offer[],
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
  selection: PurchaseSelectionType,
  preassignedFareProductAlternatives: PreassignedFareProduct[],
  isOnBehalfOf: boolean = false,
) {
  const offerReducer = getOfferReducer(selection.userProfilesWithCount);
  const [state, dispatch] = useReducer(offerReducer, initialState);

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
      if (selection.stopPlaces?.to?.isFree) {
        dispatch({type: 'CLEAR_OFFER'});
        return;
      }

      const offerTravellers = selection.userProfilesWithCount
        .filter((t) => t.count)
        .map((t) => ({
          id: t.userTypeString,
          userType: t.userTypeString,
          count: t.count,
        }));

      const isTravellersValid = offerTravellers.length > 0;
      const isStopPlacesValid = selection.stopPlaces
        ? selection.stopPlaces.from && selection.stopPlaces.to
        : true;
      const isSelectionValid = isTravellersValid && isStopPlacesValid;

      if (!isSelectionValid) {
        dispatch({type: 'CLEAR_OFFER'});
      } else {
        try {
          const params = {
            zones: selection.zones && [
              ...new Set([selection.zones.from.id, selection.zones.to.id]),
            ],
            from: selection.stopPlaces?.from!.id,
            to: selection.stopPlaces?.to!.id,
            isOnBehalfOf,
            travellers: offerTravellers,
            products: preassignedFareProductAlternatives.map((p) => p.id),
            travelDate: selection.travelDate,
          };
          dispatch({type: 'SEARCHING_OFFER'});

          const offerEndpoint = selection.stopPlaces
            ? 'stop-places'
            : selection.zones
            ? 'zones'
            : 'authority';

          const response = await searchOffers(offerEndpoint, params, {
            cancelToken,
            authWithIdToken: true,
            skipErrorLogging: isNotAvailableError,
          });

          cancelToken?.throwIfRequested();

          if (response.length) {
            dispatch({type: 'SET_OFFER', offers: response});
          } else {
            dispatch({
              type: 'SET_ERROR',
              error: {
                type: 'empty-offers',
              },
            });
          }
        } catch (err: any) {
          const errorType = isNotAvailableError(err)
            ? 'not-available'
            : getAxiosErrorType(err);
          if (errorType !== 'cancel') {
            console.warn(err);
            dispatch({
              type: 'SET_ERROR',
              error: {
                type: errorType,
              },
            });
          }
        }
      }
    },
    [selection, preassignedFareProductAlternatives, isOnBehalfOf],
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
  err.response?.status === 400 &&
  err.response?.data.kind === 'NoAvailableOffersDueToSchedule';
