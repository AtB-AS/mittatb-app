import {useEffect, useState} from 'react';
import {SavedPaymentOption} from './types';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthState} from '@atb/auth';

export function usePreviousPaymentMethod(): SavedPaymentOption | undefined {
  const [paymentMethod, setPaymentMethod] = useState<
    SavedPaymentOption | undefined
  >(undefined);
  const {userId} = useAuthState();

  useEffect(() => {
    async function run(uid: string) {
      const method = await getPreviousPaymentMethodByUser(uid);
      setPaymentMethod(method);
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

export async function deleteSavedPaymentMethodByUser(
  userId: string | undefined,
  paymentId: number,
): Promise<void> {
  try {
    if (userId) {
      const methods = await getStoredMethods();
      const paymentForUserId = methods[userId];
      if (paymentForUserId && paymentForUserId.savedType === 'recurring') {
        if (paymentForUserId.recurringCard.id === paymentId) {
          delete methods[userId];
          await storage.set(
            '@ATB_saved_payment_methods',
            JSON.stringify(methods),
          );
        }
      }
    }
  } catch (err: any) {
    Bugsnag.notify(err);
  }
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
