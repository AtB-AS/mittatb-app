import type {PurchaseSelectionType} from '@atb/purchase-selection';

export type Root_PurchaseOverviewScreenParams = {
  selection: PurchaseSelectionType;
  refreshOffer?: boolean;
  mode?: 'Ticket' | 'TravelSearch';
  onFocusElement?: string;
};
