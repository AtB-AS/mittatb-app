import {useEffect} from 'react';
import {Linking} from 'react-native';
import {savePreviousPaymentMethodByUser} from '@atb/stacks-hierarchy/saved-payment-utils';
import {PaymentType, listRecurringPayments} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {SavedPaymentMethodType} from '@atb/stacks-hierarchy/types';

export const usePurchaseCallbackListener = (
  onCallback: () => void,
  paymentType?: PaymentType,
  recurringPaymentId?: number,
) => {
  const {userId} = useAuthState();
  useEffect(() => {
    const {remove: unsub} = Linking.addEventListener('url', async (event) => {
      if (event.url.includes('purchase-callback')) {
        if (paymentType) {
          await saveLastUsedPaymentMethod(
            userId,
            paymentType,
            recurringPaymentId,
          );
        }
        onCallback();
      }
    });
    return () => unsub();
  }, [onCallback, userId, paymentType, recurringPaymentId]);
};

const saveLastUsedPaymentMethod = async (
  userId: string | undefined,
  paymentType: PaymentType,
  recurringPaymentId?: number,
) => {
  if (!userId) return;

  if (!recurringPaymentId) {
    await savePreviousPaymentMethodByUser(userId, {
      savedType: SavedPaymentMethodType.Normal,
      paymentType: paymentType,
    });
  } else {
    try {
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
