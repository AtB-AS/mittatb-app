import {SINGLE_TICKET_PRODUCT_ID} from '@env';
import {CancelToken} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {CancelToken as CancelTokenStatic, searchOffers} from '../../../../api';
import {Offer, OfferPrice} from '../../../../api/fareContracts';
import {ErrorType, getAxiosErrorType} from '../../../../api/utils';
import {TravellerWithCount} from '../traveller-types';

type OfferErrorContext = 'failed_offer_search' | 'failed_reservation';

export type OfferError = {
  context: OfferErrorContext;
  type: ErrorType;
};

type OfferState = {
  offerId?: string;
  offerSearchTime?: number;
  isSearchingOffer: boolean;
  totalPrice: number;
  error?: OfferError;
};

type OfferReducerAction =
  | {
      type: 'SET_OFFER';
      offer: Offer;
    }
  | {type: 'SET_ERROR'; error: OfferError};

type OfferReducer = (
  prevState: OfferState,
  action: OfferReducerAction,
) => OfferState;

const getCurrencyAsFloat = (prices: OfferPrice[], currency: string) =>
  prices.find((p) => p.currency === currency)?.amount_float ?? 0;

const createOfferReducer = (travellers: TravellerWithCount[]): OfferReducer => (
  prevState,
  action,
) => {
  switch (action.type) {
    case 'SET_OFFER':
      return {
        ...prevState,
        offerId: action.offer.offer_id,
        offerSearchTime: Date.now(),
        isSearchingOffer: false,
        totalPrice:
          getCurrencyAsFloat(action.offer.prices, 'NOK') *
          travellers.find((t) => t.type === 'ADULT')!.count,
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
  isSearchingOffer: true,
  offerId: undefined,
  offerSearchTime: undefined,
  totalPrice: 0,
  error: undefined,
};

export default function useOfferState(travellers: TravellerWithCount[]) {
  const offerReducer = createOfferReducer(travellers);
  const [state, dispatch] = useReducer(offerReducer, initialState);

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
      try {
        const response = await searchOffers(
          {
            zones: ['ATB:TariffZone:1'],
            travellers: [
              {
                id: 'adult_group',
                user_type: 'ADULT',
                // TODO
                count: travellers.find((t) => t.type === 'ADULT')!.count,
              },
            ],
            products: [SINGLE_TICKET_PRODUCT_ID],
          },
          {cancelToken, retry: true},
        );

        cancelToken?.throwIfRequested();

        const offer = response?.[0];

        dispatch({type: 'SET_OFFER', offer});
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
    },
    [dispatch],
  );

  useEffect(() => {
    const source = CancelTokenStatic.source();
    updateOffer(source.token);
    return () => source.cancel('Cancelling previous offer search');
  }, [updateOffer]);

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
