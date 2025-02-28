import {TicketRecipientType} from '@atb/ticketing';
import {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export type Root_PurchaseConfirmationScreenParams = {
  selection: PurchaseSelectionType;
  mode?: 'TravelSearch' | 'Ticket';
  recipient?: TicketRecipientType;
};
