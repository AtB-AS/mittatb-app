import type {PaymentAgreement} from '@atb/modules/ticketing';

/**
 * Compares the payment agreements that were pending before with the current
 * ones. A pending agreement that is now active has been activated. One that is
 * gone was not activated, e.g. because it expired or was rejected in Vipps,
 * which can't be told apart since only pending and active agreements are
 * fetched.
 */
export const getPendingPaymentAgreementOutcomes = (
  previouslyPending: PaymentAgreement[],
  current: {active: PaymentAgreement[]; pending: PaymentAgreement[]},
) => {
  const activeIds = new Set(current.active.map(({id}) => id));
  const pendingIds = new Set(current.pending.map(({id}) => id));

  const activated = current.active.filter(({id}) =>
    previouslyPending.some((agreement) => agreement.id === id),
  );
  const notActivated = previouslyPending.filter(
    ({id}) => !activeIds.has(id) && !pendingIds.has(id),
  );

  return {activated, notActivated};
};
