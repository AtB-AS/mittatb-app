import {AxiosError} from 'axios';
import {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {
  WebViewError,
  WebViewErrorEvent,
  WebViewNavigation,
} from 'react-native-webview/lib/WebViewTypes';
import {parse as parseURL} from 'search-params';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {
  cancelPayment,
  listRecurringPayments,
  PaymentType,
  ReserveOffer,
  reserveOffers,
  TicketReservation,
} from '@atb/tickets';
import {usePreferences} from '@atb/preferences';
import {useAuthState} from '@atb/auth';
import {savePreviousPaymentMethodByUser} from '../../saved-payment-utils';
import Bugsnag from '@bugsnag/react-native';

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
  | {type: 'VERIFYING_BANK_ID'}
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
    case 'VERIFYING_BANK_ID': {
      return {
        ...prevState,
        loadingState: 'processing-payment',
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
  paymentType: PaymentType.Visa | PaymentType.Mastercard,
  recurringPaymentId: number | undefined,
  saveRecurringCard: boolean,
  cancelTerminal: () => void,
) {
  const [{paymentResponseCode, reservation, loadingState, error}, dispatch] =
    useReducer(terminalReducer, initialState);

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
              scaExemption: true,
            })
          : await reserveOffers({
              offers,
              paymentType: paymentType,
              savePaymentMethod: saveRecurringCard,
              opts: {
                retry: true,
              },
              scaExemption: true,
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

  const initialLoadRef = useRef<boolean>(true);
  const redirectToPaymentCaptureRef = useRef<boolean>(false);
  const verifyingBankIdRef = useRef<boolean>(false);

  function handleInitialLoadingError(event: WebViewErrorEvent) {
    dispatch({
      type: 'SET_ERROR',
      errorType: 'unknown',
      errorContext: 'terminal-loading',
    });
  }

  function handlePaymentCallback(event: WebViewNavigation) {
    const params = parseURL(event.url);
    const responseCode = params['responseCode'];
    if (isNetsResponseCode(responseCode))
      dispatch({type: 'SET_NETS_RESPONSE_CODE', responseCode});
  }

  function handleVerifyingBankId() {
    dispatch({type: 'VERIFYING_BANK_ID'});
  }

  const onWebViewLoadEnd = (event: WebViewNavigation) => {
    const {url} = event;

    // load events might be called several times
    // for each type of resource, html, assets, etc
    // so we have a "loading guard" here

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      dispatch({type: 'TERMINAL_LOADED'});
    } else if (!redirectToPaymentCaptureRef.current) {
      if (url.includes('/ticket/v2/payments/')) {
        redirectToPaymentCaptureRef.current = true;
        handlePaymentCallback(event);
      }
    } else if (url === reservation?.url) {
      // we have already redirected to payment callback
      // which redirected back to terminal-URL because
      // of SoftDecline
      verifyingBankIdRef.current = true;
    } else if (
      verifyingBankIdRef.current &&
      url.includes('/ticket/v2/payments/')
    ) {
      handleVerifyingBankId();
    }
  };

  async function savePaymentMethod(
    saveRecurringCard: boolean,
    recurringPaymentId?: number,
  ) {
    if (recurringPaymentId) {
      if (user?.phoneNumber) {
        const existingMethods = await listRecurringPayments();
        const alreadyAddedRecurringCard = existingMethods.find((item) => {
          return item.id === recurringPaymentId;
        });
        if (alreadyAddedRecurringCard) {
          savePreviousPaymentMethodByUser(user.uid, {
            savedType: 'recurring',
            paymentType: paymentType,
            recurringCard: alreadyAddedRecurringCard,
          });
        }

        if (saveRecurringCard) {
          const checkIfRecurringCardHasBeenSavedAtEntur = async (
            recurringPaymentId: number,
          ) => {
            let allRecurringPaymentOptions = await listRecurringPayments();
            const card = allRecurringPaymentOptions.find((item) => {
              return item.id === recurringPaymentId;
            });

            if (card) {
              savePreviousPaymentMethodByUser(user.uid, {
                savedType: 'recurring',
                paymentType: paymentType,
                recurringCard: card,
              });
            } else {
              savePreviousPaymentMethodByUser(user.uid, {
                savedType: 'recurring-without-card',
                paymentType: paymentType,
                recurringPaymentId: recurringPaymentId,
              });
            }
          };

          checkIfRecurringCardHasBeenSavedAtEntur(recurringPaymentId);
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
  }

  useEffect(() => {
    switch (paymentResponseCode) {
      case 'OK':
        if (!reservation) return;
        savePaymentMethod(saveRecurringCard, reservation.recurring_payment_id);
        break;
      case 'Cancel':
        cancelTerminal();
        break;
    }
  }, [paymentResponseCode]);

  function resetOnLoadGuards() {
    initialLoadRef.current = true;
    redirectToPaymentCaptureRef.current = false;
    verifyingBankIdRef.current = false;
  }

  function restartTerminal() {
    resetOnLoadGuards();
    dispatch({type: 'RESTART_TERMINAL'});
  }

  async function cancel() {
    if (reservation) {
      try {
        await cancelPayment(reservation.payment_id, reservation.transaction_id);
      } catch (err: any) {
        Bugsnag.notify(err);
      }
    }
  }

  return {
    terminalUrl: reservation?.url,
    loadingState,
    onWebViewLoadEnd,
    error,
    restartTerminal,
    cancelPayment: cancel,
    handleInitialLoadingError,
  };
}
