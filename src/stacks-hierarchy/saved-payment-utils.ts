import {useEffect, useState} from 'react';
import {
  RecurringPaymentOption,
  RecurringPaymentWithoutCardOption,
  SavedPaymentOption,
} from './types';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {listRecurringPayments} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';

async function getCardFromRecurringPaymentId(
  previousPaymentMethod: RecurringPaymentWithoutCardOption,
  userId?: string,
): Promise<RecurringPaymentOption | undefined> {
  const {paymentType, recurringPaymentId} = previousPaymentMethod;

  if (!userId || !recurringPaymentId) return undefined;

  const allRecurringPaymentOptions = await listRecurringPayments();
  const card = allRecurringPaymentOptions.find((item) => {
    return item.id === recurringPaymentId;
  });

  if (card) {
    await savePreviousPaymentMethodByUser(userId, {
      savedType: 'recurring',
      paymentType,
      recurringCard: card,
    });
    return {
      savedType: 'recurring',
      paymentType,
      recurringCard: card,
    };
  } else return undefined;
}

export function usePreviousPaymentMethod(): SavedPaymentOption | undefined {
  const [paymentMethod, setPaymentMethod] = useState<
    SavedPaymentOption | undefined
  >(undefined);
  const {userId} = useAuthState();

  useEffect(() => {
    async function run(uid: string) {
      const method = await getPreviousPaymentMethodByUser(uid);
      if (method?.savedType === 'recurring-without-card') {
        const furtherPaymentDetails = await getCardFromRecurringPaymentId(
          method,
          userId,
        );
        setPaymentMethod(furtherPaymentDetails);
      } else {
        setPaymentMethod(method);
      }
    }

    if (!userId) {
      setPaymentMethod(undefined);
      return;
    } else {
      run(userId);
    }
  }, [userId]);

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
