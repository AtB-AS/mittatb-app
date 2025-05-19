import {useEffect, useState} from 'react';
import {PaymentMethod} from '../types';
import {usePreviousPaymentMethods} from '../previous-payment-utils';
import {isCardPaymentMethod} from '../utils';

export const useSelectedShmoPaymentMethod = (): [
  PaymentMethod | undefined,
  React.Dispatch<React.SetStateAction<PaymentMethod | undefined>>,
] => {
  const [selectedShmoPaymentMethod, setSelectedShmoPaymentMethod] = useState<
    PaymentMethod | undefined
  >(undefined);

  const {previousPaymentMethod, recurringPaymentMethods} =
    usePreviousPaymentMethods();

  useEffect(() => {
    // If we have a previous card payment method (previousPaymentMethod might be set later so we need to check it)
    if (previousPaymentMethod !== undefined) {
      const previousCardPaymentMethod = isCardPaymentMethod(
        previousPaymentMethod,
      )
        ? previousPaymentMethod
        : undefined;

      // If we have a valid card payment method, use it
      if (previousCardPaymentMethod) {
        setSelectedShmoPaymentMethod(previousCardPaymentMethod);
        // This is bestcase scenario, we can return
        return;
      }
    }

    //use fallback
    if (recurringPaymentMethods?.length) {
      const fallbackPaymentMethod =
        recurringPaymentMethods[recurringPaymentMethods.length - 1];
      setSelectedShmoPaymentMethod(fallbackPaymentMethod);
    }
  }, [previousPaymentMethod, recurringPaymentMethods]);

  return [selectedShmoPaymentMethod, setSelectedShmoPaymentMethod];
};
