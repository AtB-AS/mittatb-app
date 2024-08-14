import {CancelToken as CancelTokenStatic} from '@atb/api';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {PreassignedFareProduct, TariffZone} from '@atb/configuration';
import {
  FlexDiscountLadder,
  Offer,
  OfferPrice,
  searchOffers,
} from '@atb/ticketing';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {secondsBetween} from '@atb/utils/date';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {StopPlaceFragmentWithIsFree} from '@atb/harbors/types';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: Offer;
};

export type OfferError = {
  type: ErrorType | 'empty-offers';
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

const getCurrencyAsFloat = (prices: OfferPrice[], currency: string) =>
  prices.find((p) => p.currency === currency)?.amount_float ?? 0;

const getOriginalPriceAsFloat = (prices: OfferPrice[], currency: string) =>
  prices.find((p) => p.currency === currency)?.original_amount_float ?? 0;

const getValidDurationSeconds = (offer: Offer): number | undefined =>
  offer.valid_from && offer.valid_to
    ? secondsBetween(offer.valid_from, offer.valid_to)
    : undefined;

const calculateTotalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: Offer[],
) =>
  userProfileWithCounts.reduce((total, traveller) => {
    const maybeOffer = offers.find(
      (o) => o.traveller_id === traveller.userTypeString,
    );
    const price = maybeOffer
      ? getCurrencyAsFloat(maybeOffer.prices, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

const calculateOriginalPrice = (
  userProfileWithCounts: UserProfileWithCount[],
  offers: Offer[],
) =>
  userProfileWithCounts.reduce((total, traveller) => {
    const maybeOffer = offers.find(
      (o) => o.traveller_id === traveller.userTypeString,
    );
    const price = maybeOffer
      ? getOriginalPriceAsFloat(maybeOffer.prices, 'NOK') * traveller.count
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
      offer: offers.find((o) => o.traveller_id === u.userTypeString),
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
  offerEndpoint: 'zones' | 'authority' | 'stop-places',
  preassignedFareProduct: PreassignedFareProduct,
  fromPlace: TariffZone | StopPlaceFragmentWithIsFree,
  toPlace: TariffZone | StopPlaceFragmentWithIsFree,
  userProfilesWithCount: UserProfileWithCount[],
  isOnBehalfOf: boolean = false,
  travelDate?: string,
) {
  const offerReducer = getOfferReducer(userProfilesWithCount);
  const [state, dispatch] = useReducer(offerReducer, initialState);
  const zones = useMemo(
    () => [...new Set([fromPlace.id, toPlace.id])],
    [fromPlace, toPlace],
  );

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
      if ('isFree' in toPlace && toPlace.isFree) {
        dispatch({type: 'CLEAR_OFFER'});
        return;
      }

      const offerTravellers = userProfilesWithCount
        .filter((t) => t.count)
        .map((t) => ({
          id: t.userTypeString,
          user_type: t.userTypeString,
          count: t.count,
        }));

      if (!offerTravellers.length) {
        dispatch({type: 'CLEAR_OFFER'});
      } else {
        try {
          if (
            offerEndpoint === 'stop-places' &&
            (isTariffZone(fromPlace) || isTariffZone(toPlace))
          ) {
            dispatch({type: 'CLEAR_OFFER'});
            return;
          }
          const placeParams =
            offerEndpoint === 'stop-places'
              ? {from: fromPlace.id, to: toPlace.id}
              : {zones};
          const params = {
            ...placeParams,
            is_on_behalf_of: isOnBehalfOf,
            travellers: offerTravellers,
            products: [preassignedFareProduct.id],
            travel_date: travelDate,
          };
          dispatch({type: 'SEARCHING_OFFER'});
          const response = await searchOffers(offerEndpoint, params, {
            cancelToken,
            retry: true,
            authWithIdToken: true,
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
        } catch (err) {
          const errorType = getAxiosErrorType(err);
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
    [
      dispatch,
      userProfilesWithCount,
      preassignedFareProduct,
      offerEndpoint,
      zones,
      travelDate,
      fromPlace,
      toPlace,
      isOnBehalfOf
    ],
  );

  useEffect(() => {
    const source = CancelTokenStatic.source();
    updateOffer(source.token);
    return () => source.cancel('Cancelling previous offer search');
  }, [
    dispatch,
    updateOffer,
    userProfilesWithCount,
    preassignedFareProduct,
    zones,
    travelDate,
  ]);

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

function isTariffZone(place: TariffZone | StopPlaceFragment) {
  return 'geometry' in place;
}
