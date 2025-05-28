import {usePreviousPaymentMethods} from '../previous-payment-utils';
import {isCardPaymentMethod} from '../utils';

export const useSelectedShmoPaymentMethod = () => {
  const {previousPaymentMethod, recurringPaymentMethods} =
    usePreviousPaymentMethods();

  const previousCardPaymentMethod = isCardPaymentMethod(previousPaymentMethod)
    ? previousPaymentMethod
    : undefined;

  const selectedShmoPaymentMethod =
    previousCardPaymentMethod ??
    (recurringPaymentMethods &&
      recurringPaymentMethods[recurringPaymentMethods.length - 1]);

  return selectedShmoPaymentMethod;
};
