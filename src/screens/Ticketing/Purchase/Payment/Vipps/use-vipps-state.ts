import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {ReserveOffer, reserveOffers, TicketReservation} from '@atb/tickets';
import {AxiosError} from 'axios';
import {useCallback, useEffect, useReducer} from 'react';
import {Linking} from 'react-native';

export type State = 'reserving-offer' | 'offer-reserved' | 'opened-vipps-app';

export type ErrorContext = 'reserve-offer' | 'open-vipps-url';

type VippsReducerState = {
  state: State;
  reservation?: TicketReservation;
  error?: {context: ErrorContext; type: ErrorType};
};

type VippsReducerAction =
  | {type: 'RESTART_RESERVATION'}
  | {type: 'OFFER_RESERVED'; reservation: TicketReservation}
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
  activatePolling: (
    reservation: TicketReservation,
    offers: ReserveOffer[],
  ) => void,
) {
  const [{state, error, reservation}, dispatch] = useReducer(
    vippsReducer,
    initialState,
  );

  const handleAxiosError = useCallback(
    function (err: AxiosError, errorContext: ErrorContext) {
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
        const response = await reserveOffers(offers, 'vipps', {
          retry: true,
        });

        dispatch({type: 'OFFER_RESERVED', reservation: response});
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

      if (await Linking.canOpenURL(url)) {
        dispatch({type: 'VIPPS_APP_OPENED'});
        Linking.openURL(url);
      } else {
        dispatch({
          type: 'SET_ERROR',
          errorContext: 'open-vipps-url',
          errorType: 'unknown',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reservation?.url],
  );

  useEffect(() => {
    if (state === 'offer-reserved' && reservation) {
      activatePolling(reservation, offers);
      openVipps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, openVipps, offers]);

  return {
    state,
    error,
    openVipps,
  };
}
