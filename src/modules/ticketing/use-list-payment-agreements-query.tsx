import {useAuthContext} from '@atb/modules/auth';
import {
  PaymentAgreement,
  PaymentAgreementStatus,
  listPaymentAgreements,
} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {getPendingPaymentAgreements} from './utils';

export const LIST_PAYMENT_AGREEMENTS_QUERY_KEY =
  'GET_LIST_PAYMENT_AGREEMENTS_QUERY_KEY';

export const getListPaymentAgreementsQueryKey = (
  abtCustomerId: string | undefined,
  isLoggedIn: boolean,
) => [LIST_PAYMENT_AGREEMENTS_QUERY_KEY, abtCustomerId, isLoggedIn];

const PENDING_PAYMENT_AGREEMENTS_REFETCH_INTERVAL_MS = 5 * ONE_SECOND_MS;

/**
 * Both active and pending payment agreements are fetched in one request, so
 * that the active and pending agreements are always in sync. Use the hooks
 * below instead of this directly.
 */
const usePaymentAgreementsQuery = <T,>(
  enabled: boolean,
  {
    select,
    refetchInterval,
  }: {
    select: (paymentAgreements: PaymentAgreement[]) => T;
    refetchInterval?: (
      paymentAgreements: PaymentAgreement[] | undefined,
    ) => number | false;
  },
) => {
  const {abtCustomerId, isLoggedIn} = useAuthContext();

  return useQuery({
    queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
    queryFn: () =>
      listPaymentAgreements([
        PaymentAgreementStatus.Created,
        PaymentAgreementStatus.Pending,
        PaymentAgreementStatus.Active,
      ]),
    select,
    refetchInterval: (query) => refetchInterval?.(query.state.data) ?? false,
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

const selectActivePaymentAgreements = (paymentAgreements: PaymentAgreement[]) =>
  paymentAgreements.filter(
    (paymentAgreement) =>
      paymentAgreement.status === PaymentAgreementStatus.Active,
  );

/**
 * The user's active payment agreements. Like saved cards, payment agreements
 * require the user to be logged in, so there is no data until then.
 */
export const useListPaymentAgreementsQuery = (enabled: boolean) =>
  usePaymentAgreementsQuery(enabled, {select: selectActivePaymentAgreements});

/**
 * The user's payment agreements that are still being created.
 *
 * With `refetchWhilePending`, it refetches regularly while there are any, so
 * they move to the active payment agreements as soon as they are ready.
 */
export const usePendingPaymentAgreementsQuery = (
  enabled: boolean,
  {refetchWhilePending = false}: {refetchWhilePending?: boolean} = {},
) =>
  usePaymentAgreementsQuery(enabled, {
    select: (paymentAgreements) =>
      getPendingPaymentAgreements(paymentAgreements, Date.now()),
    refetchInterval: (paymentAgreements) =>
      refetchWhilePending &&
      getPendingPaymentAgreements(paymentAgreements, Date.now()).length > 0
        ? PENDING_PAYMENT_AGREEMENTS_REFETCH_INTERVAL_MS
        : false,
  });
