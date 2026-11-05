import {getPendingPaymentAgreements} from '../utils';
import {PaymentAgreement, PaymentAgreementStatus, PaymentType} from '../types';

const paymentAgreement = (
  overrides: Partial<PaymentAgreement>,
): PaymentAgreement => ({
  id: 1,
  status: PaymentAgreementStatus.Pending,
  paymentType: PaymentType.Vipps,
  createdAt: '2026-11-05T12:00:00Z',
  ...overrides,
});

describe('getPendingPaymentAgreements', () => {
  it('returns no agreements when they are not loaded', () => {
    expect(getPendingPaymentAgreements(undefined)).toEqual([]);
  });

  it('returns pending agreements', () => {
    const pending = paymentAgreement({status: PaymentAgreementStatus.Pending});
    expect(getPendingPaymentAgreements([pending])).toEqual([pending]);
  });

  it.each([
    PaymentAgreementStatus.Created,
    PaymentAgreementStatus.Active,
    PaymentAgreementStatus.Stopped,
    PaymentAgreementStatus.Expired,
  ])('does not return %s agreements', (status) => {
    expect(getPendingPaymentAgreements([paymentAgreement({status})])).toEqual(
      [],
    );
  });

  it('does not return agreements of unsupported payment types', () => {
    expect(
      getPendingPaymentAgreements([
        paymentAgreement({paymentType: PaymentType.Visa}),
        paymentAgreement({paymentType: undefined}),
      ]),
    ).toEqual([]);
  });
});
