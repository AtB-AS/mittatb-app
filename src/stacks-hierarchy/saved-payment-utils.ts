import {useEffect, useState} from 'react';
import {SavedPaymentOption} from './types';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthState} from '@atb/auth';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {RecurringPayment} from '@atb/ticketing';

export function usePreviousPaymentMethods(): {
  recurringPayments: RecurringPayment[] | undefined;
  savedPaymentMethod: SavedPaymentOption | undefined;
} {
  const {userId} = useAuthState();
  const {data: recurringPayments} = useListRecurringPaymentsQuery();
  const [savedPaymentMethod, setSavedPaymentMethod] =
    useState<SavedPaymentOption>();

  useEffect(() => {
    if (!userId) {
      setSavedPaymentMethod(undefined);
    } else {
      getPreviousPaymentMethodByUser(userId).then((method) => {
        setSavedPaymentMethod(method);
      });
    }
  }, [userId]);

  return {
    recurringPayments,
    savedPaymentMethod,
  };
}

type StoredPaymentMethods = {
  [key: string]: SavedPaymentOption | undefined;
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
): Promise<SavedPaymentOption | undefined> {
  const methods = await getStoredMethods();
  return methods[userId];
}

export async function savePreviousPaymentMethodByUser(
  userId: string,
  option: SavedPaymentOption,
): Promise<void> {
  const methods = await getStoredMethods();
  try {
    methods[userId] = option;
    await storage.set('@ATB_saved_payment_methods', JSON.stringify(methods));
  } catch (err: any) {
    Bugsnag.notify(err);
  }
}
