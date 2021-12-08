import {AxiosError} from 'axios';
import {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {
  WebViewError,
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
  WebViewHttpErrorEvent,
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
  isSoftDecline?: boolean;
  error?: {context: ErrorContext; type: ErrorType};
};

type TerminalReducerAction =
  | {type: 'RESTART_TERMINAL'}
  | {type: 'TRIGGER_BANK_ID_VERIFICATION'}
  | {type: 'OFFER_RESERVED'; reservation: TicketReservation}
  | {type: 'TERMINAL_LOADED'}
  | {type: 'SET_SOFT_DECLINE'; isSoftDecline: boolean}
  | {
      type: 'SET_NETS_RESPONSE_CODE';
      responseCode: NetsResponseCode;
    }
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
    case 'TRIGGER_BANK_ID_VERIFICATION': {
      return {
        ...prevState,
        loadingState: undefined,
        paymentResponseCode: undefined,
        isSoftDecline: undefined,
        reservation: {
          ...prevState.reservation!,
          url: prevState.reservation!.url + ' ', // hack to make the webview reload the terminal url for bankid verification
        },
      };
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
    case 'SET_SOFT_DECLINE': {
      return {
        ...prevState,
        isSoftDecline: action.isSoftDecline,
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
  scaExemption: boolean,
) {
  const [
    {paymentResponseCode, isSoftDecline, reservation, loadingState, error},
    dispatch,
  ] = useReducer(terminalReducer, initialState);

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
              scaExemption,
            })
          : await reserveOffers({
              offers,
              paymentType: paymentType,
              savePaymentMethod: saveRecurringCard,
              opts: {
                retry: true,
              },
              scaExemption,
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

  function handleInitialLoadingError(
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) {
    if (isWebViewError(event.nativeEvent)) {
      dispatch({
        type: 'SET_ERROR',
        errorType: 'unknown',
        errorContext: 'terminal-loading',
      });
    } else {
      dispatch({type: 'TERMINAL_LOADED'});
    }
  }

  function handlePaymentCallback(
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) {
    const params = parseURL(event.nativeEvent.url);
    const responseCode = params['responseCode'];
    if (isNetsResponseCode(responseCode))
      dispatch({type: 'SET_NETS_RESPONSE_CODE', responseCode});
  }

  const onWebViewLoadEnd = (
    event: WebViewNavigationEvent | WebViewErrorEvent,
  ) => {
    const {url} = event.nativeEvent;
    // load events might be called several times
    // for each type of resource, html, assets, etc
    // so we have a "loading guard" here
    if (loadingRef.current && !url.includes('/ticket/v2/payments/')) {
      loadingRef.current = false;
      handleInitialLoadingError(event);
      // "payment redirect guard" here
    } else if (
      !paymentRedirectCompleteRef.current &&
      url.includes('/ticket/v2/payments/')
    ) {
      paymentRedirectCompleteRef.current = true;
      handlePaymentCallback(event);
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
        savePreviousPaymentMethodByUser(user.uid, {
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

        if (!scaExemption) {
          reservationOk(reservation);
        }

        if (isSoftDecline === undefined) return;

        if (!isSoftDecline) {
          reservationOk(reservation);
        } else {
          triggerBankIdVerification();
        }

        break;
      case 'Cancel':
        cancelTerminal();
        break;
    }
  }, [paymentResponseCode, isSoftDecline]);

  function triggerBankIdVerification() {
    dispatch({type: 'TRIGGER_BANK_ID_VERIFICATION'});
  }

  function restartTerminal() {
    loadingRef.current = true;
    paymentRedirectCompleteRef.current = false;
    dispatch({type: 'RESTART_TERMINAL'});
  }

  function setIsSoftDecline(isSoftDecline: boolean) {
    dispatch({type: 'SET_SOFT_DECLINE', isSoftDecline});
  }

  return {
    terminalUrl: reservation?.url,
    loadingState,
    onWebViewLoadEnd,
    error,
    restartTerminal,
    setIsSoftDecline,
  };
}

const isWebViewError = (
  nativeEvent: WebViewNavigation | WebViewError,
): nativeEvent is WebViewError => 'code' in nativeEvent;
