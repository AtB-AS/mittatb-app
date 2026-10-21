import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {
  getListPaymentAgreementsQueryKey,
  stopPaymentAgreement,
} from '@atb/modules/ticketing';

/**
 * Stops a payment agreement. This is irreversible, a new agreement is needed to
 * pay without leaving the app again.
 */
export const useStopPaymentAgreementMutation = () => {
  const queryClient = useQueryClient();
  const {abtCustomerId, isLoggedIn} = useAuthContext();

  return useMutation({
    mutationFn: (paymentAgreementId: number) =>
      stopPaymentAgreement(paymentAgreementId),
    // Also when failing, since the agreement could have been stopped elsewhere.
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
      }),
  });
};
