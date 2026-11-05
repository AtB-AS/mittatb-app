import {getPendingPaymentAgreements} from '../utils';
import {PaymentAgreement, PaymentAgreementStatus, PaymentType} from '../types';

const NOW = new Date('2026-11-05T12:00:00Z').getTime();
const MINUTE_MS = 60 * 1000;

const paymentAgreement = (
  overrides: Partial<PaymentAgreement>,
): PaymentAgreement => ({
  id: 1,
  status: PaymentAgreementStatus.Pending,
  paymentType: PaymentType.Vipps,
  createdAt: new Date(NOW - MINUTE_MS).toISOString(),
  ...overrides,
});

describe('getPendingPaymentAgreements', () => {
  it('returns no agreements when they are not loaded', () => {
    expect(getPendingPaymentAgreements(undefined, NOW)).toEqual([]);
  });

  it('returns created and pending agreements', () => {
    const created = paymentAgreement({
      id: 1,
      status: PaymentAgreementStatus.Created,
    });
    const pending = paymentAgreement({
      id: 2,
      status: PaymentAgreementStatus.Pending,
    });
    expect(getPendingPaymentAgreements([created, pending], NOW)).toEqual([
      created,
      pending,
    ]);
  });

  it.each([
    PaymentAgreementStatus.Active,
    PaymentAgreementStatus.Stopped,
    PaymentAgreementStatus.Expired,
  ])('does not return %s agreements', (status) => {
    expect(
      getPendingPaymentAgreements([paymentAgreement({status})], NOW),
    ).toEqual([]);
  });

  it('does not return agreements of unsupported payment types', () => {
    expect(
      getPendingPaymentAgreements(
        [
          paymentAgreement({paymentType: PaymentType.Visa}),
          paymentAgreement({paymentType: undefined}),
        ],
        NOW,
      ),
    ).toEqual([]);
  });

  it('returns agreements created less than 10 minutes ago', () => {
    const agreement = paymentAgreement({
      createdAt: new Date(NOW - 10 * MINUTE_MS + 1).toISOString(),
    });
    expect(getPendingPaymentAgreements([agreement], NOW)).toEqual([agreement]);
  });

  it('does not return agreements created 10 minutes ago or more', () => {
    expect(
      getPendingPaymentAgreements(
        [
          paymentAgreement({
            createdAt: new Date(NOW - 10 * MINUTE_MS).toISOString(),
          }),
        ],
        NOW,
      ),
    ).toEqual([]);
  });
});
