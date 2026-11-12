import {useMutation, useQueryClient} from '@tanstack/react-query';
import {APP_SCHEME} from '@env';
import {useAuthContext} from '@atb/modules/auth';
import {
  addPaymentAgreement,
  getListPaymentAgreementsQueryKey,
  PaymentType,
} from '@atb/modules/ticketing';
import {openUrlOrThrow} from '@atb/utils/open-url';

export const useAddPaymentAgreementMutation = () => {
  const queryClient = useQueryClient();
  const {abtCustomerId, isLoggedIn} = useAuthContext();

  return useMutation({
    mutationFn: async (paymentType: PaymentType) => {
      const {confirmationUrl} = await addPaymentAgreement(
        paymentType,
        `${APP_SCHEME}://payment-methods`,
      );
      await openUrlOrThrow(confirmationUrl);
    },
    // Also when failing, since the agreement could have been created before
    // opening Vipps failed.
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
      }),
  });
};
