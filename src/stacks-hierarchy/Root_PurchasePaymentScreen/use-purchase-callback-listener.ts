import {useEffect} from 'react';
import {Linking} from 'react-native';
import {savePreviousPaymentMethodByUser} from '@atb/stacks-hierarchy/saved-payment-utils';
import {listRecurringPayments} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {PaymentMethod} from '@atb/stacks-hierarchy/types';

export const usePurchaseCallbackListener = (
  onCallback: () => void,
  paymentMethod: PaymentMethod,
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
  paymentMethod: PaymentMethod,
  recurringPaymentId?: number,
) => {
  if (!userId) return;

  if (!recurringPaymentId) {
    await savePreviousPaymentMethodByUser(userId, {
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
        await savePreviousPaymentMethodByUser(userId, {
          savedType: 'recurring',
          paymentType: card.payment_type,
          recurringCard: card,
        });
      }
    } catch {} // Just fail silently, as saving payment method is not critical
  }
};
