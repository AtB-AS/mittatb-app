import {useCallback, useEffect, useState} from 'react';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthState} from '@atb/auth';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {PaymentMethod} from './types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {parseISO} from 'date-fns';

export function usePreviousPaymentMethods(): {
  recurringPaymentMethods: PaymentMethod[] | undefined;
  previousPaymentMethod: PaymentMethod | undefined;
} {
  const {userId} = useAuthState();
  const {data: recurringPayments} = useListRecurringPaymentsQuery();
  const [previousPaymentMethod, setPreviousPaymentMethod] =
    useState<PaymentMethod>();
  const {paymentTypes} = useFirestoreConfiguration();

  const isValidPaymentMethod = useCallback(
    (paymentMethod: PaymentMethod | undefined) => {
      if (!paymentMethod) return false;

      // Since the stored payment could have been deleted, we need to check if
      // it is still in the list of recurring payments.
      if (paymentMethod.recurringCard) {
        const recurringPayment = recurringPayments?.find(
          (recurringPayment) =>
            recurringPayment.id === paymentMethod.recurringCard?.id,
        );
        if (!recurringPayment) return false;
      }

      // Payment type is not enabled
      if (!paymentTypes.includes(paymentMethod.paymentType)) return false;

      // Card has expired
      const expired =
        paymentMethod.recurringCard &&
        parseISO(paymentMethod.recurringCard.expires_at).getTime() < Date.now();
      if (expired) return false;

      return true;
    },
    [recurringPayments, paymentTypes],
  );

  useEffect(() => {
    if (!userId) {
      setPreviousPaymentMethod(undefined);
      return;
    }
    getPreviousPaymentMethodByUser(userId).then((storedMethod) => {
      setPreviousPaymentMethod(
        isValidPaymentMethod(storedMethod) ? storedMethod : undefined,
      );
    });
  }, [userId, isValidPaymentMethod]);

  const recurringPaymentMethods = recurringPayments?.map(
    (recurringPayment): PaymentMethod => ({
      savedType: 'recurring',
      paymentType: recurringPayment.payment_type,
      recurringCard: recurringPayment,
    }),
  );

  return {
    recurringPaymentMethods: userId ? recurringPaymentMethods : undefined,
    previousPaymentMethod: previousPaymentMethod,
  };
}

type StoredPaymentMethods = {
  [key: string]: PaymentMethod | undefined;
};

async function getStoredPaymentMethods(): Promise<StoredPaymentMethods> {
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
): Promise<PaymentMethod | undefined> {
  const methods = await getStoredPaymentMethods();
  return methods[userId];
}

export async function savePreviousPaymentMethodByUser(
  userId: string,
  method: PaymentMethod,
): Promise<void> {
  const methods = await getStoredPaymentMethods();
  try {
    methods[userId] = method;
    await storage.set('@ATB_saved_payment_methods', JSON.stringify(methods));
  } catch (err: any) {
    Bugsnag.notify(err);
  }
}
