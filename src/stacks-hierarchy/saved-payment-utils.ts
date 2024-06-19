import {useEffect, useState} from 'react';
import {SavedPaymentOption} from './types';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthState} from '@atb/auth';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';

export function usePreviousPaymentMethod(): SavedPaymentOption | undefined {
  const [paymentMethod, setPaymentMethod] = useState<
    SavedPaymentOption | undefined
  >(undefined);
  const {userId} = useAuthState();

  const {data: recurringPayments} = useListRecurringPaymentsQuery();

  useEffect(() => {
    async function run(uid: string) {
      const savedMethod = await getPreviousPaymentMethodByUser(uid);
      if (
        recurringPayments &&
        savedMethod &&
        savedMethod.savedType === 'recurring'
      ) {
        const method = recurringPayments.find(
          (recurringPayment) =>
            recurringPayment.id === savedMethod.recurringCard.id,
        );
        if (method) setPaymentMethod(savedMethod);
      } else {
        setPaymentMethod(savedMethod);
      }
    }

    if (!userId) {
      setPaymentMethod(undefined);
      return;
    } else {
      run(userId);
    }
  }, [recurringPayments, userId]);

  return paymentMethod;
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
