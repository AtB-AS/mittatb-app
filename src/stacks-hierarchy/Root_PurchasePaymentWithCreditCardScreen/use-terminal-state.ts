import {AxiosError} from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {WebViewNavigation} from 'react-native-webview/lib/WebViewTypes';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {
  cancelPayment,
  getResponseCode,
  listRecurringPayments,
  OfferReservation,
  PaymentType,
  ReserveOffer,
  reserveOffers,
} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {savePreviousPaymentMethodByUser} from '../saved-payment-utils';
import Bugsnag from '@bugsnag/react-native';

export type ErrorContext = 'reservation' | 'terminal-loading' | 'capture';

type PaymentError = {context: ErrorContext; type: ErrorType};

export function useTerminalState(
  offers: ReserveOffer[],
  paymentType: PaymentType.Visa | PaymentType.Mastercard,
  recurringPaymentId: number | undefined,
  saveRecurringCard: boolean,
  destinationAccountId: string | undefined,
  cancelTerminal: () => void,
) {
  const [isLoading, setIsLoading] = useState(true);
  const [reservation, setReservation] = useState<OfferReservation>();
  const [error, setError] = useState<PaymentError>();

  const {userId, phoneNumber, abtCustomerId} = useAuthState();

  const handleAxiosError = useCallback(function (
    err: AxiosError | unknown,
    errorContext: ErrorContext,
  ) {
    const errorType = getAxiosErrorType(err);

    if (errorType !== 'cancel') {
      setError({type: errorType, context: errorContext});
    }
  },
  []);
  const targetCustomerId = destinationAccountId
    ? destinationAccountId
    : abtCustomerId;

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
              customerAccountId: targetCustomerId!,
            })
          : await reserveOffers({
              offers,
              paymentType: paymentType,
              savePaymentMethod: saveRecurringCard,
              opts: {
                retry: true,
              },
              scaExemption: true,
              customerAccountId: targetCustomerId!,
            });
        setReservation(response);
      } catch (err) {
        console.warn(err);
        handleAxiosError(err, 'reservation');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offers, handleAxiosError],
  );

  useEffect(() => {
    reserveOffer();
  }, [reserveOffer]);

  const onWebViewLoadEnd = () => {
    setIsLoading(false);
  };

  const onWebViewNavigationChange = (event: WebViewNavigation) => {
    const {url} = event;
    if (url.includes('/ticket/v3/payments/')) {
      const responseCode = getResponseCode(event);
      if (responseCode === 'Cancel') {
        cancel();
        cancelTerminal();
      } else if (responseCode === 'OK') {
        if (!reservation) return;
        savePaymentMethod(saveRecurringCard, reservation.recurring_payment_id);
      }
    }
  };

  function onWebViewError() {
    setError({type: 'unknown', context: 'terminal-loading'});
  }

  async function savePaymentMethod(
    saveRecurringCard: boolean,
    recurringPaymentId?: number,
  ) {
    if (recurringPaymentId) {
      if (userId && phoneNumber) {
        const existingMethods = await listRecurringPayments();
        const alreadyAddedRecurringCard = existingMethods.find((item) => {
          return item.id === recurringPaymentId;
        });
        if (alreadyAddedRecurringCard) {
          savePreviousPaymentMethodByUser(userId, {
            savedType: 'recurring',
            paymentType: paymentType,
            recurringCard: alreadyAddedRecurringCard,
          });
        }

        if (saveRecurringCard) {
          const checkIfRecurringCardHasBeenSavedAtEntur = async (
            recurringPaymentId: number,
          ) => {
            const allRecurringPaymentOptions = await listRecurringPayments();
            const card = allRecurringPaymentOptions.find((item) => {
              return item.id === recurringPaymentId;
            });

            if (card) {
              savePreviousPaymentMethodByUser(userId, {
                savedType: 'recurring',
                paymentType: paymentType,
                recurringCard: card,
              });
            } else {
              savePreviousPaymentMethodByUser(userId, {
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
      if (userId) {
        savePreviousPaymentMethodByUser(userId, {
          savedType: 'normal',
          paymentType: paymentType,
        });
      }
    }
  }

  function restartTerminal() {
    setIsLoading(true);
    setReservation(undefined);
    setError(undefined);
    reserveOffer();
  }

  async function cancel() {
    Bugsnag.leaveBreadcrumb('terminal_cancelled');
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
    isLoading,
    onWebViewLoadEnd,
    onWebViewNavigationChange,
    error,
    restartTerminal,
    cancelPayment: cancel,
    onWebViewError,
  };
}
