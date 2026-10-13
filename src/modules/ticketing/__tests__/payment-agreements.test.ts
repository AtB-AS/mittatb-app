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

const vippsAgreement = {id: 11, status: 'ACTIVE', paymentType: 2};
const parsedVippsAgreement = {
  id: 11,
  status: PaymentAgreementStatus.Active,
  paymentType: PaymentType.Vipps,
};

describe('PaymentAgreementSchema', () => {
  it('parses a Vipps agreement', () => {
    expect(PaymentAgreementSchema.parse(vippsAgreement)).toEqual(
      parsedVippsAgreement,
    );
  });

  it('parses an agreement without a payment type', () => {
    expect(PaymentAgreementSchema.parse({id: 11, status: 'ACTIVE'})).toEqual({
      id: 11,
      status: PaymentAgreementStatus.Active,
    });
  });

  it.each([
    ['an unknown status', {id: 11, status: 'PAUSED', paymentType: 2}],
    ['an unknown payment type', {id: 11, status: 'ACTIVE', paymentType: 99}],
    [
      'a payment type given by name',
      {id: 11, status: 'ACTIVE', paymentType: 'Vipps'},
    ],
    ['an id that is not a number', {id: '11', status: 'ACTIVE'}],
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
      parsePaymentAgreements([vippsAgreement, {id: 12, status: 'ACTIVE'}]),
    ).toEqual([
      parsedVippsAgreement,
      {id: 12, status: PaymentAgreementStatus.Active},
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
      {id: 13, status: 'PAUSED'},
      'not an agreement',
    ]);

    expect(result).toEqual([parsedVippsAgreement]);
    expect(mockNotifyBugsnag).toHaveBeenCalledTimes(1);
    expect(mockNotifyBugsnag).toHaveBeenCalledWith(
      'Failed to Zod parse payment agreements',
      {
        metadata: [
          {id: 13, error: expect.any(ZodError)},
          {id: undefined, error: expect.any(ZodError)},
        ],
      },
    );
  });

  it('throws when the response is not a list, instead of looking like no agreements', () => {
    expect(() => parsePaymentAgreements({message: 'oops'})).toThrow(ZodError);
  });
});
