import {PaymentAgreement, PaymentAgreementStatus} from '../types';
import {getLatestPaymentAgreement} from '../utils';

const agreement = (id: number): PaymentAgreement => ({
  id,
  status: PaymentAgreementStatus.Active,
});

describe('getLatestPaymentAgreement', () => {
  it('returns undefined when there are no payment agreements', () => {
    expect(getLatestPaymentAgreement(undefined)).toBeUndefined();
    expect(getLatestPaymentAgreement([])).toBeUndefined();
  });

  it('returns the only payment agreement', () => {
    expect(getLatestPaymentAgreement([agreement(5)])).toEqual(agreement(5));
  });

  it('returns the one with the highest id, regardless of order', () => {
    expect(
      getLatestPaymentAgreement([agreement(5), agreement(8), agreement(7)]),
    ).toEqual(agreement(8));
    expect(
      getLatestPaymentAgreement([agreement(8), agreement(7), agreement(5)]),
    ).toEqual(agreement(8));
  });
});
