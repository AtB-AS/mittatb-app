import {useMutation} from '@tanstack/react-query';
import {APP_SCHEME} from '@env';
import {addPaymentAgreement, PaymentType} from '@atb/modules/ticketing';
import {openUrlOrThrow} from '@atb/utils/open-url';

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
