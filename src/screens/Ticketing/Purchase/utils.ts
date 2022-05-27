import {PreassignedFareProduct} from '@atb/reference-data/types';
import {IndependentPeriodicTicket} from '@atb/screens/Ticketing/Tickets/IndependentPeriodicTicket';
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
  if (product.type === 'period') {
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

export const isIndependentPeriodicTicket = (
  type: string,
  durationDays: number,
) =>
  type === 'period' &&
  IndependentPeriodicTicket.some((ipt) => ipt.durationDays === durationDays);

export const isPeriodicTicket = (type: string, durationDays: number) =>
  type === 'period' && !isIndependentPeriodicTicket(type, durationDays);

export const getTicketType = (product: PreassignedFareProduct) =>
  IndependentPeriodicTicket.find(
    (ipt) => ipt.durationDays === product.durationDays,
  )?.type || product.type;

export const filterPeriodicTicket = (product: any, params: any) =>
  isIndependentPeriodicTicket(
    params.selectableProductType,
    params.selectableProductDuration,
  )
    ? product.durationDays === params.selectableProductDuration
    : !isIndependentPeriodicTicket(product.type, product.durationDays);
