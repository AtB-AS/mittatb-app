import {CancelToken as CancelTokenStatic} from '@atb/api';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {
  FlexDiscountLadder,
  Offer,
  OfferPrice,
  searchOffers,
} from '@atb/ticketing';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';

export type UserProfileWithCountAndOffer = UserProfileWithCount & {
  offer: Offer;
};

export type OfferError = {
  type: ErrorType | 'empty-offers';
};

type OfferState = {
  offerSearchTime?: number;
  isSearchingOffer: boolean;
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
  error: undefined,
  userProfilesWithCountAndOffer: [],
};

export default function useOfferState(
  offerEndpoint: 'zones' | 'authority',
  preassignedFareProduct: PreassignedFareProduct,
  fromTariffZone: TariffZone,
  toTariffZone: TariffZone,
  userProfilesWithCount: UserProfileWithCount[],
  travelDate?: string,
) {
  const offerReducer = getOfferReducer(userProfilesWithCount);
  const [state, dispatch] = useReducer(offerReducer, initialState);
  const zones = useMemo(
    () => [...new Set([fromTariffZone.id, toTariffZone.id])],
    [fromTariffZone, toTariffZone],
  );

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
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
          dispatch({type: 'SEARCHING_OFFER'});
          const response = await searchOffers(
            offerEndpoint,
            {
              zones,
              travellers: offerTravellers,
              products: [preassignedFareProduct.id],
              travel_date: travelDate,
            },
            {cancelToken, retry: true, authWithIdToken: true},
          );

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
          console.warn(err);

          const errorType = getAxiosErrorType(err);
          if (errorType !== 'cancel') {
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
