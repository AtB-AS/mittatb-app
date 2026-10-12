import {useAuthContext} from '@atb/modules/auth';
import {
  PaymentAgreementStatus,
  listPaymentAgreements,
} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const getListPaymentAgreementsQueryKey = (
  abtCustomerId: string | undefined,
  isLoggedIn: boolean,
) => ['GET_LIST_PAYMENT_AGREEMENTS_QUERY_KEY', abtCustomerId, isLoggedIn];

/**
 * The user's active payment agreements.
 */
export const useListPaymentAgreementsQuery = (enabled: boolean) => {
  const {abtCustomerId, isLoggedIn} = useAuthContext();

  return useQuery({
    queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
    queryFn: async () => {
      if (isLoggedIn && abtCustomerId) {
        return await listPaymentAgreements([PaymentAgreementStatus.Active]);
      }
      return [];
    },
    gcTime: ONE_HOUR_MS,
    // Failing should not keep the payment button disabled; paying with Vipps
    // without an agreement still works.
    retry: false,
    enabled,
  });
};
