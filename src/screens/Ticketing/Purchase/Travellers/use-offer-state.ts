import {SINGLE_TICKET_PRODUCT_ID} from '@env';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {CancelToken as CancelTokenStatic, searchOffers} from '../../../../api';
import {Offer, OfferPrice, ReserveOffer} from '../../../../api/fareContracts';
import {ErrorType, getAxiosErrorType} from '../../../../api/utils';
import {TravellerWithCount} from './traveller-types';

type OfferErrorContext = 'failed_offer_search' | 'failed_reservation';

export type OfferError = {
  context: OfferErrorContext;
  type: ErrorType;
};

type OfferState = {
  offerSearchTime?: number;
  isSearchingOffer: boolean;
  totalPrice: number;
  offers: ReserveOffer[];
  error?: OfferError;
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
  travellers: TravellerWithCount[],
  offers: Offer[],
) =>
  travellers.reduce((total, traveller) => {
    const maybeOffer = offers.find((o) => o.traveller_id === traveller.type);
    const price = maybeOffer
      ? getCurrencyAsFloat(maybeOffer.prices, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

const mapToReserveOffers = (
  travellers: TravellerWithCount[],
  offers: Offer[],
): ReserveOffer[] =>
  travellers
    .map((traveller) => ({
      count: traveller.count,
      offer_id: offers.find((o) => o.traveller_id === traveller.type)?.offer_id,
    }))
    .filter(
      (countAndOffer): countAndOffer is ReserveOffer =>
        countAndOffer.offer_id != null,
    );

const getOfferReducer = (travellers: TravellerWithCount[]): OfferReducer => (
  prevState,
  action,
): OfferState => {
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
        offers: [],
      };
    case 'SET_OFFER':
      return {
        ...prevState,
        offerSearchTime: Date.now(),
        isSearchingOffer: false,
        totalPrice: calculateTotalPrice(travellers, action.offers),
        offers: mapToReserveOffers(travellers, action.offers),
        error: undefined,
      };
    case 'SET_ERROR': {
      return {
        ...prevState,
        error: action.error,
      };
    }
  }
};

const initialState: OfferState = {
  isSearchingOffer: false,
  offerSearchTime: undefined,
  totalPrice: 0,
  error: undefined,
  offers: [],
};

export default function useOfferState(travellers: TravellerWithCount[]) {
  const offerReducer = getOfferReducer(travellers);
  const [state, dispatch] = useReducer(offerReducer, initialState);

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
      const offerTravellers = travellers
        .filter((t) => t.count)
        .map((t) => ({
          id: t.type,
          user_type: t.type,
          count: t.count,
        }));

      if (!offerTravellers.length) {
        dispatch({type: 'CLEAR_OFFER'});
      } else {
        try {
          dispatch({type: 'SEARCHING_OFFER'});
          const response = await searchOffers(
            {
              zones: ['ATB:TariffZone:1'],
              travellers: offerTravellers,
              products: [SINGLE_TICKET_PRODUCT_ID],
            },
            {cancelToken, retry: true},
          );

          cancelToken?.throwIfRequested();

          dispatch({type: 'SET_OFFER', offers: response});
        } catch (err) {
          console.warn(err);

          const errorType = getAxiosErrorType(err);
          if (errorType !== 'cancel') {
            dispatch({
              type: 'SET_ERROR',
              error: {
                context: 'failed_offer_search',
                type: errorType,
              },
            });
          }
        }
      }
    },
    [dispatch, travellers],
  );

  useEffect(() => {
    const source = CancelTokenStatic.source();
    updateOffer(source.token);
    return () => source.cancel('Cancelling previous offer search');
  }, [updateOffer, travellers]);

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
