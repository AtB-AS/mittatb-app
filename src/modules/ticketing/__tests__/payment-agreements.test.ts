import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {ZodError} from 'zod';
import {parsePaymentAgreements} from '../parse-payment-agreements';
import {
  AddPaymentAgreementResponseSchema,
  PaymentAgreementSchema,
  PaymentAgreementStatus,
  PaymentType,
} from '../types';

jest.mock('@atb/utils/bugsnag-utils', () => ({notifyBugsnag: jest.fn()}));

const mockNotifyBugsnag = jest.mocked(notifyBugsnag);

beforeEach(() => mockNotifyBugsnag.mockClear());

const createdAt = '2026-09-01T10:15:30Z';
const vippsAgreement = {id: 11, status: 'ACTIVE', paymentType: 2, createdAt};
const parsedVippsAgreement = {
  id: 11,
  status: PaymentAgreementStatus.Active,
  paymentType: PaymentType.Vipps,
  createdAt,
};

describe('PaymentAgreementSchema', () => {
  it('parses a Vipps agreement', () => {
    expect(PaymentAgreementSchema.parse(vippsAgreement)).toEqual(
      parsedVippsAgreement,
    );
  });

  it('parses an agreement without a payment type', () => {
    expect(
      PaymentAgreementSchema.parse({id: 11, status: 'ACTIVE', createdAt}),
    ).toEqual({id: 11, status: PaymentAgreementStatus.Active, createdAt});
  });

  it('parses when the agreement was last updated', () => {
    expect(
      PaymentAgreementSchema.parse({
        ...vippsAgreement,
        updatedAt: '2026-09-02T08:00:00.123+02:00',
      }),
    ).toEqual({
      ...parsedVippsAgreement,
      updatedAt: '2026-09-02T08:00:00.123+02:00',
    });
  });

  it.each([
    ['an unknown status', {...vippsAgreement, status: 'PAUSED'}],
    ['an unknown payment type', {...vippsAgreement, paymentType: 99}],
    ['a payment type given by name', {...vippsAgreement, paymentType: 'Vipps'}],
    ['an id that is not a number', {...vippsAgreement, id: '11'}],
    ['no creation time', {id: 11, status: 'ACTIVE', paymentType: 2}],
    ['a creation time that is null', {...vippsAgreement, createdAt: null}],
    [
      'a creation time that is not a timestamp',
      {...vippsAgreement, createdAt: 'yesterday'},
    ],
    [
      'a creation time without a time of day',
      {...vippsAgreement, createdAt: '2026-09-01'},
    ],
    [
      'a creation time that is a number',
      {...vippsAgreement, createdAt: 1788257730000},
    ],
    [
      'an update time that is not a timestamp',
      {...vippsAgreement, updatedAt: 'yesterday'},
    ],
  ])('rejects %s', (_, agreement) => {
    expect(PaymentAgreementSchema.safeParse(agreement).success).toBe(false);
  });
});

describe('AddPaymentAgreementResponseSchema', () => {
  it('parses a response', () => {
    const response = {
      confirmationUrl: 'https://example.com/confirm',
      agreementId: 12,
    };
    expect(AddPaymentAgreementResponseSchema.parse(response)).toEqual(response);
  });

  it('rejects a response without a confirmation URL', () => {
    expect(
      AddPaymentAgreementResponseSchema.safeParse({agreementId: 12}).success,
    ).toBe(false);
  });
});

describe('parsePaymentAgreements', () => {
  it('returns all valid agreements without reporting anything', () => {
    expect(
      parsePaymentAgreements([
        vippsAgreement,
        {id: 12, status: 'ACTIVE', createdAt},
      ]),
    ).toEqual([
      parsedVippsAgreement,
      {id: 12, status: PaymentAgreementStatus.Active, createdAt},
    ]);
    expect(mockNotifyBugsnag).not.toHaveBeenCalled();
  });

  it('returns an empty list when there are no agreements', () => {
    expect(parsePaymentAgreements([])).toEqual([]);
    expect(mockNotifyBugsnag).not.toHaveBeenCalled();
  });

  it('leaves out malformed agreements and reports them once', () => {
    const result = parsePaymentAgreements([
      vippsAgreement,
      {...vippsAgreement, id: 13, status: 'PAUSED'},
      {id: 14, status: 'ACTIVE', paymentType: 2},
      'not an agreement',
    ]);

    expect(result).toEqual([parsedVippsAgreement]);
    expect(mockNotifyBugsnag).toHaveBeenCalledTimes(1);
    expect(mockNotifyBugsnag).toHaveBeenCalledWith(
      'Failed to Zod parse payment agreements',
      {
        metadata: [
          {id: 13, error: expect.any(ZodError)},
          {id: 14, error: expect.any(ZodError)},
          {id: undefined, error: expect.any(ZodError)},
        ],
      },
    );
  });

  it('throws when the response is not a list, instead of looking like no agreements', () => {
    expect(() => parsePaymentAgreements({message: 'oops'})).toThrow(ZodError);
  });
});
