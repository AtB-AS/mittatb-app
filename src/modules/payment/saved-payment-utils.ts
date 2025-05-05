import {useCallback, useEffect, useMemo, useState} from 'react';
import {storage} from '@atb/storage';
import Bugsnag from '@bugsnag/react-native';
import {useAuthContext} from '@atb/auth';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {PaymentMethod, SavedPaymentMethodType} from './types';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {parseISO} from 'date-fns';
import {PaymentType, listRecurringPayments} from '@atb/ticketing';
import {onlyUniques} from '@atb/utils/only-uniques';

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

      // Since the stored payment could have been deleted, we need to check if
      // it is still in the list of recurring payments.
      if (paymentMethod.recurringCard) {
        const recurringPayment = recurringPayments?.find(
          (recurringPayment) =>
            recurringPayment.id === paymentMethod.recurringCard?.id,
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

  const recurringPaymentMethods = useMemo(
    () =>
      recurringPayments?.map(
        (recurringPayment): PaymentMethod => ({
          savedType: SavedPaymentMethodType.Recurring,
          paymentType: recurringPayment.payment_type,
          recurringCard: recurringPayment,
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

/**
 * Fetches RecurringPayment data and saves it as the previous payment, or saves
 * the payment type if no recurring payment id is given.
 */
export const saveLastUsedRecurringPaymentOrType = async (
  userId: string | undefined,
  paymentType: PaymentType | undefined,
  recurringPaymentId?: number,
) => {
  if (!userId) return;

  if (!recurringPaymentId) {
    if (!paymentType) return;
    await savePreviousPaymentMethodByUser(userId, {
      savedType: SavedPaymentMethodType.Normal,
      paymentType: paymentType,
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
          savedType: SavedPaymentMethodType.Recurring,
          paymentType: card.payment_type,
          recurringCard: card,
        });
      }
    } catch {} // Just fail silently, as saving payment method is not critical
  }
};
