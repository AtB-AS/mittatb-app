import {PreassignedFareProduct} from '@atb/reference-data/types';
import { PaymentType } from '@atb/tickets/types';
import { parseISO } from 'date-fns';

export type PurchaseFlow = {
  /**
   * Whether the traveller selection should allow a single traveller or
   * multiple travellers to be selected.
   */
  travellerSelectionMode: 'single' | 'multiple';

  /**
   * Whether the customer should be able to select a future start time for the
   * ticket.
   */
  travelDateSelectionEnabled: boolean;
};

export const getPurchaseFlow = (
  product: PreassignedFareProduct,
): PurchaseFlow => {
  if (product.type === 'period' || product.type === 'hour24') {
    return {
      travellerSelectionMode: 'single',
      travelDateSelectionEnabled: true,
    };
  } else {
    return {
      travellerSelectionMode: 'multiple',
      travelDateSelectionEnabled: false,
    };
  }
};

export function getExpireDate(iso: string): string {
  let date = parseISO(iso);
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month === 0) {
    month = 12;
    year--;
  }
  return `${month < 10 ? '0' + month : month}/${year.toString().slice(2, 4)}`;
}

export function getPaymentTypeName(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    default:
      return '';
  }
}

