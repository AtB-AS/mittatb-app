import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {TripAnalytics} from '@atb/screen-components/travel-details-screens';

export type Root_PurchaseOverviewScreenParams = {
  selection: PurchaseSelectionType;
  refreshOffer?: boolean;
  mode?: 'Ticket' | 'TravelSearch';
  onFocusElement?: string;
  tripAnalytics?: TripAnalytics;
};
