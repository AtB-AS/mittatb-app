import {TicketRecipientType} from '@atb/modules/ticketing';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {TripAnalytics} from '@atb/screen-components/travel-details-screens';

export type Root_PurchaseConfirmationScreenParams = {
  selection: PurchaseSelectionType;
  mode?: 'TravelSearch' | 'Ticket';
  recipient?: TicketRecipientType;
  tripAnalytics?: TripAnalytics;
};
