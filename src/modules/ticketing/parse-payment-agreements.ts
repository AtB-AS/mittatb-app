import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {z, ZodError} from 'zod';
import {PaymentAgreement, PaymentAgreementSchema} from './types';

/**
 * Parses the list of payment agreements from sales. Agreements that fail to
 * parse are left out and reported, so that one malformed agreement does not
 * hide the others. Throws if the response is not a list at all, as it would
 * otherwise be mistaken for the user having no agreements.
 */
export function parsePaymentAgreements(data: unknown): PaymentAgreement[] {
  const items = z.array(z.unknown()).parse(data);

  const paymentAgreements: PaymentAgreement[] = [];
  const zodErrors: {id?: unknown; error: ZodError}[] = [];
  for (const item of items) {
    const result = PaymentAgreementSchema.safeParse(item);
    if (result.success) {
      paymentAgreements.push(result.data);
    } else {
      const id =
        typeof item === 'object' && item !== null && 'id' in item
          ? item.id
          : undefined;
      zodErrors.push({id, error: result.error});
    }
  }

  if (zodErrors.length > 0) {
    notifyBugsnag('Failed to Zod parse payment agreements', {
      metadata: zodErrors,
    });
  }

  return paymentAgreements;
}
