import {PaymentAgreement, PaymentAgreementStatus, PaymentType} from '../types';
import {getLatestPaymentAgreement} from '../utils';

const agreement = (
  id: number,
  paymentType: PaymentType = PaymentType.Vipps,
): PaymentAgreement => ({
  id,
  status: PaymentAgreementStatus.Active,
  paymentType,
});

describe('getLatestPaymentAgreement', () => {
  it('returns undefined when there are no payment agreements', () => {
    expect(
      getLatestPaymentAgreement(undefined, PaymentType.Vipps),
    ).toBeUndefined();
    expect(getLatestPaymentAgreement([], PaymentType.Vipps)).toBeUndefined();
  });

  it('returns the only payment agreement', () => {
    expect(
      getLatestPaymentAgreement([agreement(5)], PaymentType.Vipps),
    ).toEqual(agreement(5));
  });

  it('returns the last one in the list, without assuming increasing ids', () => {
    expect(
      getLatestPaymentAgreement(
        [agreement(5), agreement(8), agreement(7)],
        PaymentType.Vipps,
      ),
    ).toEqual(agreement(7));
    expect(
      getLatestPaymentAgreement(
        [agreement(8), agreement(7), agreement(5)],
        PaymentType.Vipps,
      ),
    ).toEqual(agreement(5));
  });

  it('ignores agreements of other types, even if they are last', () => {
    expect(
      getLatestPaymentAgreement(
        [agreement(5), agreement(9, PaymentType.ApplePay)],
        PaymentType.Vipps,
      ),
    ).toEqual(agreement(5));
  });

  it('ignores agreements without a payment type', () => {
    const withoutPaymentType: PaymentAgreement = {
      id: 9,
      status: PaymentAgreementStatus.Active,
    };
    expect(
      getLatestPaymentAgreement(
        [agreement(5), withoutPaymentType],
        PaymentType.Vipps,
      ),
    ).toEqual(agreement(5));
  });

  it('returns undefined when there is none of the given type', () => {
    expect(
      getLatestPaymentAgreement(
        [agreement(9, PaymentType.ApplePay)],
        PaymentType.Vipps,
      ),
    ).toBeUndefined();
  });
});
