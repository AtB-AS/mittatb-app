import {useAuthContext} from '@atb/modules/auth';
import {
  PaymentAgreement,
  PaymentAgreementStatus,
  listPaymentAgreements,
} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {parseDate} from '@atb/utils/date';

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

// Vipps expires pending agreements after 10 minutes, so don't show them as
// pending for longer, even if they haven't been marked as expired yet.
const PENDING_PAYMENT_AGREEMENT_MAX_AGE_MS = 10 * ONE_MINUTE_MS;

/** Still being created, e.g. waiting for the user to accept it in Vipps */
const isPendingPaymentAgreement = (paymentAgreement: PaymentAgreement) =>
  paymentAgreement.status === PaymentAgreementStatus.Pending &&
  Date.now() - parseDate(paymentAgreement.createdAt).getTime() <
    PENDING_PAYMENT_AGREEMENT_MAX_AGE_MS;

const selectPaymentAgreements = (paymentAgreements: PaymentAgreement[]) => ({
  active: paymentAgreements.filter(hasStatus(PaymentAgreementStatus.Active)),
  pending: paymentAgreements.filter(isPendingPaymentAgreement),
});

/**
 * The user's active and pending payment agreements, fetched in one request so
 * they are always in sync. Like saved cards, payment agreements require the
 * user to be logged in, so there is no data until then.
 *
 * With `refetchWhilePending`, it refetches regularly while there are pending
 * agreements, so they move to the active ones as soon as they are ready.
 *
 * With `refetchOnWindowFocus`, it refetches when the app is opened again, since
 * the agreements can change outside of the app, e.g. when activating one in
 * Vipps.
 */
export const usePaymentAgreementsQuery = (
  enabled: boolean,
  {
    refetchWhilePending = false,
    refetchOnWindowFocus = false,
  }: {refetchWhilePending?: boolean; refetchOnWindowFocus?: boolean} = {},
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
    // Gives every response a new reference, so the selected pending agreements
    // are filtered by age again even when nothing else has changed
    structuralSharing: false,
    refetchInterval: (query) =>
      refetchWhilePending && query.state.data?.some(isPendingPaymentAgreement)
        ? PENDING_PAYMENT_AGREEMENTS_REFETCH_INTERVAL_MS
        : false,
    // Long enough to reuse the agreements preloaded on the purchase overview
    // screen. Changes made in the app invalidate them anyway.
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_HOUR_MS,
    // Also when not stale, since the agreements may have changed in Vipps
    refetchOnWindowFocus: refetchOnWindowFocus ? 'always' : false,
    enabled: enabled && isLoggedIn && !!abtCustomerId,
  });
};
