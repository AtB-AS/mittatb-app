import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export type Root_PurchaseOverviewScreenParams = {
  selection: PurchaseSelectionType;
  refreshOffer?: boolean;
  mode?: 'Ticket' | 'TravelSearch';
  onFocusElement?: string;
};
