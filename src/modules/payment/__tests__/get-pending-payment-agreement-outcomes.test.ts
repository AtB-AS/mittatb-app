import {getPendingPaymentAgreementOutcomes} from '../get-pending-payment-agreement-outcomes';
// Only types, since the ticketing module can't be loaded in tests
import type {PaymentAgreement} from '@atb/modules/ticketing';

const paymentAgreement = (
  id: number,
  status: 'PENDING' | 'ACTIVE',
): PaymentAgreement => ({
  id,
  status: status as PaymentAgreement['status'],
  createdAt: '2026-11-12T10:00:00Z',
});

const pending = (id: number) => paymentAgreement(id, 'PENDING');
const active = (id: number) => paymentAgreement(id, 'ACTIVE');

describe('getPendingPaymentAgreementOutcomes', () => {
  it('reports a pending agreement that is now active as activated', () => {
    expect(
      getPendingPaymentAgreementOutcomes([pending(1)], {
        active: [active(1)],
        pending: [],
      }),
    ).toEqual({activated: [active(1)], notActivated: []});
  });

  it('reports a pending agreement that is gone as not activated', () => {
    expect(
      getPendingPaymentAgreementOutcomes([pending(1)], {
        active: [],
        pending: [],
      }),
    ).toEqual({activated: [], notActivated: [pending(1)]});
  });

  it('reports nothing for an agreement that is still pending', () => {
    expect(
      getPendingPaymentAgreementOutcomes([pending(1)], {
        active: [],
        pending: [pending(1)],
      }),
    ).toEqual({activated: [], notActivated: []});
  });

  it('ignores active agreements that were not seen as pending', () => {
    expect(
      getPendingPaymentAgreementOutcomes([], {
        active: [active(1)],
        pending: [pending(2)],
      }),
    ).toEqual({activated: [], notActivated: []});
  });

  it('handles several agreements at once', () => {
    expect(
      getPendingPaymentAgreementOutcomes([pending(1), pending(2), pending(3)], {
        active: [active(1), active(4)],
        pending: [pending(3)],
      }),
    ).toEqual({activated: [active(1)], notActivated: [pending(2)]});
  });
});
