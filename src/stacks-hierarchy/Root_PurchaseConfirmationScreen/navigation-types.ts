import {TicketRecipientType} from '@atb/modules/ticketing';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export type Root_PurchaseConfirmationScreenParams = {
  selection: PurchaseSelectionType;
  mode?: 'TravelSearch' | 'Ticket';
  recipient?: TicketRecipientType;
};
