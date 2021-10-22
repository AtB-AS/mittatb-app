import {AxiosError} from 'axios';
import {useCallback, useEffect, useReducer, useRef} from 'react';
import {
  WebViewError,
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {parse as parseURL} from 'search-params';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {
  listRecurringPayments,
  PaymentType,
  ReserveOffer,
  reserveOffers,
  TicketReservation,
} from '@atb/tickets';
import {usePreferences} from '@atb/preferences';
import {useAuthState} from '@atb/auth';
import {savePreviousPaymentMethodByUser} from '../../saved-payment-utils';

const possibleResponseCodes = ['Cancel', 'OK'] as const;
type NetsResponseCode = typeof possibleResponseCodes[number];

const isNetsResponseCode = (code: any): code is NetsResponseCode =>
  possibleResponseCodes.includes(code);

export type LoadingState =
  | 'reserving-offer'
  | 'loading-terminal'
  | 'processing-payment';

export type ErrorContext = 'reservation' | 'terminal-loading' | 'capture';

type TerminalReducerState = {
  loadingState?: LoadingState;
  reservation?: TicketReservation;
  paymentResponseCode?: NetsResponseCode;
  error?: {context: ErrorContext; type: ErrorType};
};

type TerminalReducerAction =
  | {type: 'RESTART_TERMINAL'}
  | {type: 'OFFER_RESERVED'; reservation: TicketReservation}
  | {type: 'TERMINAL_LOADED'}
  | {type: 'SET_NETS_RESPONSE_CODE'; responseCode: NetsResponseCode}
  | {type: 'SET_ERROR'; errorType: ErrorType; errorContext: ErrorContext};

type TerminalReducer = (
  prevState: TerminalReducerState,
  action: TerminalReducerAction,
) => TerminalReducerState;

const terminalReducer: TerminalReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTART_TERMINAL': {
      return initialState;
    }
    case 'OFFER_RESERVED': {
      return {
        ...prevState,
        paymentResponseCode: undefined,
        reservation: action.reservation,
        loadingState: 'loading-terminal',
      };
    }
    case 'TERMINAL_LOADED': {
      return {
        ...prevState,
        loadingState: undefined,
      };
    }
    case 'SET_NETS_RESPONSE_CODE': {
      return {
        ...prevState,
        loadingState: 'processing-payment',
        paymentResponseCode: action.responseCode,
      };
    }
    case 'SET_ERROR': {
      return {
        ...prevState,
        loadingState: undefined,
        error: {context: action.errorContext, type: action.errorType},
      };
    }
  }
};

const initialState: TerminalReducerState = {
  loadingState: 'reserving-offer',
};

export default function useTerminalState(
  offers: ReserveOffer[],
  paymentType: PaymentType.VISA | PaymentType.MasterCard,
  recurringPaymentId: number | undefined,
  saveRecurringCard: boolean,
  cancelTerminal: () => void,
  addReservation: (
    reservation: TicketReservation,
    offers: ReserveOffer[],
  ) => void,
) {
  const [
    {paymentResponseCode, reservation, loadingState, error},
    dispatch,
  ] = useReducer(terminalReducer, initialState);

  const {setPreference} = usePreferences();
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
        const response = recurringPaymentId
          ? await reserveOffers({
              offers,
              paymentType: paymentType,
              recurringPaymentId: recurringPaymentId,
              opts: {
                retry: true,
              },
            })
          : await reserveOffers({
              offers,
              paymentType: paymentType,
              savePaymentMethod: saveRecurringCard,
              opts: {
                retry: true,
              },
            });
        dispatch({type: 'OFFER_RESERVED', reservation: response});
      } catch (err) {
        console.warn(err);
        handleAxiosError(err, 'reservation');
      }
    },
    [offers, dispatch, handleAxiosError],
  );

  useEffect(() => {
    if (loadingState === 'reserving-offer') reserveOffer();
  }, [reserveOffer, loadingState]);

  const loadingRef = useRef<boolean>(true);

  const onWebViewLoadEnd = ({
    nativeEvent,
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    const {url} = nativeEvent;

    // load events might be called several times
    // for each type of resource, html, assets, etc
    // so we have a "loading guard" here
    if (loadingRef.current && !url.includes('/ticket/v2/payments/')) {
      loadingRef.current = false;
      if (isWebViewError(nativeEvent)) {
        dispatch({
          type: 'SET_ERROR',
          errorType: 'unknown',
          errorContext: 'terminal-loading',
        });
      } else {
        dispatch({type: 'TERMINAL_LOADED'});
      }
      // "payment redirect guard" here
    } else if (
      !paymentRedirectCompleteRef.current &&
      url.includes('/ticket/v2/payments/')
    ) {
      paymentRedirectCompleteRef.current = true;
      const params = parseURL(url);
      const responseCode = params['responseCode'];
      if (isNetsResponseCode(responseCode))
        dispatch({type: 'SET_NETS_RESPONSE_CODE', responseCode});
      else console.warn('No response code');
    }
  };

  const paymentRedirectCompleteRef = useRef<boolean>(false);

  async function reservationOk(reservation: TicketReservation) {
    if (reservation.recurring_payment_id) {
      if (user?.phoneNumber) {
        let allRecurringPaymentOptions = await listRecurringPayments();
        const card = allRecurringPaymentOptions.find((item) => {
          return item.id === reservation.recurring_payment_id!;
        });
        if (card) {
          savePreviousPaymentMethodByUser(user.uid, {
            savedType: 'recurring',
            paymentType: paymentType,
            recurringCard: card,
          });
        } else {
          savePreviousPaymentMethodByUser(user.uid, {
            savedType: 'normal',
            paymentType: paymentType,
          });
        }
      }
    } else {
      if (user) {
        savePreviousPaymentMethodByUser(user?.uid, {
          savedType: 'normal',
          paymentType: paymentType,
        });
      }
    }
    addReservation(reservation, offers);
  }

  useEffect(() => {
    switch (paymentResponseCode) {
      case 'OK':
        if (!reservation) return;
        reservationOk(reservation);
        break;
      case 'Cancel':
        cancelTerminal();
        break;
    }
  }, [paymentResponseCode]);

  function restartTerminal() {
    loadingRef.current = true;
    paymentRedirectCompleteRef.current = false;
    dispatch({type: 'RESTART_TERMINAL'});
  }

  return {
    terminalUrl: reservation?.url,
    loadingState,
    onWebViewLoadEnd,
    error,
    restartTerminal,
  };
}

const isWebViewError = (
  nativeEvent: WebViewNavigation | WebViewError,
): nativeEvent is WebViewError => 'code' in nativeEvent;
