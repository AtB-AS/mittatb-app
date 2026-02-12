import {useCallback, useEffect, useMemo, useState} from 'react';
import {storage, StorageModelKeysEnum} from '@atb/modules/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthContext} from '@atb/modules/auth';
import {useListRecurringPaymentsQuery} from '@atb/modules/ticketing';
import {PaymentMethod} from './types';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {parseISO} from 'date-fns';
import {PaymentType, listRecurringPayments} from '@atb/modules/ticketing';
import {onlyUniques} from '@atb/utils/only-uniques';
import {isNonRecurringPaymentType} from './utils';

export function usePreviousPaymentMethods(): {
  recurringPaymentMethods: PaymentMethod[] | undefined;
  previousPaymentMethod: PaymentMethod | undefined;
} {
  const {userId} = useAuthContext();
  const {data: recurringPayments} = useListRecurringPaymentsQuery();
  const [previousPaymentMethod, setPreviousPaymentMethod] =
    useState<PaymentMethod>();
  const {paymentTypes} = useFirestoreConfigurationContext();

  const isValidPaymentMethod = useCallback(
    (paymentMethod: PaymentMethod | undefined) => {
      if (!paymentMethod) return false;

      // Since the payment method could have been deleted, we need to check if
      // it is still in the list of recurring payments.
      if (paymentMethod.recurringPayment) {
        const recurringPayment = recurringPayments?.find(
          (recurringPayment) =>
            recurringPayment.id === paymentMethod.recurringPayment?.id,
        );
        if (!recurringPayment) return false;
      }

      // If a payment card PaymentType is enabled, add PaymentCard to the list
      // of enabled payment types.
      const enabledPaymentTypes: PaymentType[] =
        paymentTypes.filter(onlyUniques);
      if (hasPaymentCard(paymentTypes)) {
        enabledPaymentTypes.push(PaymentType.PaymentCard);
      }
      // Payment type is not enabled
      if (!enabledPaymentTypes.includes(paymentMethod.paymentType))
        return false;

      if (paymentMethod.recurringPayment) {
        const now = Date.now();
        // Card registration has expired
        if (parseISO(paymentMethod.recurringPayment.expiresAt).getTime() < now)
          return false;
        // Card has expired
        if (
          parseISO(paymentMethod.recurringPayment.cardExpiresAt).getTime() < now
        )
          return false;
      }

      return true;
    },
    [recurringPayments, paymentTypes],
  );

  useEffect(() => {
    if (!userId) {
      setPreviousPaymentMethod(undefined);
      return;
    }
    getPreviousPaymentMethodByUser(userId).then((previousMethod) => {
      setPreviousPaymentMethod(
        isValidPaymentMethod(previousMethod) ? previousMethod : undefined,
      );
    });
  }, [userId, isValidPaymentMethod]);

  const recurringPaymentMethods = useMemo(
    () =>
      recurringPayments?.map(
        (recurringPayment): PaymentMethod => ({
          paymentType: recurringPayment.paymentType,
          recurringPayment: recurringPayment,
        }),
      ),
    [recurringPayments], // Only recalculate when recurringPayments changes
  );

  return {
    recurringPaymentMethods: userId ? recurringPaymentMethods : undefined,
    previousPaymentMethod: previousPaymentMethod,
  };
}

const hasPaymentCard = (paymentTypes: PaymentType[]): boolean => {
  const paymentCardTypes: PaymentType[] = [
    PaymentType.Amex,
    PaymentType.Visa,
    PaymentType.Mastercard,
  ];
  return paymentTypes.some((type) => paymentCardTypes.includes(type));
};

type PreviousPaymentMethods = {
  [key: string]: PaymentMethod | undefined;
};

async function getPreviousPaymentMethods(): Promise<PreviousPaymentMethods> {
  try {
    const previousMethodsJson = await storage.get(
      StorageModelKeysEnum.PreviousPaymentMethods,
    );
    if (previousMethodsJson) {
      const methods = JSON.parse(previousMethodsJson) as PreviousPaymentMethods;
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
  const methods = await getPreviousPaymentMethods();
  return methods[userId];
}

export async function savePreviousPaymentMethodByUser(
  userId: string,
  method: PaymentMethod,
): Promise<void> {
  const methods = await getPreviousPaymentMethods();
  try {
    methods[userId] = method;
    await storage.set(
      StorageModelKeysEnum.PreviousPaymentMethods,
      JSON.stringify(methods),
    );
  } catch (err: any) {
    Bugsnag.notify(err);
  }
}

/**
 * Fetches RecurringPayment data and saves it as the previous payment, or saves
 * the payment type if no recurring payment id is given.
 */
export const savePreviousPayment = async (
  userId: string | undefined,
  paymentType: PaymentType | undefined,
  recurringPaymentId?: number,
) => {
  if (!userId) return;

  if (!recurringPaymentId) {
    if (!paymentType) return;
    if (isNonRecurringPaymentType(paymentType)) {
      await savePreviousPaymentMethodByUser(userId, {
        paymentType: paymentType,
      });
    }
    await savePreviousPaymentMethodByUser(userId, {
      paymentType: PaymentType.PaymentCard,
    });
  } else {
    try {
      // Brief delay to display previous payment method immediately after adding a new card
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const recurringPaymentCards = await listRecurringPayments();
      const card = recurringPaymentCards.find((c) => {
        return c.id === recurringPaymentId;
      });
      if (card) {
        await savePreviousPaymentMethodByUser(userId, {
          paymentType: card.paymentType,
          recurringPayment: card,
        });
      }
    } catch {} // Just fail silently, as saving payment method is not critical
  }
};
