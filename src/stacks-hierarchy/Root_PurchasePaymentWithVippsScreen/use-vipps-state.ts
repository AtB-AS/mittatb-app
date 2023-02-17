import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useAuthState} from '@atb/auth';
import {
  OfferReservation,
  PaymentType,
  ReserveOffer,
  reserveOffers,
} from '@atb/ticketing';
import {AxiosError} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {Linking} from 'react-native';
import {savePreviousPaymentMethodByUser} from '../saved-payment-utils';

export type State = 'reserving-offer' | 'offer-reserved' | 'opened-vipps-app';

export type ErrorContext = 'reserve-offer' | 'open-vipps-url';

type VippsReducerState = {
  state: State;
  reservation?: OfferReservation;
  error?: {context: ErrorContext; type: ErrorType};
};

type VippsReducerAction =
  | {type: 'RESTART_RESERVATION'}
  | {type: 'OFFER_RESERVED'; reservation: OfferReservation}
  | {type: 'VIPPS_APP_OPENED'}
  | {type: 'SET_ERROR'; errorType: ErrorType; errorContext: ErrorContext};

type VippsReducer = (
  prevState: VippsReducerState,
  action: VippsReducerAction,
) => VippsReducerState;

const vippsReducer: VippsReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTART_RESERVATION': {
      return initialState;
    }
    case 'OFFER_RESERVED': {
      return {
        ...prevState,
        reservation: action.reservation,
        state: 'offer-reserved',
      };
    }
    case 'VIPPS_APP_OPENED': {
      return {
        ...prevState,
        state: 'opened-vipps-app',
      };
    }
    case 'SET_ERROR': {
      return {
        ...prevState,
        error: {context: action.errorContext, type: action.errorType},
      };
    }
  }
};

const initialState: VippsReducerState = {
  state: 'reserving-offer',
};

export default function useVippsState(
  offers: ReserveOffer[],
  dismiss: () => void,
) {
  const [{state, error, reservation}, dispatch] = useReducer(
    vippsReducer,
    initialState,
  );
  const {user} = useAuthState();

  const handleAxiosError = useCallback(
    function (err: AxiosError | unknown, errorContext: ErrorContext) {
      const errorType = getAxiosErrorType(err);
      if (errorType !== 'cancel') {
        dispatch({
          type: 'SET_ERROR',
          errorType: errorType,
          errorContext,
        });
      }
    },
    [dispatch],
  );

  const reserveOffer = useCallback(
    async function () {
      try {
        const response = await reserveOffers({
          offers,
          paymentType: PaymentType.Vipps,
          savePaymentMethod: false,
          opts: {
            retry: true,
          },
          scaExemption: false,
        });
        dispatch({type: 'OFFER_RESERVED', reservation: response});
        if (user) {
          savePreviousPaymentMethodByUser(user.uid, {
            savedType: 'normal',
            paymentType: PaymentType.Vipps,
          });
        }
      } catch (err) {
        console.warn(err);
        handleAxiosError(err, 'reserve-offer');
      }
    },
    [offers, dispatch, handleAxiosError],
  );

  useEffect(() => {
    if (state === 'reserving-offer') reserveOffer();
  }, [reserveOffer, state]);

  const openVipps = useCallback(
    async function () {
      if (!reservation) return;
      const {url} = reservation;

      try {
        dispatch({type: 'VIPPS_APP_OPENED'});
        await Linking.openURL(url);
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          errorContext: 'open-vipps-url',
          errorType: 'unknown',
        });
      }
    },
    [reservation?.url],
  );

  useEffect(() => {
    if (state === 'offer-reserved' && reservation) {
      dismiss();
      openVipps();
    }
  }, [state, openVipps]);

  return {
    state,
    error,
    openVipps,
  };
}
