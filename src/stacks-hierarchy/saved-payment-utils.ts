import {useCallback, useEffect, useState} from 'react';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthState} from '@atb/auth';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {PaymentOption} from './types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {parseISO} from 'date-fns';

export function usePreviousPaymentOptions(): {
  recurringPaymentOptions: PaymentOption[] | undefined;
  previousPaymentOption: PaymentOption | undefined;
} {
  const {userId} = useAuthState();
  const {data: recurringPayments} = useListRecurringPaymentsQuery();
  const [previousPaymentOption, setPreviousPaymentOption] =
    useState<PaymentOption>();
  const {paymentTypes} = useFirestoreConfiguration();

  const isValidPaymentOption = useCallback(
    (paymentOption: PaymentOption | undefined) => {
      if (!paymentOption) return false;

      // Since the stored payment could have been deleted, we need to check if
      // it is still in the list of recurring payments.
      const isInRecurringPayments = !!recurringPayments?.find(
        (recurringPayment) =>
          recurringPayment.id === paymentOption.recurringCard?.id,
      );
      if (!isInRecurringPayments) return false;

      // Payment type is not enabled
      if (!paymentTypes.includes(paymentOption.paymentType)) return false;

      // Card has expired
      const expired =
        paymentOption.recurringCard &&
        parseISO(paymentOption.recurringCard.expires_at).getTime() < Date.now();
      if (expired) return false;

      return true;
    },
    [recurringPayments, paymentTypes],
  );

  useEffect(() => {
    if (!userId) {
      setPreviousPaymentOption(undefined);
      return;
    }
    getPreviousPaymentMethodByUser(userId).then((storedMethod) => {
      setPreviousPaymentOption(
        isValidPaymentOption(storedMethod) ? storedMethod : undefined,
      );
    });
  }, [userId, isValidPaymentOption]);

  const recurringPaymentOptions = recurringPayments?.map(
    (recurringPayment): PaymentOption => ({
      savedType: 'recurring',
      paymentType: recurringPayment.payment_type,
      recurringCard: recurringPayment,
    }),
  );

  return {
    recurringPaymentOptions: userId ? recurringPaymentOptions : undefined,
    previousPaymentOption,
  };
}

type StoredPaymentMethods = {
  [key: string]: PaymentOption | undefined;
};

async function getStoredMethods(): Promise<StoredPaymentMethods> {
  try {
    const storedMethodsJson = await storage.get('@ATB_saved_payment_methods');
    if (storedMethodsJson) {
      const methods = JSON.parse(storedMethodsJson) as StoredPaymentMethods;
      if (methods) {
        return methods;
      }
    }
  } catch (err: any) {
    Bugsnag.notify(err);
  }

  return {};
}

async function getPreviousPaymentMethodByUser(
  userId: string,
): Promise<PaymentOption | undefined> {
  const methods = await getStoredMethods();
  return methods[userId];
}

export async function savePreviousPaymentMethodByUser(
  userId: string,
  option: PaymentOption,
): Promise<void> {
  const methods = await getStoredMethods();
  try {
    methods[userId] = option;
    await storage.set('@ATB_saved_payment_methods', JSON.stringify(methods));
  } catch (err: any) {
    Bugsnag.notify(err);
  }
}
