import {usePreviousPaymentMethods} from '../previous-payment-utils';
import {isCardPaymentMethod} from '../utils';

export const useSelectedShmoPaymentMethod = (enabled: boolean = true) => {
  const {previousPaymentMethod, recurringPaymentMethods} =
    usePreviousPaymentMethods(enabled);

  const previousCardPaymentMethod = isCardPaymentMethod(previousPaymentMethod)
    ? previousPaymentMethod
    : undefined;

  const selectedShmoPaymentMethod =
    previousCardPaymentMethod ??
    (recurringPaymentMethods &&
      recurringPaymentMethods[recurringPaymentMethods.length - 1]);

  return selectedShmoPaymentMethod;
};
