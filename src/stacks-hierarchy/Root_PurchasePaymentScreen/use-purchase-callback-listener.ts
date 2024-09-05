import {useEffect} from 'react';
import {Linking} from 'react-native';
import {savePreviousPaymentOptionByUser} from '@atb/stacks-hierarchy/saved-payment-utils';
import {listRecurringPayments} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {PaymentOption} from '@atb/stacks-hierarchy/types';

export const usePurchaseCallbackListener = (
  onCallback: () => void,
  paymentMethod: PaymentOption,
  recurringPaymentId?: number,
) => {
  const {userId} = useAuthState();
  useEffect(() => {
    const {remove: unsub} = Linking.addEventListener('url', async (event) => {
      if (event.url.includes('purchase-callback')) {
        await saveLastUsedPaymentMethod(
          userId,
          paymentMethod,
          recurringPaymentId,
        );
        onCallback();
      }
    });
    return () => unsub();
  }, [onCallback, userId, paymentMethod, recurringPaymentId]);
};

const saveLastUsedPaymentMethod = async (
  userId: string | undefined,
  paymentMethod: PaymentOption,
  recurringPaymentId?: number,
) => {
  if (!userId) return;

  if (!recurringPaymentId) {
    await savePreviousPaymentOptionByUser(userId, {
      savedType: 'normal',
      paymentType: paymentMethod.paymentType,
    });
  } else {
    try {
      const recurringPaymentCards = await listRecurringPayments();
      const card = recurringPaymentCards.find((c) => {
        return c.id === recurringPaymentId;
      });
      if (card) {
        await savePreviousPaymentOptionByUser(userId, {
          savedType: 'recurring',
          paymentType: card.payment_type,
          recurringCard: card,
        });
      }
    } catch {} // Just fail silently, as saving payment method is not critical
  }
};
