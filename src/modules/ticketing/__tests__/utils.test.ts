import {PaymentAgreement, PaymentAgreementStatus, PaymentType} from '../types';
import {getLatestPaymentAgreement} from '../utils';

const agreement = (
  id: number,
  createdAt: string,
  paymentType: PaymentType = PaymentType.Vipps,
): PaymentAgreement => ({
  id,
  status: PaymentAgreementStatus.Active,
  paymentType,
  createdAt,
});

describe('getLatestPaymentAgreement', () => {
  it('returns undefined when there are no payment agreements', () => {
    expect(
      getLatestPaymentAgreement(undefined, PaymentType.Vipps),
    ).toBeUndefined();
    expect(getLatestPaymentAgreement([], PaymentType.Vipps)).toBeUndefined();
  });

  it('returns the only payment agreement', () => {
    const only = agreement(5, '2026-09-01T10:00:00Z');
    expect(getLatestPaymentAgreement([only], PaymentType.Vipps)).toBe(only);
  });

  describe('returns the most recently created, without assuming that the ids or the list order tell it', () => {
    const oldest = agreement(8, '2026-09-01T10:00:00Z');
    const middle = agreement(5, '2026-09-02T10:00:00Z');
    const newest = agreement(7, '2026-09-03T10:00:00Z');

    it.each([
      ['oldest first', [oldest, middle, newest]],
      ['newest first', [newest, middle, oldest]],
      ['mixed', [middle, newest, oldest]],
    ])('when the list is ordered %s', (_, agreements) => {
      expect(getLatestPaymentAgreement(agreements, PaymentType.Vipps)).toBe(
        newest,
      );
    });
  });

  it('compares the moments in time, not the texts', () => {
    // 23:30 at +02:00 is 21:30 UTC, so before 22:00 UTC, although it sorts after
    const earlier = agreement(1, '2026-09-01T23:30:00+02:00');
    const later = agreement(2, '2026-09-01T22:00:00Z');
    expect(getLatestPaymentAgreement([earlier, later], PaymentType.Vipps)).toBe(
      later,
    );
    expect(getLatestPaymentAgreement([later, earlier], PaymentType.Vipps)).toBe(
      later,
    );
  });

  it('compares fractions of seconds', () => {
    const earlier = agreement(1, '2026-09-01T10:00:00Z');
    const later = agreement(2, '2026-09-01T10:00:00.500Z');
    expect(getLatestPaymentAgreement([later, earlier], PaymentType.Vipps)).toBe(
      later,
    );
  });

  it('returns the last one in the list when created at the same moment', () => {
    const first = agreement(1, '2026-09-01T10:00:00Z');
    const second = agreement(2, '2026-09-01T10:00:00Z');
    expect(getLatestPaymentAgreement([first, second], PaymentType.Vipps)).toBe(
      second,
    );
    expect(getLatestPaymentAgreement([second, first], PaymentType.Vipps)).toBe(
      first,
    );
  });

  describe('uses when the agreement was last updated, if it has been updated', () => {
    it('instead of when it was created', () => {
      const updatedLast = {
        ...agreement(1, '2026-09-01T10:00:00Z'),
        updatedAt: '2026-09-05T10:00:00Z',
      };
      const createdLast = agreement(2, '2026-09-02T10:00:00Z');
      expect(
        getLatestPaymentAgreement(
          [updatedLast, createdLast],
          PaymentType.Vipps,
        ),
      ).toBe(updatedLast);
      expect(
        getLatestPaymentAgreement(
          [createdLast, updatedLast],
          PaymentType.Vipps,
        ),
      ).toBe(updatedLast);
    });

    it('which is compared with when the others were created', () => {
      const updatedEarly = {
        ...agreement(1, '2026-09-01T10:00:00Z'),
        updatedAt: '2026-09-02T10:00:00Z',
      };
      const createdAfter = agreement(2, '2026-09-03T10:00:00Z');
      expect(
        getLatestPaymentAgreement(
          [updatedEarly, createdAfter],
          PaymentType.Vipps,
        ),
      ).toBe(createdAfter);
      expect(
        getLatestPaymentAgreement(
          [createdAfter, updatedEarly],
          PaymentType.Vipps,
        ),
      ).toBe(createdAfter);
    });

    it('as moments in time, not texts', () => {
      // 23:30 at +02:00 is 21:30 UTC, so before 22:00 UTC, although it sorts after
      const updatedEarlier = {
        ...agreement(1, '2026-09-01T10:00:00Z'),
        updatedAt: '2026-09-01T23:30:00+02:00',
      };
      const updatedLater = {
        ...agreement(2, '2026-09-01T10:00:00Z'),
        updatedAt: '2026-09-01T22:00:00Z',
      };
      expect(
        getLatestPaymentAgreement(
          [updatedEarlier, updatedLater],
          PaymentType.Vipps,
        ),
      ).toBe(updatedLater);
      expect(
        getLatestPaymentAgreement(
          [updatedLater, updatedEarlier],
          PaymentType.Vipps,
        ),
      ).toBe(updatedLater);
    });
  });

  it('ignores agreements of other types, even if they are newer', () => {
    const vipps = agreement(5, '2026-09-01T10:00:00Z');
    const applePay = agreement(9, '2026-09-02T10:00:00Z', PaymentType.ApplePay);
    expect(
      getLatestPaymentAgreement([vipps, applePay], PaymentType.Vipps),
    ).toBe(vipps);
  });

  it('ignores agreements without a payment type, even if they are newer', () => {
    const vipps = agreement(5, '2026-09-01T10:00:00Z');
    const withoutPaymentType: PaymentAgreement = {
      id: 9,
      status: PaymentAgreementStatus.Active,
      createdAt: '2026-09-02T10:00:00Z',
    };
    expect(
      getLatestPaymentAgreement([vipps, withoutPaymentType], PaymentType.Vipps),
    ).toBe(vipps);
  });

  it('returns undefined when there is none of the given type', () => {
    expect(
      getLatestPaymentAgreement(
        [agreement(9, '2026-09-01T10:00:00Z', PaymentType.ApplePay)],
        PaymentType.Vipps,
      ),
    ).toBeUndefined();
  });
});
