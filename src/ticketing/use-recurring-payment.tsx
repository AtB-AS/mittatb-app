import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {closeInAppBrowseriOS, openInAppBrowser} from '@atb/in-app-browser';
import {addPaymentMethod} from '@atb/ticketing';
import {APP_SCHEME} from '@env';
import queryString from 'query-string';
import {useCallback, useEffect, useState} from 'react';
import {useDeleteRecurringPaymentMutation} from './use-delete-recurring-payment-mutation';
import {useCancelRecurringPaymentMutation} from './use-cancel-recurring-payment-mutation';
import {useAuthContext} from '@atb/modules/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';

export const useRecurringPayment = () => {
  const [awaitingRecurringPaymentId, setAwaitingRecurringPaymentId] =
    useState<number>();

  const {
    data: recurringPayment,
    refetch: refetchRecurringPayment,
    isError: recurringPaymentError,
    isFetching: recurringPaymentLoading,
  } = useListRecurringPaymentsQuery();

  const {
    mutateAsync: deleteRecurringPayment,
    isError: deleteRecurringPaymentError,
  } = useDeleteRecurringPaymentMutation();

  const {
    mutateAsync: cancelRecurringPayment,
    isError: cancelRecurringPaymentError,
  } = useCancelRecurringPaymentMutation();

  const callback = useCallback(async () => {
    closeInAppBrowseriOS();
    await refetchRecurringPayment();
  }, [refetchRecurringPayment]);

  // In cases where the recurring payment appears in firestore before the
  // callback is called, we can cancel the payment flow and reload the recurring
  // payment list.
  useOnRecurringPaymentReceived({
    recurringPaymentId: awaitingRecurringPaymentId,
    callback,
  });

  const addPaymentMethodCallbackHandler = async (url: string) => {
    if (url.includes('response_code') && url.includes('recurring_payment_id')) {
      const responseCode = queryString.parseUrl(url).query.response_code;
      const paymentId = Number(
        queryString.parseUrl(url).query.recurring_payment_id,
      );
      if (responseCode === 'OK') {
        refetchRecurringPayment();
      } else if (responseCode === 'Cancel') {
        cancelRecurringPayment(paymentId);
      }
    }
  };

  const onAddRecurringPayment = async () => {
    const callbackUrl = `${APP_SCHEME}://payment-method-callback`;
    const {recurringPaymentId, terminalUrl} = await addPaymentMethod(
      callbackUrl,
    );

    setAwaitingRecurringPaymentId(recurringPaymentId);

    await openInAppBrowser(
      terminalUrl,
      'cancel',
      callbackUrl,
      addPaymentMethodCallbackHandler,
    );
  };

  const isError =
    recurringPaymentError ||
    deleteRecurringPaymentError ||
    cancelRecurringPaymentError;

  return {
    recurringPayment,
    onAddRecurringPayment,
    isError,
    recurringPaymentLoading,
    refetchRecurringPayment,
    deleteRecurringPayment,
    recurringPaymentError,
  };
};

const useOnRecurringPaymentReceived = ({
  recurringPaymentId,
  callback,
}: {
  recurringPaymentId: number | undefined;
  callback: () => void;
}) => {
  const {userId} = useAuthContext();

  const mapRecurringPaymentIds = (
    d: FirebaseFirestoreTypes.DocumentSnapshot,
  ): number => {
    const recurringPayment = d.data();
    if (!recurringPayment) {
      throw new Error('No recurring payment data');
    }

    return recurringPayment.id;
  };

  useEffect(() => {
    if (!recurringPaymentId) return;

    const recurringPaymentsUnsub = firestore()
      .collection('customers')
      .doc(userId)
      .collection('recurringPayments')
      .onSnapshot(
        (snapshot) => {
          const recurringPaymentIds = snapshot.docs.map(mapRecurringPaymentIds);
          if (recurringPaymentIds.some((id) => id === recurringPaymentId)) {
            callback();
          }
        },
        (err) => {
          Bugsnag.notify(err, function (event) {
            event.addMetadata('payment', {userId});
          });
        },
      );
    return () => {
      recurringPaymentsUnsub();
    };
  }, [userId, recurringPaymentId, callback]);
};
