import {useAuthContext} from '@atb/modules/auth';
import {
  PaymentAgreement,
  PaymentAgreementStatus,
  listPaymentAgreements,
} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';

const LIST_PAYMENT_AGREEMENTS_QUERY_KEY =
  'GET_LIST_PAYMENT_AGREEMENTS_QUERY_KEY';

export const getListPaymentAgreementsQueryKey = (
  abtCustomerId: string | undefined,
  isLoggedIn: boolean,
) => [LIST_PAYMENT_AGREEMENTS_QUERY_KEY, abtCustomerId, isLoggedIn];

const PENDING_PAYMENT_AGREEMENTS_REFETCH_INTERVAL_MS = 5 * ONE_SECOND_MS;

const hasStatus =
  (status: PaymentAgreementStatus) => (paymentAgreement: PaymentAgreement) =>
    paymentAgreement.status === status;

const selectPaymentAgreements = (paymentAgreements: PaymentAgreement[]) => ({
  active: paymentAgreements.filter(hasStatus(PaymentAgreementStatus.Active)),
  /** Still being created, e.g. waiting for the user to accept it in Vipps */
  pending: paymentAgreements.filter(hasStatus(PaymentAgreementStatus.Pending)),
});

/**
 * The user's active and pending payment agreements, fetched in one request so
 * they are always in sync. Like saved cards, payment agreements require the
 * user to be logged in, so there is no data until then.
 *
 * With `refetchWhilePending`, it refetches regularly while there are pending
 * agreements, so they move to the active ones as soon as they are ready.
 */
export const usePaymentAgreementsQuery = (
  enabled: boolean,
  {refetchWhilePending = false}: {refetchWhilePending?: boolean} = {},
) => {
  const {abtCustomerId, isLoggedIn} = useAuthContext();

  return useQuery({
    queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
    queryFn: () =>
      listPaymentAgreements([
        PaymentAgreementStatus.Pending,
        PaymentAgreementStatus.Active,
      ]),
    select: selectPaymentAgreements,
    refetchInterval: (query) =>
      refetchWhilePending &&
      query.state.data?.some(hasStatus(PaymentAgreementStatus.Pending))
        ? PENDING_PAYMENT_AGREEMENTS_REFETCH_INTERVAL_MS
        : false,
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
