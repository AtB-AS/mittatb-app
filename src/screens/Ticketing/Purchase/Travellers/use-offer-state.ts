import {SINGLE_TICKET_PRODUCT_ID} from '@env';
import {useCallback, useEffect, useReducer} from 'react';
import {CancelToken, reserveOffers, searchOffers} from '../../../../api';
import {Offer, OfferPrice, PaymentType} from '../../../../api/fareContracts';
import {ErrorType, getAxiosErrorType} from '../../../../api/utils';

type OfferErrorContext = 'failed_offer_search' | 'failed_reservation';

export type OfferError = {
  context: OfferErrorContext;
  type: ErrorType;
};

type OfferState = {
  count: number;
  offerId?: string;
  isSearchingOffer: boolean;
  isReservingOffer: boolean;
  totalPrice: number;
  error?: OfferError;
};

type OfferReducerAction =
  | {
      type: 'SET_OFFER';
      offer: Offer;
    }
  | {type: 'INCREMENT_COUNT'}
  | {type: 'DECREMENT_COUNT'}
  | {type: 'SET_ERROR'; error: OfferError};

type OfferReducer = (
  prevState: OfferState,
  action: OfferReducerAction,
) => OfferState;

const getCurrencyAsFloat = (prices: OfferPrice[], currency: string) =>
  prices.find((p) => p.currency === currency)?.amount_float ?? 0;

const offerReducer: OfferReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_OFFER':
      return {
        ...prevState,
        offerId: action.offer.offer_id,
        isSearchingOffer: false,
        totalPrice:
          getCurrencyAsFloat(action.offer.prices, 'NOK') * prevState.count,
        error: undefined,
      };
    case 'INCREMENT_COUNT': {
      return {
        ...prevState,
        count: prevState.count + 1,
        isSearchingOffer: true,
        totalPrice: 0,
      };
    }
    case 'DECREMENT_COUNT': {
      if (prevState.count > 1) {
        return {
          ...prevState,
          count: prevState.count - 1,
          isSearchingOffer: true,
          totalPrice: 0,
        };
      }

      return prevState;
    }
    case 'SET_ERROR': {
      return {
        ...prevState,
        error: action.error,
      };
    }
  }
};

const initialState: OfferState = {
  count: 1,
  isSearchingOffer: true,
  isReservingOffer: false,
  offerId: undefined,
  totalPrice: 0,
  error: undefined,
};

export default function useOfferState() {
  const [{count, ...state}, dispatch] = useReducer(offerReducer, initialState);

  const addCount = useCallback(() => dispatch({type: 'INCREMENT_COUNT'}), [
    dispatch,
  ]);
  const removeCount = useCallback(() => dispatch({type: 'DECREMENT_COUNT'}), [
    dispatch,
  ]);

  // const reserveOffer = useCallback(
  //   async function reserveOffer(paymentType: PaymentType) {
  //     if (offer) {
  //       const {offer_id} = offer;
  //       try {
  //         return await reserveOffers([{offer_id, count}], paymentType, {
  //           retry: true,
  //         });
  //       } catch (err) {
  //         console.warn(err);
  //         dispatch({
  //           type: 'SET_ERROR',
  //           error: {
  //             context: 'failed_reservation',
  //             type: getAxiosErrorType(err),
  //           },
  //         });
  //       }
  //     }
  //   },
  //   [offer],
  // );

  useEffect(() => {
    const source = CancelToken.source();
    async function getOffers() {
      try {
        const response = await searchOffers(
          ['ATB:TariffZone:1'],
          [
            {
              id: 'adult_group',
              user_type: 'ADULT',
              count,
            },
          ],
          [SINGLE_TICKET_PRODUCT_ID],
          {cancelToken: source.token, retry: true},
        );

        source.token.throwIfRequested();

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
    }
    getOffers();
    return () => source.cancel('Cancelling previous offer search');
  }, [count]);

  return {
    ...state,
    count,
    addCount,
    removeCount,
  };
}
