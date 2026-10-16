import {useMutation} from '@tanstack/react-query';
import {APP_SCHEME} from '@env';
import {addPaymentAgreement, PaymentType} from '@atb/modules/ticketing';
import {openUrlOrThrow} from '@atb/utils/open-url';

/**
 * Creates a payment agreement for the payment type and opens its confirmation
 * URL, e.g. in the Vipps app. The agreement is not usable until the user has
 * confirmed it there, which sends the user back to the payment methods screen.
 */
export const useAddPaymentAgreementMutation = () =>
  useMutation({
    mutationFn: async (paymentType: PaymentType) => {
      const {confirmationUrl} = await addPaymentAgreement(
        paymentType,
        `${APP_SCHEME}://payment-methods`,
      );
      await openUrlOrThrow(confirmationUrl);
    },
  });
