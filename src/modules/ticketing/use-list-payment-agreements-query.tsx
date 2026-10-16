import {useAuthContext} from '@atb/modules/auth';
import {
  PaymentAgreementStatus,
  listPaymentAgreements,
} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const LIST_PAYMENT_AGREEMENTS_QUERY_KEY =
  'GET_LIST_PAYMENT_AGREEMENTS_QUERY_KEY';

export const getListPaymentAgreementsQueryKey = (
  abtCustomerId: string | undefined,
  isLoggedIn: boolean,
) => [LIST_PAYMENT_AGREEMENTS_QUERY_KEY, abtCustomerId, isLoggedIn];

/**
 * The user's active payment agreements. Like saved cards, payment agreements
 * require the user to be logged in, so there is no data until then.
 */
export const useListPaymentAgreementsQuery = (enabled: boolean) => {
  const {abtCustomerId, isLoggedIn} = useAuthContext();

  return useQuery({
    queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
    queryFn: () => listPaymentAgreements([PaymentAgreementStatus.Active]),
    gcTime: ONE_HOUR_MS,
    // The agreements can change outside of the app, e.g. when activating one in
    // Vipps, so refetch when the app is opened again.
    refetchOnWindowFocus: true,
    // Failing should not keep the payment button disabled; paying with Vipps
    // without an agreement still works.
    retry: false,
    enabled: enabled && isLoggedIn && !!abtCustomerId,
  });
};
